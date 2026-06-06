// Charter page: project selector options (read-only).
// Mirrors /context/linked-classic-app/lib/getProjectsForSelector.sql.

type Params = { orgId: string | null }

export type ProjectSelectorRow = {
  project_id: string
  project_name: string | null
  project_code: string
}

const SQL = `
select
  project_id,
  nullif(trim(project_name), '') as project_name,
  project_code
from projects
where org_id = nullif($1, '')::uuid
order by coalesce(nullif(trim(project_name), ''), project_code);
`

export default async function getProjectsForSelector(
  req: { params: Params; user: User },
): Promise<ProjectSelectorRow[]> {
  const orgId = req.params.orgId ?? ''
  const result = await forgeSupabaseShadow2.query<ProjectSelectorRow>(SQL, [orgId])
  return result.data
}
