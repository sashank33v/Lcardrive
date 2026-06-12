import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth, currentUser } from '@clerk/nextjs/server'
import type { Metadata } from 'next'
import { LayoutDashboard, Users, Star, FileText, Upload, Flag } from 'lucide-react'
import { Header } from '@/components/layout/header'

export const metadata: Metadata = {
  title:  'Admin Panel | LCarDrive',
  robots: { index: false },
}

const NAV = [
  { href: '/admin',          label: 'Dashboard', Icon: LayoutDashboard },
  { href: '/admin/listings', label: 'Listings',  Icon: Users           },
  { href: '/admin/claims',   label: 'Claims',    Icon: FileText        },
  { href: '/admin/reviews',  label: 'Reviews',   Icon: Star            },
  { href: '/admin/flags',    label: 'Flags',     Icon: Flag            },
  { href: '/admin/import',   label: 'Import',    Icon: Upload          },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  // ── Check role via currentUser (reads publicMetadata reliably) ──
  const user = await currentUser()
  const role = (user?.publicMetadata as any)?.role

  if (role !== 'admin') redirect('/')

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-6 pb-12">
        <div className="flex gap-6">

          {/* Sidebar */}
          <aside className="hidden md:block w-52 flex-shrink-0">
            <div className="bg-white rounded-2xl p-3 sticky top-20 border border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-3 py-2 mb-1">
                Admin Panel
              </p>
              <nav className="space-y-0.5">
                {NAV.map(({ href, label, Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-yellow-50 hover:text-gray-900 transition-colors group"
                  >
                    <Icon size={16} className="text-gray-400 group-hover:text-[#FACC15]" />
                    {label}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Mobile nav */}
          <div className="md:hidden w-full mb-4">
            <div className="bg-white rounded-2xl p-2 flex gap-1 overflow-x-auto border border-gray-100">
              {NAV.map(({ href, label, Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-700 hover:bg-yellow-50 whitespace-nowrap transition-colors"
                >
                  <Icon size={14} />
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  )
}
