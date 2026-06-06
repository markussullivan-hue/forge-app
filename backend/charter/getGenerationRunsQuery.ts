// Charter page: generation run rows for the current org (read-only).
// Mirrors /context/linked-classic-app/lib/getGenerationRunsQuery.sql with an
// optional project filter (the classic query was org-scoped only; we expose a
// `projectId` param so callers can scope further when needed).

type Params = {
  orgId: string | null
  projectId?: string | null
}

export type GenerationRunRow = {
  run_id: string
  org_id: string
  entity_type: string
  entity_id: string | null
  correlation_id: string | null
  workflow_run_id: string | null
  status: string | null
  current_stage: string | null
  stages_completed: unknown
  is_regeneration: boolean | null
  error_message: string | null
  total_duration_ms: number | null
  initiated_by_email: string | null
  started_at: string | null
  completed_at: string | null
  updated_at: string | null
  created_at: string | null
}

const SQL = `
select
  run_id,
  org_id,
  entity_type,
  entity_id,
  correlation_id,
  workflow_run_id,
  status,
  current_stage,
  stages_completed,
  is_regeneration,
  error_message,
  total_duration_ms,
  initiated_by_email,
  started_at,
  completed_at,
  updated_at,
  created_at
from generation_runs
where
  (nullif($1, '') is null or org_id = nullif($2, '')::uuid)
  and (nullif($3, '') is null or entity_id = nullif($4, '')::uuid)
order by created_at desc;
`

export default async function getGenerationRunsQuery(
  req: { params: Params; user: User },
): Promise<GenerationRunRow[]> {
  const orgId = req.params.orgId ?? ''
  const projectId = req.params.projectId ?? ''
  const result = await forgeSupabaseShadow2.query<GenerationRunRow>(SQL, [orgId, orgId, projectId, projectId])
  return result.data
}
