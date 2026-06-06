import { useEffect, useState } from 'react'

const STORAGE_KEY = 'forge_session'
const SESSION_EVENT = 'forge_session_change'

export type ForgeSession = {
  id: string
  email: string
  ts: number
}

function isForgeSession(value: unknown): value is ForgeSession {
  if (!value || typeof value !== 'object') return false
  const v = value as Record<string, unknown>
  return typeof v['id'] === 'string' && typeof v['email'] === 'string' && typeof v['ts'] === 'number'
}

export function getSession(): ForgeSession | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as unknown
    return isForgeSession(parsed) ? parsed : null
  } catch {
    return null
  }
}

export function setSession(session: ForgeSession): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  window.dispatchEvent(new CustomEvent(SESSION_EVENT))
}

export function clearSession(): void {
  window.localStorage.removeItem(STORAGE_KEY)
  window.dispatchEvent(new CustomEvent(SESSION_EVENT))
}

/** Reactive hook — re-renders when the session changes in this tab or another. */
export function useSession(): ForgeSession | null {
  const [session, setSessionState] = useState<ForgeSession | null>(() => getSession())

  useEffect(() => {
    const sync = () => setSessionState(getSession())
    window.addEventListener(SESSION_EVENT, sync)
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY) sync()
    })
    return () => {
      window.removeEventListener(SESSION_EVENT, sync)
      window.removeEventListener('storage', sync as EventListener)
    }
  }, [])

  return session
}
