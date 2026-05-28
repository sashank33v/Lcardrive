'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Search, Home, User } from 'lucide-react'
import { UserButton, useAuth } from '@clerk/nextjs'

export function Header({ title = 'LCarDrive' }: { title?: string }) {
  const { isSignedIn } = useAuth()
  const path = usePathname()

  const navLinks = [
    { href: '/',       label: 'Home'   },
    { href: '/search', label: 'Find'   },
    { href: '/portal', label: 'Portal' },
  ]

  return (
    <header className="sticky top-0 z-40 bg-[#F0F2FF] border-b border-transparent">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Mobile: hamburger */}
        <button className="md:hidden p-1">
          <Menu size={22} className="text-gray-700" />
        </button>

        {/* Logo */}
        <Link href="/" className="text-lg font-bold text-[#1A3CFF] tracking-tight">
          LCarDrive
        </Link>

        {/* Desktop: nav links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(({ href, label }) => {
            const active = path === href || (href !== '/' && path.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                className={`text-sm font-medium transition-colors ${
                  active ? 'text-[#1A3CFF]' : 'text-gray-600 hover:text-[#1A3CFF]'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Desktop: search icon */}
          <Link href="/search" className="hidden md:flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-500 hover:border-[#1A3CFF] transition-colors">
            <Search size={15} />
            Search instructors...
          </Link>

          {/* Avatar */}
          <div className="w-8 h-8 flex items-center justify-center">
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <Link href="/sign-in">
                <div className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors" />
              </Link>
            )}
          </div>
        </div>

      </div>
    </header>
  )
}
