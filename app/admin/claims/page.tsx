'use client'
import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, ExternalLink } from 'lucide-react'

export default function AdminClaimsPage() {
  const [claims, setClaims]   = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchClaims = () => {
    fetch('/api/admin/claims').then(r => r.json())
      .then(d => { setClaims(d.claims || []); setLoading(false) })
  }

  useEffect(() => { fetchClaims() }, [])

  const action = async (id: string, instructorId: string, act: 'approve' | 'reject') => {
    await fetch(`/api/admin/claims/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: act, instructor_id: instructorId })
    })
    fetchClaims()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Claims Queue</h1>

      {loading && <p className="text-gray-500">Loading...</p>}

      {!loading && claims.length === 0 && (
        <div className="bg-white rounded-2xl p-8 text-center">
          <p className="text-3xl mb-2">✅</p>
          <p className="font-semibold text-gray-700">All caught up — no pending claims</p>
        </div>
      )}

      <div className="space-y-3">
        {claims.map(c => (
          <div key={c.id} className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-gray-900">
                    {c.instructors?.first_name} {c.instructors?.last_name}
                  </p>
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Pending</span>
                </div>
                <p className="text-sm text-gray-500 mb-1">
                  📍 {c.instructors?.suburb} · ADI: <span className="font-mono font-semibold">{c.adi_submitted}</span>
                </p>
                <p className="text-xs text-gray-400">
                  Submitted {new Date(c.created_at).toLocaleDateString('en-AU')}
                </p>
              </div>

              <div className="flex gap-2 flex-shrink-0">
                
                  href={`/instructors/${c.instructors?.suburb?.toLowerCase().replace(/\s+/g, '-')}/${c.instructors?.slug}`}
                  target="_blank"
                  className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-500"
                >
                  <ExternalLink size={16} />
                </a>
                <button
                  onClick={() => action(c.id, c.instructor_id, 'reject')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-medium hover:bg-red-100"
                >
                  <XCircle size={15} /> Reject
                </button>
                <button
                  onClick={() => action(c.id, c.instructor_id, 'approve')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#1A3CFF] text-white rounded-xl text-sm font-medium hover:bg-blue-700"
                >
                  <CheckCircle size={15} /> Approve
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
