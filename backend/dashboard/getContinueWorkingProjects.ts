// Dashboard: Continue Working (read-only).
// Mirrors /context/linked-classic-app/lib/getContinueWorkingProjects.sql.

type Params = { orgId: string | null }

export type ContinueWorkingProjectRow = {
  project_id: string
  project_name: string
  business_unit: string
  lifecycle_stage: string | null
  status: string | null
  delivery_confidence: string
  risk_level: string
  last_updated_at: string | null
  last_generated_at: string | null
  action_label: string
}

const SQL = `
with org_scope as (
  select nullif($1, '')::uuid as org_id
),
latest_runs as (
  select distinct on (gr.entity_id)
    gr.entity_id as project_id,
    gr.status as latest_run_status,
    gr.current_stage,
    gr.completed_at,
    gr.updated_at as run_updated_at
  from generation_runs gr
  cross join org_scope os
  where gr.org_id = os.org_id
    and gr.entity_type = 'Project'
  order by gr.entity_id, gr.created_at desc
)
select
  p.project_id,
  p.project_name,
  ''::text as business_unit,
  dmp_lc.phase_name as lifecycle_stage,
  p.status,
  ''::text as delivery_confidence,
  ''::text as risk_level,
  coalesce(p.updated_at, p.created_at) as last_updated_at,
  lr.completed_at as last_generated_at,
  case
    when lr.project_id is null then 'Start'
    when lower(coalesce(lr.latest_run_status, '')) = 'completed' then 'Review'
    else 'Continue'
  end as action_label
from projects p
cross join org_scope os
left join latest_runs lr
  on lr.project_id = p.project_id
left join delivery_model_phases dmp_lc
  on dmp_lc.phase_id = p.lifecycle_phase_id
where p.org_id = os.org_id
order by coalesce(lr.run_updated_at, p.updated_at, p.created_at) desc
limit 10;
`

export default async function getContinueWorkingProjects(
  req: { params: Params; user: User },
): Promise<ContinueWorkingProjectRow[]> {
  const orgId = req.params.orgId ?? ''
  const result = await forgeSupabaseShadow2.query<ContinueWorkingProjectRow>(SQL, [orgId])
  return result.data
}
