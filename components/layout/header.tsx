'use client'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Search, Sparkles } from 'lucide-react'

// Lazy-load Clerk components - they're 150KB+ and not needed for first paint
const UserButton = dynamic(
  () => import('@clerk/nextjs').then(m => m.UserButton),
  { ssr: false, loading: () => <div className="w-9 h-9 rounded-full bg-gray-100 animate-pulse" /> }
)

const UserMenu = dynamic(() => import('./user-menu').then(m => m.UserMenu), { ssr: false })

const NAV = [
  { href: '/',                   label: 'Home'     },
  { href: '/search',             label: 'Find'     },
  { href: '/find-my-instructor', label: 'AI Match' },
  { href: '/portal',             label: 'Portal'   },
]

export function Header() {
  const pathname        = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">

        <Link href="/" className="font-bold text-[#1A3CFF] text-lg flex-shrink-0" aria-label="LCarDrive home">
          LCarDrive
        </Link>

        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === href
                  ? 'text-[#1A3CFF] bg-blue-50'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {label === 'AI Match' && <Sparkles size={12} className="inline mr-1 mb-0.5" aria-hidden="true" />}
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/search"
            className="flex items-center gap-2 text-sm text-gray-600 border border-gray-200 rounded-xl px-3 py-1.5 hover:border-gray-300 transition-colors"
            aria-label="Search instructors"
          >
            <Search size={14} aria-hidden="true" />
            <span>Search instructors...</span>
          </Link>
          <UserMenu />
        </div>

        <div className="flex md:hidden items-center gap-3">
          <Link
            href="/search"
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50"
            aria-label="Search instructors"
          >
            <Search size={18} className="text-gray-700" aria-hidden="true" />
          </Link>
          <UserMenu />
          <button
            onClick={() => setOpen(!open)}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open
              ? <X size={18} className="text-gray-700" aria-hidden="true" />
              : <Menu size={18} className="text-gray-700" aria-hidden="true" />
            }
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-1">
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                pathname === href
                  ? 'text-[#1A3CFF] bg-blue-50'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {label === 'AI Match' && <Sparkles size={14} className="text-purple-500" aria-hidden="true" />}
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
