'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, User } from 'lucide-react'

export function BottomNav() {
  const path = usePathname()

  const tabs = [
    { href: '/',       label: 'Home',   icon: Home   },
    { href: '/search', label: 'Find',   icon: Search },
    { href: '/portal', label: 'Portal', icon: User   },
  ]

  return (
    /* md:hidden = only shows on mobile, hidden on desktop */
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around py-2">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = path === href || (href !== '/' && path.startsWith(href))
          return (
            <Link key={href} href={href} className="flex flex-col items-center gap-0.5 px-6 py-1">
              <span className={`p-2 rounded-full transition-colors ${active ? 'bg-yellow-100' : ''}`}>
                <Icon size={22} className={active ? 'text-[#1A3CFF]' : 'text-gray-500'} />
              </span>
              <span className={`text-xs font-medium ${active ? 'text-[#1A3CFF]' : 'text-gray-500'}`}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
