// Charter page: latest completed run's PDFMonkey URLs for a project (read-only).
// Mirrors /context/linked-classic-app/lib/getActiveProjectPdf.sql.
//
// The `artefactCode` param is accepted to mirror the classic call surface even
// though the SQL itself does not filter on artefact_code (the underlying run
// always belongs to the same project regardless of which artefact tab is open).

type Params = {
  orgId: string | null
  projectId: string | null
  artefactCode?: string | null
}

export type ActiveProjectPdfRow = {
  run_id: string
  project_id: string | null
  run_status: string | null
  current_stage: string | null
  stages_completed: unknown
  run_created_at: string | null
  run_updated_at: string | null
  run_completed_at: string | null
  pdfmonkey_status: string | null
  pdfmonkey_document_id: string | null
  pdfmonkey_preview_url: string | null
  pdfmonkey_download_url: string | null
  pdfmonkey_filename: string | null
  pdfmonkey_failure_cause: string | null
}

const SQL = `
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
where gr.org_id      = nullif($1, '')::uuid
  and gr.entity_type = 'Project'
  and gr.entity_id   = nullif($2, '')::uuid
  and gr.status      = 'Completed'
order by gr.completed_at desc nulls last
limit 1;
`

export default async function getActiveProjectPdf(
  req: { params: Params; user: User },
): Promise<ActiveProjectPdfRow[]> {
  void req.params.artefactCode
  const orgId = req.params.orgId ?? ''
  const projectId = req.params.projectId ?? ''
  const result = await forgeSupabaseShadow2.query<ActiveProjectPdfRow>(SQL, [orgId, projectId])
  return result.data
}
