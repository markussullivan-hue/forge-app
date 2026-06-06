import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronDown, ChevronUp, Compass } from 'lucide-react'
import { cn } from '../lib/shadcn/utils'

type RouteEntry = {
  path: string
  label: string
}

const ROUTES: RouteEntry[] = [
  { path: '/login', label: 'Login' },
  { path: '/signup', label: 'Sign Up' },
  { path: '/verify', label: 'Verify' },
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/charter', label: 'Charter' },
  { path: '/wizard', label: 'Wizard' },
  { path: '/governance', label: 'Governance' },
]

/**
 * Dev-only floating route switcher. Renders a small pill in the bottom-right
 * that expands into a list of every route defined in App.tsx so you can jump
 * between pages while building. Only renders in development.
 */
export default function DevNavBar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  if (!import.meta.env.DEV) return null

  return (
    <div className="fixed bottom-4 right-4 z-[9999] font-mono text-xs">
      {open && (
        <div className="mb-2 w-48 rounded-md border border-border bg-popover text-popover-foreground shadow-lg overflow-hidden">
          <div className="px-3 py-2 text-[10px] uppercase tracking-wide text-muted-foreground border-b border-border">
            Dev routes
          </div>
          <ul className="max-h-72 overflow-auto py-1">
            {ROUTES.map((route) => {
              const active = location.pathname === route.path
              return (
                <li key={route.path}>
                  <Link
                    to={route.path}
                    className={cn(
                      'flex items-center justify-between gap-2 px-3 py-1.5 hover:bg-accent hover:text-accent-foreground transition-colors',
                      active && 'bg-accent text-accent-foreground',
                    )}
                  >
                    <span>{route.label}</span>
                    <span className="text-[10px] text-muted-foreground">{route.path}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-background/90 backdrop-blur shadow-md hover:bg-accent hover:text-accent-foreground transition-colors"
        aria-label="Toggle dev route switcher"
      >
        <Compass className="w-3.5 h-3.5" />
        <span>Routes</span>
        {open ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
      </button>
    </div>
  )
}
