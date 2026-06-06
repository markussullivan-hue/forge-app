// One-shot helper for development: inserts (or resets the password of) a row
// in forge_users so you can log in without running the wf_signup workflow.
//
// Password is hashed with pgcrypto's bcrypt the same way checkCredentials.ts
// verifies it: `crypt(password, gen_salt('bf'))`. The row is upserted on
// `lower(email)` and force-activated so login succeeds immediately.
//
// MUTATIVE: writes to forge_users. Intended for development / test bootstrap.

type Params = {
  email: string
  password: string
}

type Row = {
  id: string
  email: string
  is_active: boolean
  created_now: boolean
}

export default async function seedAdminUser(
  req: { params: Params; user: User },
): Promise<{ id: string; email: string; created: boolean }> {
  const email = (req.params.email ?? '').trim().toLowerCase()
  const password = req.params.password ?? ''
  if (!email) throw new Error('email is required')
  if (!password) throw new Error('password is required')

  // Upsert by lower(email). We rely on a unique index/constraint matching the
  // app's lookup pattern; if none exists, fall back to manual select+update or
  // insert so the function still works.
  // The SQL driver treats each $N occurrence as a separate bind, so we use
  // distinct placeholders even though some carry the same value.
  const upsert = await forgeSupabaseShadow2.query<Row>(
    `WITH existing AS (
       SELECT id FROM forge_users WHERE lower(email) = lower($1)
     ),
     updated AS (
       UPDATE forge_users
          SET password_hash = crypt($2, gen_salt('bf')),
              is_active = true,
              updated_at = now()
        WHERE id IN (SELECT id FROM existing)
        RETURNING id, email, is_active, false AS created_now
     ),
     inserted AS (
       INSERT INTO forge_users (email, password_hash, is_active)
       SELECT $3, crypt($4, gen_salt('bf')), true
        WHERE NOT EXISTS (SELECT 1 FROM existing)
       RETURNING id, email, is_active, true AS created_now
     )
     SELECT * FROM updated
     UNION ALL
     SELECT * FROM inserted`,
    [email, password, email, password],
  )

  const row = upsert.data[0]
  if (!row) throw new Error('Failed to seed user row')
  return { id: row.id, email: row.email, created: row.created_now }
}
