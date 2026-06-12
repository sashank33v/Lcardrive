'use client'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { ShieldCheck } from 'lucide-react'

interface Props {
  variant?: 'nav' | 'mobile-menu' | 'bottom-nav'
}

export function AdminButton({ variant = 'nav' }: Props) {
  const { user, isLoaded } = useUser()

  if (!isLoaded || !user) return null

  const role = (user.publicMetadata as any)?.role ?? (user.unsafeMetadata as any)?.role
  if (role !== 'admin') return null

  const handleClick = () => {
    localStorage.setItem('lcardrive_admin_mode', 'true')
    // Force a page reload so header re-reads localStorage immediately
    window.location.href = '/admin'
  }

  /* ── Bottom nav tab ── */
  if (variant === 'bottom-nav') {
    return (
      <button onClick={handleClick}
        className="flex flex-col items-center gap-0.5 px-3 py-1 text-yellow-500"
      >
        <ShieldCheck size={20} />
        <span className="text-[10px] font-semibold">Admin</span>
      </button>
    )
  }

  /* ── Mobile hamburger menu item ── */
  if (variant === 'mobile-menu') {
    return (
      <button onClick={handleClick}
        className="w-full flex items-center gap-2.5 px-3 py-3 rounded-xl text-sm font-bold text-yellow-700 bg-yellow-50 hover:bg-yellow-100 transition-colors border border-yellow-200"
      >
        <div className="w-7 h-7 bg-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0">
          <ShieldCheck size={14} className="text-white" />
        </div>
        Admin Panel
      </button>
    )
  }

  /* ── Desktop nav — beside avatar ── */
  return (
    <button onClick={handleClick}
      className="flex items-center gap-1.5 bg-[#1A2444] text-yellow-400 text-xs font-bold px-3 py-2 rounded-xl hover:bg-[#1A2444]/90 active:scale-95 transition-all border border-yellow-500/30"
    >
      <ShieldCheck size={13} />
      Admin
    </button>
  )
}
