// Ports /context/linked-classic-app/lib/pollGenerationProgress.sql.
// Read-only: returns the most-recent generation_runs row for the
// project (optionally filtered by run_id).

type Params = {
  orgId: string
  projectId: string
  runId?: string | null
  generationStartedAt?: string | null
}

type ProgressRow = {
  run_id: string | null
  current_stage: string | null
  stages_done: number
  stages_completed: string[] | null
  status: string | null
  updated_at: string | null
}

export type PollGenerationProgressResult = ProgressRow | null

const SQL = `
with input_values as (
  select
    nullif($1, '')::uuid          as org_id,
    nullif($2, '')::uuid          as entity_id,
    nullif($3, '')::uuid          as run_id,
    nullif($4, '')::timestamptz   as started_at
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
`

export default async function pollGenerationProgress(
  req: { params: Params },
): Promise<PollGenerationProgressResult> {
  const p = req.params
  const result = await forgeSupabaseShadow2.query<ProgressRow>(SQL, [
    p.orgId ?? '',
    p.projectId ?? '',
    p.runId ?? '',
    p.generationStartedAt ?? '',
  ])
  return result.data[0] ?? null
}
