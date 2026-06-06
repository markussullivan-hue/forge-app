// Dashboard: Recent Generation Runs (read-only).
// Mirrors /context/linked-classic-app/lib/getRecentGenerationRuns.sql with the
// `{{ currentOrgIdState.value }}` mustache replaced by $1::uuid.

type Params = { orgId: string | null }

export type RecentGenerationRunRow = {
  run_id: string
  project_id: string | null
  project_name: string
  run_status: string | null
  current_stage: string | null
  stages_completed: unknown
  started_at: string | null
  completed_at: string | null
  updated_at: string | null
  action_label: string
}

const SQL = `
with org_scope as (
  select nullif($1, '')::uuid as org_id
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
`

export default async function getRecentGenerationRuns(
  req: { params: Params; user: User },
): Promise<RecentGenerationRunRow[]> {
  const orgId = req.params.orgId ?? ''
  const result = await forgeSupabaseShadow2.query<RecentGenerationRunRow>(SQL, [orgId])
  return result.data
}
