'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Users, Clock, Star, Flag, TrendingUp } from 'lucide-react'

export default function AdminPage() {
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    fetch('/api/admin/stats').then(r => r.json()).then(setStats)
  }, [])

  const cards = [
    { label: 'Total Listings',    value: stats?.total ?? '—',    icon: Users,     color: 'bg-blue-50 text-blue-600'   },
    { label: 'Pending Claims',    value: stats?.pending_claims ?? '—', icon: Clock, color: 'bg-yellow-50 text-yellow-600' },
    { label: 'Pending Reviews',   value: stats?.pending_reviews ?? '—', icon: Star, color: 'bg-purple-50 text-purple-600' },
    { label: 'Unresolved Flags',  value: stats?.flags ?? '—',    icon: Flag,      color: 'bg-red-50 text-red-600'      },
  ]

  const sections = [
    { href: '/admin/listings', label: 'All Listings',   desc: 'View and edit instructor listings'     },
    { href: '/admin/claims',   label: 'Claims Queue',   desc: 'Approve or reject instructor claims'  },
    { href: '/admin/reviews',  label: 'Reviews',        desc: 'Moderate submitted reviews'           },
    { href: '/admin/flags',    label: 'Flags',          desc: 'Review flagged listings'              },
    { href: '/admin/import',   label: 'CSV Import',     desc: 'Bulk import instructor listings'      },
  ]

  return (
    <div className="min-h-screen bg-[#F0F2FF] p-6">
      <div className="max-w-4xl mx-auto">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 text-sm">Platform overview & moderation queue.</p>
          </div>
          <span className="bg-[#1A3CFF] text-white text-xs px-3 py-1 rounded-full font-medium">ADMIN</span>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {cards.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl p-4 shadow-sm">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                <Icon size={18} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sections.map(({ href, label, desc }) => (
            <Link key={href} href={href}
              className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between"
            >
              <div>
                <p className="font-semibold text-gray-900">{label}</p>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
              <span className="text-gray-400">→</span>
            </Link>
          ))}
        </div>

      </div>
    </div>
  )
}
