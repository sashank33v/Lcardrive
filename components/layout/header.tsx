'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Search, Sparkles } from 'lucide-react'
import { UserButton, useUser } from '@clerk/nextjs'

const NAV = [
  { href: '/',                   label: 'Home'     },
  { href: '/search',             label: 'Find'     },
  { href: '/find-my-instructor', label: 'AI Match' },
  { href: '/portal',             label: 'Portal'   },
]

export function Header() {
  const pathname       = usePathname()
  const [open, setOpen] = useState(false)
  const { isSignedIn } = useUser()

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="font-bold text-[#1A3CFF] text-lg flex-shrink-0">
          LCarDrive
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === href
                  ? 'text-[#1A3CFF] bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {label === 'AI Match' && <Sparkles size={12} className="inline mr-1 mb-0.5" />}
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/search"
            className="flex items-center gap-2 text-sm text-gray-500 border border-gray-200 rounded-xl px-3 py-1.5 hover:border-gray-300 transition-colors"
          >
            <Search size={14} />
            <span>Search instructors...</span>
          </Link>
          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <Link href="/sign-in">
              <button className="text-sm font-semibold text-[#1A3CFF] hover:underline">
                Sign in
              </button>
            </Link>
          )}
        </div>

        {/* Mobile right */}
        <div className="flex md:hidden items-center gap-3">
          <Link href="/search" className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50">
            <Search size={18} className="text-gray-600" />
          </Link>
          {isSignedIn && <UserButton afterSignOutUrl="/" />}
          <button
            onClick={() => setOpen(!open)}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50"
            aria-label="Toggle menu"
          >
            {open
              ? <X size={18} className="text-gray-600" />
              : <Menu size={18} className="text-gray-600" />
            }
          </button>
        </div>
      </div>

      {/* Mobile menu */}
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
              {label === 'AI Match' && <Sparkles size={14} className="text-purple-500" />}
              {label}
            </Link>
          ))}
          {!isSignedIn && (
            <Link href="/sign-in" onClick={() => setOpen(false)}>
              <div className="mt-2 w-full bg-[#1A3CFF] text-white font-semibold py-3 rounded-xl text-sm text-center">
                Sign in
              </div>
            </Link>
          )}
        </div>
      )}
    </header>
  )
}
