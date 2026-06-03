'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Sparkles, User } from 'lucide-react'
import { AdminButton } from './admin-button'

const NAV = [
  { href: '/',                   label: 'Home',     Icon: Home     },
  { href: '/search',             label: 'Find',     Icon: Search   },
  { href: '/find-my-instructor', label: 'AI Match', Icon: Sparkles },
  { href: '/portal',             label: 'Portal',   Icon: User     },
]

export function BottomNav() {
  const pathname = usePathname()
  if (pathname.startsWith('/admin')) return null

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40 safe-area-bottom"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around py-2 px-2">
        {NAV.map(({ href, label, Icon }) => {
          const active = pathname === href
          return (
            <Link key={href} href={href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors min-w-[52px] ${
                active ? 'text-[#1A3CFF]' : 'text-gray-400 hover:text-gray-600'
              }`}
              aria-label={label}
              aria-current={active ? 'page' : undefined}
            >
              <Icon size={20} aria-hidden="true" />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          )
        })}

        {/* Admin tab — only rendered for admin users (self-hiding) */}
        <AdminButton variant="bottom-nav" />
      </div>
    </nav>
  )
}
