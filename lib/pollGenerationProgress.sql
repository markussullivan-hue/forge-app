-- pollGenerationProgress (run_id-driven)
-- Drives in-flight progress UI and (via its success events) finalises
-- the wizard once status reaches 'Completed' or 'Failed'.
with input_values as (
  select
    nullif({{ currentRunIdState.value || '' }}, '')::uuid                                       as run_id,
    nullif({{ currentOrgIdState.value || createdOrgIdState.value || '' }}, '')::uuid            as org_id,
    nullif({{ selectedProjectIdState.value || createdProjectIdState.value || '' }}, '')::uuid   as entity_id,
    nullif({{ generationStartedAt.value || '' }}, '')::timestamptz                              as started_at
)
select
  gr.run_id,
  gr.current_stage,
  coalesce(array_length(gr.stages_completed, 1), 0) as stages_done,
  gr.stages_completed,
  gr.status,
  gr.updated_at
from generation_runs gr
cross join input_values i
where
     (i.run_id is not null and gr.run_id = i.run_id)
  or (
       i.run_id is null
       and gr.org_id      = i.org_id
       and gr.entity_type = 'Project'
       and gr.entity_id   = i.entity_id
       and gr.created_at >= coalesce(i.started_at, '1970-01-01T00:00:00Z'::timestamptz)
     )
order by gr.created_at desc
limit 1;