import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const links = [
    { href: '/portal/profile',       label: 'My Profile'    },
    { href: '/portal/pricing',       label: 'Pricing'       },
    { href: '/portal/availability',  label: 'Availability'  },
    { href: '/portal/service-areas', label: 'Service Areas' },
  ]

  return (
    <div className="min-h-screen bg-[#F0F2FF] flex">
      <aside className="hidden md:flex flex-col w-56 bg-white border-r border-gray-200 p-4 fixed h-full z-30">
        <Link href="/" className="text-lg font-bold text-[#1A3CFF] mb-8 block">LCarDrive</Link>
        <nav className="flex-1 space-y-1">
          {links.map(({ href, label }) => (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#1A3CFF] transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="pt-4 border-t border-gray-100 flex items-center gap-3">
          <UserButton afterSignOutUrl="/" />
          <span className="text-sm text-gray-500">Account</span>
        </div>
      </aside>

      <main className="flex-1 md:ml-56 p-4 md:p-8 pb-24 md:pb-8">
        {children}
      </main>

      {/* Mobile nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 flex">
        {links.map(({ href, label }) => (
          <Link key={href} href={href} className="flex-1 flex flex-col items-center py-2 gap-0.5">
            <span className="text-xs text-gray-500">{label.split(' ')[0]}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
