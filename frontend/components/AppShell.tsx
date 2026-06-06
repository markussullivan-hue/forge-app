import { Outlet, useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { Button } from '../lib/shadcn/button'
import { clearSession, useSession } from '../utils/session'
import { resetAppState } from '../utils/appState'
import Logo from './Logo'

export default function AppShell() {
  const session = useSession()
  const navigate = useNavigate()

  const handleLogout = () => {
    clearSession()
    resetAppState()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="flex items-center justify-between px-6 h-14 border-b border-border bg-white dark:bg-black">
        <div className="flex items-center">
          <Logo size="sm" />
        </div>
        <div className="flex items-center gap-3">
          {session?.email ? (
            <span className="text-sm text-muted-foreground hidden sm:inline">{session.email}</span>
          ) : null}
          <Button variant="outline" size="sm" onClick={handleLogout} aria-label="Log out">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </Button>
        </div>
      </header>
      <main className="flex-1 min-h-0">
        <Outlet />
      </main>
    </div>
  )
}
