-- Dashboard: Decisions Needed table (conservative derived decisions from project status/lifecycle, latest runs, and current artefacts). Read-only.
-- Dashboard: Decisions Needed (read-only)
-- Conservative, derived "decision/review needed" signals.
-- No dedicated decisions/approvals table exists in current schema.
--
-- Lifecycle predicate:
-- - Lifecycle-driven flags fire when the project's phase has phase_intent = 'INITIATION'
--   (methodology-agnostic, sourced via projects.lifecycle_phase_id -> delivery_model_phases).
-- - Output column lifecycle_stage resolves to phase_name.
with org_scope as (
  select nullif({{ currentOrgIdState.value }}, '')::uuid as org_id
),
latest_runs as (
  select distinct on (gr.entity_id)
    gr.entity_id as project_id,
    gr.status as latest_run_status,
    gr.current_stage,
    gr.completed_at,
    gr.updated_at as run_updated_at
  from generation_runs gr
  cross join org_scope os
  where gr.org_id = os.org_id
    and gr.entity_type = 'Project'
  order by gr.entity_id, gr.created_at desc
),
current_artefacts as (
  select
    av.entity_id as project_id,
    count(*) filter (where av.is_current = true) as current_artefact_count
  from artefact_versions av
  cross join org_scope os
  where av.org_id = os.org_id
    and av.entity_type = 'Project'
  group by av.entity_id
),
project_lifecycle as (
  select
    p.project_id,
    dmp_lc.phase_intent,
    dmp_lc.phase_name as lifecycle_stage_display,
    (dmp_lc.phase_intent = 'INITIATION') as is_initiation_phase
  from projects p
  left join delivery_model_phases dmp_lc
    on dmp_lc.phase_id = p.lifecycle_phase_id
)
select
  p.project_id,
  p.project_name,
  case
    when lr.project_id is null then 'Generate initial governance artefacts'
    when lower(coalesce(lr.latest_run_status, '')) in ('failed', 'error') then 'Inspect failed generation run'
    when coalesce(ca.current_artefact_count, 0) = 0 then 'Review missing current artefacts'
    when lower(coalesce(p.status, '')) in ('draft', 'initiation', 'pending approval', 'decision required') then 'Review project decision and approval position'
    when pl.is_initiation_phase then 'Confirm mobilisation decision and next-stage approval'
    else 'Review project governance position'
  end as decision_needed,
  case
    when lower(coalesce(lr.latest_run_status, '')) in ('failed', 'error') then 'High'
    when coalesce(ca.current_artefact_count, 0) = 0 then 'High'
    when lower(coalesce(p.status, '')) in ('decision required', 'pending approval') then 'High'
    when pl.is_initiation_phase then 'Medium'
    else 'Low'
  end as priority,
  null::timestamptz as due_date,
  p.status,
  pl.lifecycle_stage_display as lifecycle_stage,
  lr.completed_at as last_generated_at
from projects p
cross join org_scope os
left join latest_runs lr
  on lr.project_id = p.project_id
left join current_artefacts ca
  on ca.project_id = p.project_id
left join project_lifecycle pl
  on pl.project_id = p.project_id
where p.org_id = os.org_id
  and (
    lr.project_id is null
    or lower(coalesce(lr.latest_run_status, '')) in ('failed', 'error')
    or coalesce(ca.current_artefact_count, 0) = 0
    or lower(coalesce(p.status, '')) in ('draft', 'initiation', 'pending approval', 'decision required')
    or pl.is_initiation_phase
  )
order by
  case
    when lower(coalesce(lr.latest_run_status, '')) in ('failed', 'error') then 1
    when coalesce(ca.current_artefact_count, 0) = 0 then 2
    when lower(coalesce(p.status, '')) in ('decision required', 'pending approval') then 3
    when pl.is_initiation_phase then 4
    else 5
  end,
  coalesce(lr.run_updated_at, p.updated_at, p.created_at) desc
limit 10;