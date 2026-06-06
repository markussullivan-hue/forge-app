-- Dashboard KPI rollups (read-only). Returns a single row for the current organisation (scoped by currentOrgIdState).
-- Dashboard KPIs (read-only)
--
-- Org scoping:
-- - Uses currentOrgIdState.value (resolved elsewhere via getCurrentOrgId).
-- - If currentOrgIdState.value is null/empty, org_id will be NULL and counts will return 0.
--   TODO: Decide desired behaviour for "no org" case (e.g., show all orgs for admins vs. force selection).
--
-- Lifecycle predicate:
-- - "Projects requiring decision" matches projects whose lifecycle phase has phase_intent = 'INITIATION'
--   (methodology-agnostic, sourced via projects.lifecycle_phase_id -> delivery_model_phases).
with org_scope as (
  select nullif({{ currentOrgIdState.value }}, '')::uuid as org_id
)
select
  (
    select count(*)
    from projects p, org_scope os
    where p.org_id = os.org_id
  )::bigint as active_projects,
  (
    select count(*)
    from projects p
    cross join org_scope os
    left join delivery_model_phases dmp_lc
      on dmp_lc.phase_id = p.lifecycle_phase_id
    where p.org_id = os.org_id
      and (
        lower(coalesce(p.status, '')) in ('draft', 'initiation', 'pending approval', 'decision required')
        or dmp_lc.phase_intent = 'INITIATION'
      )
  )::bigint as projects_requiring_decision,
  (
    select count(*)
    from artefact_versions av, org_scope os
    where av.org_id = os.org_id
  )::bigint as artefacts_generated,
  (
    select count(*)
    from risks r, org_scope os
    where r.org_id = os.org_id
      and lower(coalesce(r.status, 'open')) not in ('closed', 'resolved', 'cancelled')
  )::bigint as open_risks,
  (
    select count(*)
    from generation_runs gr, org_scope os
    where gr.org_id = os.org_id
      and lower(coalesce(gr.status, '')) = 'completed'
  )::bigint as runs_completed,
  (
    -- artefact_versions does not currently have an approval_status column.
    -- TODO: Define approval/review model for artefacts (e.g., via content_metadata / additional_metadata_json)
    --       and replace this placeholder.
    select 0
  )::bigint as items_needing_review;