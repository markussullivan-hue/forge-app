// Charter page: latest PDF metadata for a project/run (read-only).
// Mirrors /context/linked-classic-app/lib/getLatestPdfForEntity.sql.
//
// Primary path: look up the run captured at trigger time (`runId`).
// Fallback: latest run for the supplied org + project.

type Params = {
  runId?: string | null
  orgId: string | null
  entityId: string | null
}

export type LatestPdfRow = {
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
with input_values as (
  select
    nullif($1, '')::uuid as run_id,
    nullif($2, '')::uuid as org_id,
    nullif($3, '')::uuid as entity_id
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
`

export default async function getLatestPdfForEntity(
  req: { params: Params; user: User },
): Promise<LatestPdfRow[]> {
  const runId = req.params.runId ?? ''
  const orgId = req.params.orgId ?? ''
  const entityId = req.params.entityId ?? ''
  const result = await forgeSupabaseShadow2.query<LatestPdfRow>(SQL, [runId, orgId, entityId])
  return result.data
}
