'use client'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, Search, Sparkles, LogOut } from 'lucide-react'
import { AdminButton } from './admin-button'

const UserMenu = dynamic(() => import('./user-menu').then(m => m.UserMenu), { ssr: false })

const NAV = [
  { href: '/',                   label: 'Home'     },
  { href: '/search',             label: 'Find'     },
  { href: '/find-my-instructor', label: 'AI Match' },
  { href: '/portal',             label: 'Portal'   },
]

function ShieldIcon({ gold = false }: { gold?: boolean }) {
  const bg = gold ? '#FACC15' : '#1a1a1a'
  return (
    <svg viewBox="0 0 40 40" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="9" fill={bg} />
      <path fill="white"
        d="M20 4 C20 4 33 8.5 33 8.5 L33 22 C33 31 27.5 36.5 20 39 C12.5 36.5 7 31 7 22 L7 8.5 Z" />
      <path fill={bg}
        d="M20 8 C20 8 29.5 11.8 29.5 11.8 L29.5 22 C29.5 29 25.5 33.5 20 36 C14.5 33.5 10.5 29 10.5 22 L10.5 11.8 Z" />
      <path d="M14 30 C15 27 17 24 20 21 C23 18 25 14.5 26.5 11"
        fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
      <path d="M17 31.5 C18.5 28.5 21 25.5 23.5 22.5 C26 19.5 27.5 16 29 12.5"
        fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.45" />
      <path d="M23.5 10 L28.5 10 L28.5 15"
        fill="none" stroke="white" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Header() {
  const pathname                  = usePathname()
  const router                    = useRouter()
  const [open, setOpen]           = useState(false)
  const [adminMode, setAdminMode] = useState(false)

  useEffect(() => {
    if (pathname.startsWith('/admin')) {
      localStorage.setItem('lcardrive_admin_mode', 'true')
      setAdminMode(true)
    } else {
      setAdminMode(localStorage.getItem('lcardrive_admin_mode') === 'true')
    }
  }, [pathname])

  const exitAdmin = () => {
    localStorage.removeItem('lcardrive_admin_mode')
    setAdminMode(false)
    router.push('/')
  }

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href={adminMode ? '/admin' : '/'} className="flex items-center gap-2 flex-shrink-0" aria-label="LCarDrive">
          <ShieldIcon gold={adminMode} />
          <span className={`font-bold text-lg ${adminMode ? 'text-[#FACC15]' : 'text-gray-900'}`}>
            LCarDrive
          </span>
          {adminMode && (
            <span className="text-[#FACC15] text-[10px] font-semibold tracking-wide">ADMIN</span>
          )}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {NAV.map(({ href, label }) => (
            <Link key={href} href={href}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === href
                  ? 'text-gray-900 bg-[#FACC15]'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {label === 'AI Match' && (
                <Sparkles size={12} className="inline mr-1 mb-0.5" aria-hidden="true" />
              )}
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-2">
          <Link href="/search"
            className="flex items-center gap-2 text-sm text-gray-500 border border-gray-200 rounded-xl px-3 py-1.5 hover:border-gray-300 transition-colors"
            aria-label="Search instructors"
          >
            <Search size={14} aria-hidden="true" />
            <span>Search instructors...</span>
          </Link>

          {!adminMode && <AdminButton variant="nav" />}

          {adminMode && (
            <button onClick={exitAdmin}
              className="flex items-center gap-1.5 text-xs font-bold text-white bg-red-500 px-3 py-1.5 rounded-xl hover:bg-red-600 active:scale-95 transition-all shadow-sm"
            >
              <LogOut size={12} /> Exit Admin
            </button>
          )}

          <UserMenu />
        </div>

        {/* Mobile right */}
        <div className="flex md:hidden items-center gap-2">
          {adminMode && (
            <button onClick={exitAdmin}
              className="flex items-center gap-1 text-[11px] font-bold text-white bg-red-500 px-2.5 py-1.5 rounded-lg hover:bg-red-600 active:scale-95"
            >
              <LogOut size={11} /> Exit
            </button>
          )}
          <Link href="/search" className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50" aria-label="Search">
            <Search size={18} className="text-gray-700" />
          </Link>
          <UserMenu />
          <button onClick={() => setOpen(!open)}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X size={18} className="text-gray-700" /> : <Menu size={18} className="text-gray-700" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-1">
          {NAV.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}
              className={`flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                pathname === href
                  ? 'text-gray-900 bg-[#FACC15]'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {label === 'AI Match' && <Sparkles size={14} className="text-gray-700" />}
              {label}
            </Link>
          ))}
          {!adminMode && (
            <div onClick={() => setOpen(false)}>
              <AdminButton variant="mobile-menu" />
            </div>
          )}
          {adminMode && (
            <button onClick={() => { setOpen(false); exitAdmin() }}
              className="w-full flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition-colors mt-1"
            >
              <LogOut size={16} /> Exit Admin Mode
            </button>
          )}
        </div>
      )}
    </header>
  )
}
