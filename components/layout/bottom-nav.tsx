'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Sparkles, User } from 'lucide-react'

const TABS = [
  { href: '/',                   label: 'Home',    Icon: Home     },
  { href: '/search',             label: 'Find',    Icon: Search   },
  { href: '/find-my-instructor', label: 'AI Match', Icon: Sparkles },
  { href: '/portal',             label: 'Portal',  Icon: User     },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 safe-area-bottom">
      <div className="flex">
        {TABS.map(({ href, label, Icon }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center py-2.5 min-h-[56px] transition-colors ${
                active ? 'text-[#1A3CFF]' : 'text-gray-400'
              }`}
            >
              <Icon
                size={22}
                className={active ? 'text-[#1A3CFF]' : 'text-gray-400'}
                strokeWidth={active ? 2.5 : 1.8}
              />
              <span className={`text-[10px] mt-0.5 font-medium ${active ? 'text-[#1A3CFF]' : 'text-gray-400'}`}>
                {label}
              </span>
              {active && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#1A3CFF] rounded-full" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
