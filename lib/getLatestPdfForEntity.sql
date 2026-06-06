-- getLatestPdfForEntity (run_id-driven)
-- Primary path: look up the run captured at trigger time
-- (currentRunIdState). Fallback: latest run for the wizard's selected
-- or just-created project. No more "most recent project by user in
-- 15 minutes" heuristic.
with input_values as (
  select
    nullif({{ currentRunIdState.value || '' }}, '')::uuid                                       as run_id,
    nullif({{ currentOrgIdState.value || createdOrgIdState.value || '' }}, '')::uuid            as org_id,
    nullif({{ selectedProjectIdState.value || createdProjectIdState.value || '' }}, '')::uuid   as entity_id
),
target_run as (
  select gr.*
  from generation_runs gr
  cross join input_values i
  where
       (i.run_id is not null and gr.run_id = i.run_id)
    or (
         i.run_id is null
         and gr.org_id      = i.org_id
         and gr.entity_type = 'Project'
         and gr.entity_id   = i.entity_id
       )
  order by gr.created_at desc
  limit 1
)
select
  tr.run_id,
  tr.entity_id                                              as project_id,
  tr.status                                                 as run_status,
  tr.current_stage,
  tr.stages_completed,
  tr.created_at                                             as run_created_at,
  tr.updated_at                                             as run_updated_at,
  tr.completed_at                                           as run_completed_at,
  tr.additional_metadata_json ->> 'pdfmonkey_status'        as pdfmonkey_status,
  tr.additional_metadata_json ->> 'pdfmonkey_document_id'   as pdfmonkey_document_id,
  tr.additional_metadata_json ->> 'pdfmonkey_preview_url'   as pdfmonkey_preview_url,
  tr.additional_metadata_json ->> 'pdfmonkey_download_url'  as pdfmonkey_download_url,
  tr.additional_metadata_json ->> 'pdfmonkey_filename'      as pdfmonkey_filename,
  tr.additional_metadata_json ->> 'pdfmonkey_failure_cause' as pdfmonkey_failure_cause
from target_run tr;