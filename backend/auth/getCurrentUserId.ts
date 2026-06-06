// Resolves the current domain user_id for the authenticated APP LOGIN.
// Identity is the forge_users credential id captured at login (session.id),
// NOT req.user.email.

type Params = { forgeUserId: string | null }

type Row = { user_id: string | null }

const SQL = `
select fu.user_id
from forge_users fu
where fu.id = nullif($1, '')::uuid
  and fu.is_active = true
  and fu.user_id is not null
limit 1
`

export default async function getCurrentUserId(
  req: { params: Params; user: User },
): Promise<{ userId: string | null }> {
  const forgeUserId = req.params.forgeUserId ?? ''
  if (forgeUserId === '') return { userId: null }

  const result = await forgeSupabaseShadow2.query<Row>(SQL, [forgeUserId])
  const first = result.data[0]
  return { userId: first?.user_id ?? null }
}