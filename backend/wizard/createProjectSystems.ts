// Ports createProjectSystems to a parameterised serverless function. Deletes
// any existing project_systems rows for the project, then inserts the wizard's
// selection. Actor identity is the authenticated APP LOGIN (forgeUserId /
// session.id), resolved via forge_users — NOT req.user.email.
//
// MUTATIVE.

export type SystemSelectionInput = {
  categoryId: number | string
  systemId: number | null
  customSystemName?: string | null
  impactBucketCode: string
  note?: string | null
  notes?: string | null
}

type Params = {
  forgeUserId: string
  projectId: string
  orgId: string
  selections: SystemSelectionInput[]
}

type ReturnRow = {
  project_system_id: string
  category_id: number
  system_id: number | null
  custom_system_name: string | null
  impact_bucket_code: string
}

export type CreateProjectSystemsResult = {
  inserted: ReturnRow[]
}

const SQL = `
with inputs as (
  select
    nullif($1, '')::uuid                as org_id,
    nullif($2, '')::uuid                as project_id,
    $3::jsonb                           as selections_json,
    nullif($4, '')                      as forge_user_id
),
actor as (
  select fu.user_id
  from forge_users fu
  cross join inputs i
  where fu.id = i.forge_user_id::uuid
    and fu.is_active = true
  limit 1
),
del as (
  delete from project_systems ps
  using inputs i
  where ps.project_id = i.project_id
  returning ps.project_system_id
),
incoming as (
  select
    (elem->>'categoryId')::int                  as category_id,
    nullif(elem->>'systemId', '')::int          as system_id,
    nullif(trim(elem->>'customSystemName'), '') as custom_system_name,
    elem->>'impactBucketCode'                   as impact_bucket_code,
    coalesce(
      nullif(trim(elem->>'notes'), ''),
      nullif(trim(elem->>'note'), '')
    )                                           as notes
  from inputs i, jsonb_array_elements(i.selections_json) as elem
)
insert into project_systems (
  org_id,
  project_id,
  category_id,
  system_id,
  custom_system_name,
  impact_bucket_code,
  notes,
  created_by_user_id
)
select
  i.org_id,
  i.project_id,
  inc.category_id,
  inc.system_id,
  inc.custom_system_name,
  inc.impact_bucket_code,
  inc.notes,
  a.user_id
from incoming inc
cross join inputs i
left join actor a on true
returning project_system_id, category_id, system_id, custom_system_name, impact_bucket_code;
`

export default async function createProjectSystems(
  req: { params: Params; user: User },
): Promise<CreateProjectSystemsResult> {
  const p = req.params
  const forgeUserId = (p.forgeUserId ?? '').trim()

  // Normalise selections to the shape the SQL expects.
  const normalised = (p.selections ?? []).map((s) => ({
    categoryId: s.categoryId,
    systemId: s.systemId,
    customSystemName: s.customSystemName ?? null,
    impactBucketCode: s.impactBucketCode,
    notes: s.notes ?? s.note ?? null,
  }))

  const result = await forgeSupabaseShadow2.query<ReturnRow>(SQL, [
    p.orgId ?? '',
    p.projectId ?? '',
    JSON.stringify(normalised),
    forgeUserId,
  ])

  return { inserted: result.data }
}