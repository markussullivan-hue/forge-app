// Diagnostic-only. Confirms that `forgeSupabaseShadow2` is injected into the
// current backend runtime and can complete a round-trip to the database.
//
// Returns three layers of result so a failure in published Production can be
// pinpointed without guessing:
//
//   - boundInRuntime:  did the global resource client even exist?
//   - reachedDb:       did the SQL round-trip complete?
//   - dbIdentity:      which database/user/host did we actually talk to?
//
// No parameters. No writes. No PII. Safe to call in any environment.
// Intentionally lives under /backend/auth/ so it ships with the auth surface
// and is available on any release that includes the auth bundle.

type Params = Record<string, never>

type IdentityRow = {
  current_database: string
  current_user: string
  session_user: string
  inet_server_addr: string | null
  inet_server_port: number | null
  server_version: string
  now: string
}

export type PingForgeDbResult = {
  boundInRuntime: boolean
  reachedDb: boolean
  dbIdentity: IdentityRow | null
  error: { name: string | null; code: string | null; message: string | null } | null
}

export default async function pingForgeDb(
  _req: { params: Params; user: User },
): Promise<PingForgeDbResult> {
  // Layer 1: does the resource global exist in this runtime?
  // We deliberately use `typeof` rather than referencing the symbol directly
  // so that a missing binding does NOT throw a ReferenceError — it must be
  // reportable as data, not as a thrown exception, so callers can branch.
  const bound = typeof forgeSupabaseShadow2 !== 'undefined'
  if (!bound) {
    return {
      boundInRuntime: false,
      reachedDb: false,
      dbIdentity: null,
      error: {
        name: 'ReferenceError',
        code: 'RESOURCE_NOT_INJECTED',
        message:
          'forgeSupabaseShadow2 is not defined in this runtime. Check app resource allowlist, Production environment config, and re-publish.',
      },
    }
  }

  // Layer 2 + 3: round-trip a harmless identity probe so we can see which DB
  // the published runtime is actually attached to. No table reads, no schema
  // assumptions beyond Postgres built-ins.
  try {
    const result = await forgeSupabaseShadow2.query<IdentityRow>(
      `select
         current_database()                   as current_database,
         current_user                         as current_user,
         session_user                         as session_user,
         host(inet_server_addr())             as inet_server_addr,
         inet_server_port()                   as inet_server_port,
         current_setting('server_version')    as server_version,
         now()::text                          as now`,
    )
    const row = result.data[0] ?? null
    return {
      boundInRuntime: true,
      reachedDb: row != null,
      dbIdentity: row,
      error: null,
    }
  } catch (err) {
    const e = err as Record<string, unknown>
    return {
      boundInRuntime: true,
      reachedDb: false,
      dbIdentity: null,
      error: {
        name: typeof e['name'] === 'string' ? (e['name'] as string) : null,
        code:
          typeof e['code'] === 'string'
            ? (e['code'] as string)
            : typeof e['code'] === 'number'
              ? String(e['code'])
              : null,
        message: typeof e['message'] === 'string' ? (e['message'] as string) : null,
      },
    }
  }
}
