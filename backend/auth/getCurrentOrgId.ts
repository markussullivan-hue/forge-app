// Resolves the current organisation UUID for the authenticated APP LOGIN.
// Identity is the forge_users credential id captured at login (session.id),
// NOT req.user.email (which is the Retool session, not the app login).
// Path: forge_users.id -> forge_users.user_id -> single active user_org_roles -> org_id.

type Params = { forgeUserId: string | null }

type Row = { org_id: string | null }

const SQL = `
select uor.org_id
from forge_users fu
join users u on u.user_id = fu.user_id
join user_org_roles uor on uor.user_id = u.user_id
where fu.id = nullif($1, '')::uuid
  and fu.is_active = true
  and coalesce(u.is_active, true) = true
  and coalesce(uor.is_active, true) = true
order by uor.assigned_at desc
limit 1
`

export default async function getCurrentOrgId(
  req: { params: Params; user: User },
): Promise<{ orgId: string | null }> {
  const forgeUserId = req.params.forgeUserId ?? ''
  if (forgeUserId === '') return { orgId: null }

  const result = await forgeSupabaseShadow2.query<Row>(SQL, [forgeUserId])
  const first = result.data[0]
  return { orgId: first?.org_id ?? null }
}