import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { LayoutDashboard, Users, Star, FileText, Upload, Flag } from 'lucide-react'

const NAV = [
  { href: '/admin',          label: 'Dashboard', Icon: LayoutDashboard },
  { href: '/admin/listings', label: 'Listings',  Icon: Users           },
  { href: '/admin/claims',   label: 'Claims',    Icon: FileText        },
  { href: '/admin/reviews',  label: 'Reviews',   Icon: Star            },
  { href: '/admin/flags',    label: 'Flags',     Icon: Flag            },
  { href: '/admin/import',   label: 'Import',    Icon: Upload          },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authObj = await auth()
  const role    = authObj.sessionClaims?.metadata?.role ?? authObj.sessionClaims?.publicMetadata?.role
  if (role !== 'admin') redirect('/')

  return (
    <div className="min-h-screen bg-[#F0F2FF]">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex gap-6">

          <aside className="hidden md:block w-52 flex-shrink-0">
            <div className="bg-white rounded-2xl p-3 sticky top-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-3 py-2 mb-1">Admin Panel</p>
              <nav className="space-y-0.5">
                {NAV.map(({ href, label, Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  >
                    <Icon size={16} className="text-gray-400" />
                    {label}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          <div className="md:hidden w-full mb-4">
            <div className="bg-white rounded-2xl p-2 flex gap-1 overflow-x-auto">
              {NAV.map(({ href, label, Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-50 whitespace-nowrap transition-colors"
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
