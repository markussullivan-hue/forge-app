-- Dashboard: Recent Generation Runs table (most recent runs for current organisation). Read-only.
-- Dashboard: Recent Generation Runs (read-only)
-- Most recent generation runs for the current organisation.

with org_scope as (
  select nullif({{ currentOrgIdState.value }}, '')::uuid as org_id
)
select
  gr.run_id,
  gr.entity_id as project_id,
  coalesce(p.project_name, 'Unknown project') as project_name,
  gr.status as run_status,
  gr.current_stage,
  gr.stages_completed,
  gr.started_at,
  gr.completed_at,
  gr.updated_at,
  case
    when lower(coalesce(gr.status, '')) = 'completed' then 'Review'
    when lower(coalesce(gr.status, '')) in ('failed', 'error') then 'Inspect'
    else 'View'
  end as action_label
from generation_runs gr
cross join org_scope os
left join projects p
  on p.project_id = gr.entity_id
 and p.org_id = gr.org_id
where gr.org_id = os.org_id
  and gr.entity_type = 'Project'
order by coalesce(gr.completed_at, gr.updated_at, gr.started_at, gr.created_at) desc
limit 10;