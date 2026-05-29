'use client'
import { useEffect, useState } from 'react'
import { Search, CheckCircle, Clock, AlertCircle, Trash2, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function AdminListingsPage() {
  const [instructors, setInstructors] = useState<any[]>([])
  const [search, setSearch]           = useState('')
  const [loading, setLoading]         = useState(true)

  useEffect(() => {
    fetch('/api/admin/listings').then(r => r.json())
      .then(d => { setInstructors(d.instructors || []); setLoading(false) })
  }, [])

  const filtered = instructors.filter(i =>
    `${i.first_name} ${i.last_name} ${i.suburb}`.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete ${name}? This cannot be undone.`)) return
    const res = await fetch(`/api/admin/listings/${id}`, { method: 'DELETE' })
    if (res.ok) setInstructors(prev => prev.filter(x => x.id !== id))
    else alert('Failed to delete. Please try again.')
  }

  const statusBadge = (i: any) => {
    if (i.is_verified) return (
      <span className="flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
        <CheckCircle size={10} />Verified
      </span>
    )
    if (i.is_claimed) return (
      <span className="flex items-center gap-1 text-xs text-yellow-700 bg-yellow-50 px-2 py-0.5 rounded-full">
        <Clock size={10} />Pending
      </span>
    )
    return (
      <span className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
        <AlertCircle size={10} />Unclaimed
      </span>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">All Listings</h1>
        <span className="text-sm text-gray-500">{instructors.length} total</span>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-3 border border-gray-200 mb-4">
        <Search size={16} className="text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or suburb..."
          className="flex-1 outline-none text-sm text-gray-800 placeholder-gray-400"
        />
      </div>

      {loading && <p className="text-gray-500 text-sm">Loading...</p>}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Name</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Suburb</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Status</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Profile %</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(i => (
              <tr key={i.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900">
                  {i.first_name} {i.last_name}
                </td>
                <td className="px-4 py-3 text-gray-500">{i.suburb}</td>
                <td className="px-4 py-3">{statusBadge(i)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-1.5 bg-[#1A3CFF] rounded-full"
                        style={{ width: `${i.profile_completeness}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400">{i.profile_completeness}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/instructors/${i.suburb?.toLowerCase().replace(/\s+/g, '-')}/${i.slug}`}
                      target="_blank"
                      className="flex items-center gap-1 text-xs text-[#1A3CFF] hover:underline"
                    >
                      <ExternalLink size={12} /> View
                    </Link>
                    <button
                      onClick={() => handleDelete(i.id, `${i.first_name} ${i.last_name}`)}
                      className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 hover:underline transition-colors"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!loading && filtered.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">
            No listings found
          </div>
        )}
      </div>
    </div>
  )
}
