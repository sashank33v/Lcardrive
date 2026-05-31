import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import {
  LayoutDashboard, User, DollarSign,
  MapPin, Calendar, ChevronRight
} from 'lucide-react'

const NAV = [
  { href: '/portal',              label: 'Dashboard',    Icon: LayoutDashboard },
  { href: '/portal/profile',      label: 'My Profile',   Icon: User            },
  { href: '/portal/pricing',      label: 'Pricing',      Icon: DollarSign      },
  { href: '/portal/availability', label: 'Availability', Icon: Calendar        },
  { href: '/portal/service-areas',label: 'Service Areas',Icon: MapPin          },
]

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  return (
    <div className="min-h-screen bg-[#F0F2FF]">
      <div className="max-w-5xl mx-auto px-4 py-6 pb-24 md:pb-8">

        {/* Mobile horizontal nav */}
        <div className="md:hidden mb-4 -mx-4 px-4">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {NAV.map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-1.5 px-3 py-2.5 bg-white rounded-xl text-xs font-medium text-gray-700 whitespace-nowrap border border-gray-200 hover:border-[#1A3CFF] hover:text-[#1A3CFF] transition-colors flex-shrink-0"
              >
                <Icon size={14} />
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div className="md:flex md:gap-6">

          {/* Desktop sidebar */}
          <aside className="hidden md:block w-52 flex-shrink-0">
            <div className="bg-white rounded-2xl p-3 sticky top-20">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-3 py-2">
                Instructor Portal
              </p>
              <nav className="space-y-0.5">
                {NAV.map(({ href, label, Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={15} className="text-gray-400 group-hover:text-[#1A3CFF] transition-colors" />
                      {label}
                    </div>
                    <ChevronRight size={14} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  )
}
