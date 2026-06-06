// DIAGNOSTIC-ONLY credential verification path.
//
// Authored cleanly from scratch (NOT duplicated from checkCredentials.ts) to
// establish whether a newly-bound backend function can resolve the Postgres
// resource that the existing migrated /backend/auth/checkCredentials.ts
// cannot, in the SAME published Production runtime where the working
// /backend/auth/pingForgeDb.ts diagnostic confirms general DB connectivity.
//
// Design rules — keep this file strictly diagnostic:
//   - Reuses the existing credential-check SQL verbatim from checkCredentials.ts.
//   - Performs NO crypt/password logic outside the SQL.
//   - Mints NO token, creates NO session, sets NO actingEmail.
//   - Does NOT resolve a FORGE identity or tenant.
//   - Does NOT trust orgId / userId / email-from-frontend for anything other
//     than the SQL parameter values.
//   - Returns a Q1/Q2-style envelope describing the binding + SQL stages.
//   - Redacts ALL sensitive values from diagnostic output: the submitted
//     password, the row's password_hash, the user id, and the matched email
//     are NEVER returned. Only a boolean "match_found" plus stage markers.
//
// Resource binding:
//   References the global `forgeSupabaseShadow2` that Retool injects when the
//   "forge_supabase_shadow" PostgreSQL resource is bound to this file via
//   Retool's per-function resource selector. This is the SAME resource and
//   the SAME variable name the working pingForgeDb.ts uses. The `typeof`
//   guard below means a missing binding is reportable as data rather than
//   throwing a ReferenceError, matching pingForgeDb.ts's pattern.

type Params = {
  email: string
  password: string
}

type Row = {
  id: string
  email: string
  is_active: boolean
}

type Outcome = 'valid_credentials' | 'invalid_credentials' | 'backend_error'

export type CheckCredentialsFreshResult = {
  ok: boolean
  outcome: Outcome
  reason: string | null
  code: string | null
  diagnostic: string | null
  // Staged diagnostic envelope — every stage marker is present on every
  // response so the caller can see exactly how far execution reached.
  functionPath: '/backend/auth/checkCredentialsFresh.ts'
  environment: string | null
  dbResourceIdentifier: string | null
  resourceHandlePresent: boolean
  resourceBoundBeforeSql: boolean
  sqlReached: boolean
  credentialCheckReached: boolean
  match_found: boolean
}

const DIAGNOSTIC_MAX_LENGTH = 500
const RESOURCE_IDENTIFIER = 'forgeSupabaseShadow2'

/**
 * Sanitise an unknown thrown value into a short, secret-free string.
 *
 * Allowed: err.name, err.code, err.message.
 * Forbidden: SQL text, parameter values, row data, stack traces, connection
 * strings, any other unknown property.
 */
function sanitiseDiagnostic(err: unknown): string {
  const parts: string[] = []
  if (err && typeof err === 'object') {
    const e = err as Record<string, unknown>
    const name = e['name']
    if (typeof name === 'string' && name.length > 0) parts.push(`name=${name}`)
    const code = e['code']
    if (typeof code === 'string' && code.length > 0) parts.push(`code=${code}`)
    else if (typeof code === 'number') parts.push(`code=${String(code)}`)
    const message = e['message']
    if (typeof message === 'string' && message.length > 0) {
      parts.push(`message=${message}`)
    }
  } else if (typeof err === 'string' && err.length > 0) {
    parts.push(`message=${err}`)
  }
  const joined = parts.join('; ') || 'unknown error'
  return joined.length <= DIAGNOSTIC_MAX_LENGTH
    ? joined
    : joined.slice(0, DIAGNOSTIC_MAX_LENGTH - 1) + '…'
}

function readEnvironment(): string | null {
  try {
    // process is not guaranteed to exist in every Retool runtime; guard it.
    const p = (globalThis as Record<string, unknown>)['process'] as
      | { env?: Record<string, string | undefined> }
      | undefined
    const env = p?.env
    if (!env) return null
    const candidates = [
      'RETOOL_ENVIRONMENT',
      'RETOOL_RELEASE_ENV',
      'NODE_ENV',
    ] as const
    for (const key of candidates) {
      const v = env[key]
      if (typeof v === 'string' && v.length > 0) return v
    }
    return null
  } catch {
    return null
  }
}

export default async function checkCredentialsFresh(
  req: { params: Params; user: User },
): Promise<CheckCredentialsFreshResult> {
  const base = {
    functionPath: '/backend/auth/checkCredentialsFresh.ts' as const,
    environment: readEnvironment(),
    dbResourceIdentifier: RESOURCE_IDENTIFIER,
    resourceHandlePresent: false,
    resourceBoundBeforeSql: false,
    sqlReached: false,
    credentialCheckReached: false,
    match_found: false,
  }

  // Stage 0 — resource binding probe.
  // `typeof` keeps a missing binding reportable as data instead of throwing.
  const handlePresent = typeof forgeSupabaseShadow2 !== 'undefined'
  base.resourceHandlePresent = handlePresent
  base.resourceBoundBeforeSql = handlePresent

  if (!handlePresent) {
    return {
      ...base,
      ok: false,
      outcome: 'backend_error',
      reason: 'resource_not_bound',
      code: 'AUTH_FRESH_RESOURCE_NOT_BOUND',
      diagnostic:
        `name=ReferenceError; code=RESOURCE_NOT_INJECTED; ` +
        `message=${RESOURCE_IDENTIFIER} is not defined in this runtime`,
    }
  }

  // Stage 1 — parameter shape. We deliberately do NOT echo the submitted
  // email or password; only a boolean presence marker leaks out.
  const email = (req.params?.email ?? '').trim()
  const password = req.params?.password ?? ''
  if (!email || !password) {
    return {
      ...base,
      ok: false,
      outcome: 'backend_error',
      reason: 'invalid_input',
      code: 'AUTH_FRESH_INVALID_INPUT',
      diagnostic: 'missing email or password parameter',
    }
  }

  // Stage 2 — credential SQL. REUSED VERBATIM from /backend/auth/checkCredentials.ts.
  // Do not relocate or duplicate the crypt() comparison; it stays inside SQL
  // exactly as the migrated function had it.
  base.sqlReached = true
  let result: { data: Row[] }
  try {
    result = await forgeSupabaseShadow2.query<Row>(
      `SELECT id, email, is_active
         FROM forge_users
        WHERE lower(email) = lower($1)
          AND password_hash = crypt($2, password_hash)
          AND is_active = true`,
      [email, password],
    )
  } catch (err) {
    return {
      ...base,
      ok: false,
      outcome: 'backend_error',
      reason: 'sql_threw',
      code: 'AUTH_FRESH_BACKEND_ERROR',
      diagnostic: sanitiseDiagnostic(err),
    }
  }

  // Stage 3 — SQL completed; classify the outcome. We DO NOT return the row
  // (id / email / is_active) — only a boolean match marker.
  base.credentialCheckReached = true
  const matched = (result.data?.length ?? 0) > 0
  base.match_found = matched

  if (!matched) {
    return {
      ...base,
      ok: false,
      outcome: 'invalid_credentials',
      reason: 'no_match',
      code: 'AUTH_FRESH_NO_MATCH',
      diagnostic: null,
    }
  }

  return {
    ...base,
    ok: true,
    outcome: 'valid_credentials',
    reason: null,
    code: null,
    diagnostic: null,
  }
}
