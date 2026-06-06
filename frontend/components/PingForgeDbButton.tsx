import { useEffect, useState } from 'react'
import {
  Activity,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Loader2,
  XCircle,
} from 'lucide-react'
import { usePingForgeDb } from '../hooks/backend/auth'
import { cn } from '../lib/shadcn/utils'

type PingResult = {
  boundInRuntime: boolean
  reachedDb: boolean
  dbIdentity: {
    current_database: string
    current_user: string
    session_user: string
    inet_server_addr: string | null
    inet_server_port: number | null
    server_version: string
    now: string
  } | null
  error: { name: string | null; code: string | null; message: string | null } | null
}

/**
 * Always-on diagnostic widget. Floats in the bottom-left of every page and
 * runs /backend/auth/pingForgeDb.ts on demand. Safe in any environment.
 *
 * Renders both a parsed view and the raw JSON payload, so a mismatched
 * response shape can never produce a silently-empty panel.
 */
export default function PingForgeDbButton() {
  const [open, setOpen] = useState(false)
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const [elapsedMs, setElapsedMs] = useState(0)
  const { data, loading, error, trigger } = usePingForgeDb()

  // Tick a stopwatch while loading so the user can see the request isn't dead.
  useEffect(() => {
    if (!loading || startedAt == null) {
      setElapsedMs(0)
      return
    }
    const id = window.setInterval(() => {
      setElapsedMs(Date.now() - startedAt)
    }, 100)
    return () => window.clearInterval(id)
  }, [loading, startedAt])

  const runPing = () => {
    setOpen(true)
    setStartedAt(Date.now())
    // We deliberately do NOT await — the hook drives data/loading/error via
    // React state, and awaiting can mask thrown errors that the hook already
    // captured into `error`.
    trigger({}, { skipCache: true }).result.catch(() => {
      // Swallow — the hook already wrote the message to `error`.
    })
  }

  const result = (data ?? null) as PingResult | null

  const status: 'idle' | 'loading' | 'ok' | 'fail' = loading
    ? 'loading'
    : error || (result && (!result.boundInRuntime || !result.reachedDb))
      ? 'fail'
      : result
        ? 'ok'
        : 'idle'

  return (
    <div className="fixed bottom-4 left-4 z-[9999] font-mono text-xs">
      {open && (
        <div className="mb-2 w-96 rounded-md border border-border bg-popover text-popover-foreground shadow-lg overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 border-b border-border">
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
              Ping forgeSupabaseShadow2
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-3 space-y-2 max-h-[70vh] overflow-auto">
            {/* State summary — always visible */}
            <div className="grid grid-cols-2 gap-x-3 gap-y-1">
              <KV k="loading" v={String(loading)} />
              <KV k="elapsed" v={loading ? `${(elapsedMs / 1000).toFixed(1)}s` : '—'} />
              <KV k="error" v={error ?? '(none)'} />
              <KV
                k="data"
                v={data === null ? 'null' : data === undefined ? 'undefined' : 'object'}
              />
            </div>

            {/* Parsed result */}
            {result && (
              <div className="mt-3 pt-2 border-t border-border space-y-1">
                <Row
                  label="boundInRuntime"
                  ok={result.boundInRuntime}
                  value={String(result.boundInRuntime)}
                />
                <Row
                  label="reachedDb"
                  ok={result.reachedDb}
                  value={String(result.reachedDb)}
                />
                {result.dbIdentity && (
                  <div className="mt-2 pt-2 border-t border-border space-y-1">
                    <KV k="database" v={result.dbIdentity.current_database} />
                    <KV k="user" v={result.dbIdentity.current_user} />
                    <KV k="session_user" v={result.dbIdentity.session_user} />
                    <KV
                      k="host"
                      v={result.dbIdentity.inet_server_addr ?? '(null)'}
                    />
                    <KV
                      k="port"
                      v={
                        result.dbIdentity.inet_server_port == null
                          ? '(null)'
                          : String(result.dbIdentity.inet_server_port)
                      }
                    />
                    <KV k="server_version" v={result.dbIdentity.server_version} />
                    <KV k="now" v={result.dbIdentity.now} />
                  </div>
                )}
                {result.error && (
                  <div className="mt-2 pt-2 border-t border-border space-y-1 text-destructive">
                    <KV k="error.name" v={result.error.name ?? '(null)'} />
                    <KV k="error.code" v={result.error.code ?? '(null)'} />
                    <KV k="error.message" v={result.error.message ?? '(null)'} />
                  </div>
                )}
              </div>
            )}

            {/* Raw JSON — always present once data arrives so any shape mismatch is visible */}
            {data != null && (
              <details className="mt-3 pt-2 border-t border-border" open>
                <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                  raw response
                </summary>
                <pre className="mt-1 p-2 rounded bg-muted text-foreground whitespace-pre-wrap break-all text-[11px]">
                  {safeStringify(data)}
                </pre>
              </details>
            )}

            {loading && elapsedMs > 8000 && (
              <div className="mt-2 p-2 rounded bg-amber-500/10 border border-amber-500/40 text-amber-700 dark:text-amber-300">
                Still waiting after {(elapsedMs / 1000).toFixed(0)}s. In the editor
                preview, function calls require approval — check for a Retool
                approval prompt in the parent window.
              </div>
            )}

            <button
              type="button"
              onClick={runPing}
              disabled={loading}
              className="w-full mt-2 px-3 py-1.5 rounded-md border border-border bg-background hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50"
            >
              {loading ? 'Pinging…' : data ? 'Ping again' : 'Ping'}
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          if (!open) setOpen(true)
          runPing()
        }}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-md backdrop-blur transition-colors',
          status === 'idle' &&
            'border-border bg-background/90 hover:bg-accent hover:text-accent-foreground',
          status === 'loading' &&
            'border-border bg-background/90 text-muted-foreground',
          status === 'ok' &&
            'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20',
          status === 'fail' &&
            'border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/20',
        )}
        aria-label="Ping forgeSupabaseShadow2"
      >
        {status === 'loading' ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : status === 'ok' ? (
          <CheckCircle2 className="w-3.5 h-3.5" />
        ) : status === 'fail' ? (
          <XCircle className="w-3.5 h-3.5" />
        ) : (
          <Activity className="w-3.5 h-3.5" />
        )}
        <span>Ping DB</span>
        {open ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
      </button>
    </div>
  )
}

function Row({ label, ok, value }: { label: string; ok: boolean; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={cn(
          'flex items-center gap-1',
          ok ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive',
        )}
      >
        {ok ? (
          <CheckCircle2 className="w-3.5 h-3.5" />
        ) : (
          <XCircle className="w-3.5 h-3.5" />
        )}
        {value}
      </span>
    </div>
  )
}

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <span className="text-muted-foreground shrink-0">{k}</span>
      <span className="text-right break-all">{v}</span>
    </div>
  )
}

function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return String(value)
  }
}
