import { Link } from 'react-router-dom'

const LOGO_LIGHT_URL = 'https://mkmj.retool.com/api/file/1a8a5d70-0b14-4d7d-9864-fca986fdb9c2'
const LOGO_DARK_URL = 'https://mkmj.retool.com/api/file/ce3b9520-f009-4999-9a2f-b85afcbed7b8'

type Size = 'sm' | 'lg'

interface LogoProps {
  size?: Size
  className?: string
}

/**
 * FORGE Logic brand mark.
 *
 *   size="lg" — Large, centered. Used above the form on Login/Sign-up/Verify.
 *               Not clickable (those pages are unauthenticated).
 *   size="sm" — Small. Used in the top-left of the app header.
 *               Clickable; routes to /dashboard.
 */
export default function Logo({ size = 'sm', className }: LogoProps) {
  const heightClass = size === 'lg' ? 'h-36' : 'h-12'
  const baseClass = [heightClass, 'w-auto select-none', className ?? ''].join(' ').trim()
  const img = (
    <>
      <img
        src={LOGO_LIGHT_URL}
        alt="FORGE Logic™"
        className={`${baseClass} block dark:hidden`}
        draggable={false}
      />
      <img
        src={LOGO_DARK_URL}
        alt="FORGE Logic™"
        aria-hidden="true"
        className={`${baseClass} hidden dark:block`}
        draggable={false}
      />
    </>
  )

  if (size === 'sm') {
    return (
      <Link
        to="/dashboard"
        aria-label="FORGE Logic — go to dashboard"
        className="inline-flex items-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {img}
      </Link>
    )
  }

  return img
}
