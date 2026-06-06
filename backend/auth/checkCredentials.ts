// Verifies credentials against forge_users using crypt() on the password hash.
// Mirrors the classic app's checkCredentials.sql.
// republish marker — bump to ship PingForgeDbButton to the published app
//
// Return contract:
//   Success (unchanged, backwards compatible):
//     { id: string; email: string }
//
//   Failure envelope (new):
//     { ok: false; reason: 'invalid_input';  code: 'AUTH_INVALID_INPUT'  }
//     { ok: false; reason: 'no_match';       code: 'AUTH_NO_MATCH'       }
//     { ok: false; reason: 'backend_error';  code: 'AUTH_BACKEND_ERROR';
//       diagnostic: <sanitised metadata string> }
//
// The function NEVER throws for credential / no-match outcomes — those return
// the corresponding failure envelope. A thrown exception from the resource
// layer is caught here and translated into a `backend_error` envelope so the
// caller can distinguish "wrong password" from "the backend could not answer"
// without leaking secrets.
//
// SQL, parameter binding, and crypt() comparison are intentionally unchanged.

type Params = {
  email: string
  password: string
}

type Row = {
  id: string
  email: string
  is_active: boolean
}

type SuccessResult = { id: string; email: string }

type FailureResult =
  | { ok: false; reason: 'invalid_input'; code: 'AUTH_INVALID_INPUT' }
  | { ok: false; reason: 'no_match'; code: 'AUTH_NO_MATCH' }
  | {
      ok: false
      reason: 'backend_error'
      code: 'AUTH_BACKEND_ERROR'
      diagnostic: string
    }

export type CheckCredentialsResult = SuccessResult | FailureResult

// Cap the diagnostic string so a verbose driver error cannot balloon the
// response. Adjust here, not at call sites.
const DIAGNOSTIC_MAX_LENGTH = 500

/**
 * Build a sanitised diagnostic string from an unknown thrown value.
 *
 * Only safe error metadata is included:
 *   - err.name     (error class)
 *   - err.code     (driver / platform error code, if any)
 *   - err.message  (human-readable summary)
 *
 * Explicitly excluded: SQL text, query parameters, row values, the email,
 * the password, connection strings, stack traces, and any other unknown
 * properties on the error object. The output is truncated to
 * DIAGNOSTIC_MAX_LENGTH characters.
 */
function sanitiseDiagnostic(err: unknown): string {
  const parts: string[] = []

  if (err && typeof err === 'object') {
    const e = err as Record<string, unknown>

    const name = e['name']
    if (typeof name === 'string' && name.length > 0) {
      parts.push(`name=${name}`)
    }

    const code = e['code']
    if (typeof code === 'string' && code.length > 0) {
      parts.push(`code=${code}`)
    } else if (typeof code === 'number') {
      parts.push(`code=${String(code)}`)
    }

    const message = e['message']
    if (typeof message === 'string' && message.length > 0) {
      parts.push(`message=${message}`)
    }
  } else if (typeof err === 'string' && err.length > 0) {
    parts.push(`message=${err}`)
  }

  const joined = parts.join('; ') || 'unknown error'
  if (joined.length <= DIAGNOSTIC_MAX_LENGTH) return joined
  return joined.slice(0, DIAGNOSTIC_MAX_LENGTH - 1) + '…'
}

export default async function checkCredentials(
  req: { params: Params; user: User },
): Promise<CheckCredentialsResult> {
  const email = (req.params.email ?? '').trim()
  const password = req.params.password ?? ''
  if (!email || !password) {
    return { ok: false, reason: 'invalid_input', code: 'AUTH_INVALID_INPUT' }
  }

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
      ok: false,
      reason: 'backend_error',
      code: 'AUTH_BACKEND_ERROR',
      diagnostic: sanitiseDiagnostic(err),
    }
  }

  const first = result.data[0]
  if (!first) {
    return { ok: false, reason: 'no_match', code: 'AUTH_NO_MATCH' }
  }
  return { id: first.id, email: first.email }
}