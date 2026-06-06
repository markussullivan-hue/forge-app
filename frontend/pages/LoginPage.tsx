import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useBackendFunction } from '../hooks/useBackendFunction'
import { setSession } from '../utils/session'
import { Card, CardContent, CardHeader, CardDescription } from '../lib/shadcn/card'
import { Button } from '../lib/shadcn/button'
import { Input } from '../lib/shadcn/input'
import { Label } from '../lib/shadcn/label'
import Logo from '../components/Logo'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// User-facing messages. Centralised so wording is consistent across branches
// and easy to localise later. End users never see raw diagnostic strings.
const MSG_BAD_CREDENTIALS = 'Incorrect email or password.'
const MSG_BACKEND_UNAVAILABLE = 'Sign-in is temporarily unavailable. Try again shortly.'

type SuccessShape = { id: string; email: string }

type FailureShape =
  | { ok: false; reason: 'invalid_input'; code: string }
  | { ok: false; reason: 'no_match'; code: string }
  | { ok: false; reason: 'backend_error'; code: string; diagnostic?: string }

type CheckCredentialsResponse = SuccessShape | FailureShape | null | undefined

function isSuccess(value: unknown): value is SuccessShape {
  if (!value || typeof value !== 'object') return false
  const v = value as Record<string, unknown>
  return typeof v['id'] === 'string' && typeof v['email'] === 'string'
}

function isFailureEnvelope(value: unknown): value is FailureShape {
  if (!value || typeof value !== 'object') return false
  const v = value as Record<string, unknown>
  return v['ok'] === false && typeof v['reason'] === 'string'
}

export default function LoginPage() {
  const navigate = useNavigate()
  const checkCredentials = useBackendFunction('/backend/auth/checkCredentials.ts')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const clearError = () => {
    if (errorMessage) setErrorMessage(null)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      setErrorMessage('Enter your email address.')
      return
    }
    if (!EMAIL_RE.test(trimmedEmail)) {
      setErrorMessage('Enter a valid email address.')
      return
    }
    if (!password) {
      setErrorMessage('Enter your password.')
      return
    }

    setErrorMessage(null)
    setSubmitting(true)
    try {
      const result = (await checkCredentials.trigger({
        email: trimmedEmail,
        password,
      }).result) as CheckCredentialsResponse

      // Success (legacy shape preserved for backwards compatibility).
      if (isSuccess(result)) {
        setSession({ id: result.id, email: result.email, ts: Date.now() })
        navigate('/dashboard')
        return
      }

      // Structured failure envelope.
      if (isFailureEnvelope(result)) {
        if (result.reason === 'backend_error') {
          // Log safe diagnostic metadata only — never render it to the end user.
          console.warn('[login] backend_error', {
            code: result.code,
            diagnostic: result.diagnostic,
          })
          setErrorMessage(MSG_BACKEND_UNAVAILABLE)
          return
        }
        // invalid_input | no_match — surface as generic credential mismatch.
        setErrorMessage(MSG_BAD_CREDENTIALS)
        return
      }

      // Unknown / null / undefined response — treat as transient unavailability
      // rather than a credential mismatch so the user can retry meaningfully.
      console.warn('[login] unrecognised response shape', { result })
      setErrorMessage(MSG_BACKEND_UNAVAILABLE)
    } catch (err) {
      // Transport-level failure (function never returned). Log safe metadata
      // and surface the unavailability message — do NOT collapse to the
      // credential-mismatch message, since the credentials were never checked.
      const safe =
        err && typeof err === 'object'
          ? {
              name: (err as { name?: unknown }).name,
              code: (err as { code?: unknown }).code,
              message: (err as { message?: unknown }).message,
            }
          : { message: String(err) }
      console.warn('[login] transport error', safe)
      setErrorMessage(MSG_BACKEND_UNAVAILABLE)
    } finally {
      setSubmitting(false)
    }
  }

  const disabled = submitting || !email.trim() || !password

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black text-foreground px-4 py-8 gap-6">
      <Logo size="lg" />
      <Card className="w-full max-w-md shadow-retool-md">
        <CardHeader className="space-y-1 text-center">
          <CardDescription>Sign in to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  clearError()
                }}
                disabled={submitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    clearError()
                  }}
                  disabled={submitting}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {errorMessage ? (
              <p className="text-sm text-destructive" role="alert" aria-live="polite">
                {errorMessage}
              </p>
            ) : null}

            <Button type="submit" className="w-full" disabled={disabled}>
              {submitting ? 'Signing in...' : 'Sign in'}
            </Button>

            <div className="flex items-center justify-between text-sm pt-2">
              <span
                aria-disabled="true"
                className="text-muted-foreground cursor-not-allowed opacity-60"
                title="Coming soon"
              >
                Forgot password?
              </span>
              <Link to="/signup" className="text-primary hover:underline">
                Create an account
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
