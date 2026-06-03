import { supabaseServer } from '@/lib/clients/supabase-server'
import { Users, Star, FileText, Flag, TrendingUp, CheckCircle } from 'lucide-react'

async function getStats() {
  const [
    { count: totalInstructors },
    { count: verifiedInstructors },
    { count: pendingClaims },
    { count: pendingReviews },
    { count: totalReviews },
    { count: totalFlags },
    { data: recentSearches },
  ] = await Promise.all([
    supabaseServer.from('instructors').select('*', { count: 'exact', head: true }),
    supabaseServer.from('instructors').select('*', { count: 'exact', head: true }).eq('is_verified', true),
    supabaseServer.from('claims').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabaseServer.from('reviews').select('*', { count: 'exact', head: true }).eq('is_approved', false),
    supabaseServer.from('reviews').select('*', { count: 'exact', head: true }),
    supabaseServer.from('listing_flags').select('*', { count: 'exact', head: true }).eq('is_resolved', false),
    supabaseServer.from('search_logs').select('suburb, results_count').order('created_at', { ascending: false }).limit(100),
  ])

  const suburbCounts: Record<string, number> = {}
  recentSearches?.forEach(s => {
    const suburb = s.suburb?.trim()
    if (suburb && suburb !== 'undefined' && suburb !== '' && suburb.length > 2) {
      const normalised = suburb.charAt(0).toUpperCase() + suburb.slice(1).toLowerCase()
      suburbCounts[normalised] = (suburbCounts[normalised] || 0) + 1
    }
  })
  const topSuburbs = Object.entries(suburbCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  return {
    totalInstructors:    totalInstructors    || 0,
    verifiedInstructors: verifiedInstructors || 0,
    pendingClaims:       pendingClaims       || 0,
    pendingReviews:      pendingReviews      || 0,
    totalReviews:        totalReviews        || 0,
    totalFlags:          totalFlags          || 0,
    topSuburbs,
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  const STAT_CARDS = [
    {
      label: 'Total Instructors',
      value: stats.totalInstructors,
      Icon:  Users,
      gradient: 'from-blue-500 to-blue-600',
      light:    'bg-blue-50',
      text:     'text-blue-600',
    },
    {
      label: 'Verified',
      value: stats.verifiedInstructors,
      Icon:  CheckCircle,
      gradient: 'from-emerald-500 to-emerald-600',
      light:    'bg-emerald-50',
      text:     'text-emerald-600',
    },
    {
      label: 'Pending Claims',
      value: stats.pendingClaims,
      Icon:  FileText,
      gradient: 'from-amber-500 to-orange-500',
      light:    'bg-amber-50',
      text:     'text-amber-600',
    },
    {
      label: 'Pending Reviews',
      value: stats.pendingReviews,
      Icon:  Star,
      gradient: 'from-purple-500 to-purple-600',
      light:    'bg-purple-50',
      text:     'text-purple-600',
    },
    {
      label: 'Total Reviews',
      value: stats.totalReviews,
      Icon:  TrendingUp,
      gradient: 'from-teal-500 to-teal-600',
      light:    'bg-teal-50',
      text:     'text-teal-600',
    },
    {
      label: 'Open Flags',
      value: stats.totalFlags,
      Icon:  Flag,
      gradient: 'from-rose-500 to-rose-600',
      light:    'bg-rose-50',
      text:     'text-rose-600',
    },
  ]

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">LCarDrive admin overview</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {STAT_CARDS.map(({ label, value, Icon, gradient, light, text }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm overflow-hidden relative">
            {/* Coloured top strip */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`} />
            <div className={`w-10 h-10 ${light} rounded-xl flex items-center justify-center mb-3`}>
              <Icon size={18} className={text} />
            </div>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {(stats.pendingClaims > 0 || stats.pendingReviews > 0 || stats.totalFlags > 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <p className="font-semibold text-amber-800 text-sm mb-2">⚠️ Action required</p>
          <div className="space-y-1">
            {stats.pendingClaims > 0 && (
              <p className="text-sm text-amber-700">• {stats.pendingClaims} claim{stats.pendingClaims !== 1 ? 's' : ''} awaiting verification</p>
            )}
            {stats.pendingReviews > 0 && (
              <p className="text-sm text-amber-700">• {stats.pendingReviews} review{stats.pendingReviews !== 1 ? 's' : ''} awaiting approval</p>
            )}
            {stats.totalFlags > 0 && (
              <p className="text-sm text-amber-700">• {stats.totalFlags} listing{stats.totalFlags !== 1 ? 's' : ''} flagged for review</p>
            )}
          </div>
        </div>
      )}

      {/* Top searched suburbs */}
      {stats.topSuburbs.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4">Top Searched Suburbs</h2>
          <div className="space-y-3">
            {stats.topSuburbs.map(([suburb, count], i) => {
              const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-amber-500', 'bg-rose-500']
              const badges = ['bg-blue-100 text-blue-700', 'bg-emerald-100 text-emerald-700', 'bg-purple-100 text-purple-700', 'bg-amber-100 text-amber-700', 'bg-rose-100 text-rose-700']
              return (
                <div key={suburb} className="flex items-center gap-3">
                  <span className={`w-6 h-6 ${badges[i]} text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0`}>
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{suburb}</span>
                      <span className="text-xs text-gray-400">{count} search{count !== 1 ? 'es' : ''}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-2 ${colors[i]} rounded-full transition-all`}
                        style={{ width: `${(count / stats.topSuburbs[0][1]) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

    </div>
  )
}
