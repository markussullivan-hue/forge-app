import { useEffect, useRef } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { toast } from 'sonner'
import { useSession } from '../utils/session'
import { setAppState } from '../utils/appState'
import { useGetCurrentOrgId, useGetCurrentUserId } from '../hooks/backend/auth'
import AppShell from './AppShell'

export default function ProtectedRoute() {
  const session = useSession()
  const location = useLocation()
  const { trigger: triggerOrg } = useGetCurrentOrgId()
  const { trigger: triggerUser } = useGetCurrentUserId()
  // Tracks the session id we've successfully bootstrapped for. Stamped only
  // after the org+user fetch completes so a failed or cancelled attempt can
  // be retried (and StrictMode's double-invoke can't lock us out).
  const bootstrappedFor = useRef<string | null>(null)
  // Set while a bootstrap attempt is in flight so an incidental re-render
  // doesn't kick off a duplicate request. Reset on cleanup (below) so a
  // StrictMode mount/unmount/mount can re-run the bootstrap cleanly.
  const bootstrapping = useRef(false)

  useEffect(() => {
    if (!session) return
    if (bootstrappedFor.current === session.id) return
    if (bootstrapping.current) return
    bootstrapping.current = true
    const sessionId = session.id
    let cancelled = false

    void (async () => {
      try {
        const orgRes = await triggerOrg({ forgeUserId: sessionId }).result
        if (cancelled) return
        const orgId = (orgRes as { orgId: string | null } | null)?.orgId ?? null
        setAppState({ currentOrgId: orgId })
        if (!orgId) {
          toast.warning('Your account is not assigned to an organisation yet.')
        }
      } catch {
        if (!cancelled) toast.error('Failed to load organisation.')
      }

      try {
        const userRes = await triggerUser({ forgeUserId: sessionId }).result
        if (cancelled) return
        setAppState({ currentUserId: (userRes as { userId: string | null } | null)?.userId ?? null })
      } catch {
        if (!cancelled) toast.error('Failed to load user.')
      }

      if (!cancelled) {
        bootstrappedFor.current = sessionId
      }
      bootstrapping.current = false
    })()

    return () => {
      // If this effect instance is torn down before completing — e.g. React
      // StrictMode's mount/unmount/mount in the editor preview tears down the
      // in-flight backend call's message listener — abandon this attempt and
      // clear the in-flight flag so the next mount re-runs the bootstrap
      // cleanly. In production (single invoke) this only runs on real unmount.
      cancelled = true
      bootstrapping.current = false
    }
  }, [session, triggerOrg, triggerUser])

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <AppShell />
}
