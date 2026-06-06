-- Latest completed run's PDFMonkey URLs for the currently-selected project.
-- Used by CharterGenerationPage's PDF tab and the Preview/Download buttons.

select
  gr.run_id,
  gr.entity_id                                              as project_id,
  gr.status                                                 as run_status,
  gr.current_stage,
  gr.stages_completed,
  gr.created_at                                             as run_created_at,
  gr.updated_at                                             as run_updated_at,
  gr.completed_at                                           as run_completed_at,
  gr.additional_metadata_json ->> 'pdfmonkey_status'        as pdfmonkey_status,
  gr.additional_metadata_json ->> 'pdfmonkey_document_id'   as pdfmonkey_document_id,
  gr.additional_metadata_json ->> 'pdfmonkey_preview_url'   as pdfmonkey_preview_url,
  gr.additional_metadata_json ->> 'pdfmonkey_download_url'  as pdfmonkey_download_url,
  gr.additional_metadata_json ->> 'pdfmonkey_filename'      as pdfmonkey_filename,
  gr.additional_metadata_json ->> 'pdfmonkey_failure_cause' as pdfmonkey_failure_cause
from generation_runs gr
where gr.org_id      = nullif({{ currentOrgIdState.value }}, '')::uuid
  and gr.entity_type = 'Project'
  and gr.entity_id   = nullif({{ selectedProjectIdState.value }}, '')::uuid
  and gr.status      = 'Completed'
order by gr.completed_at desc nulls last
limit 1;