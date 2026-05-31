'use client'
import { useEffect, useState } from 'react'
import { Flag, ExternalLink, CheckCircle, X, Loader2, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default function AdminFlagsPage() {
  const [flags,    setFlags]    = useState<any[]>([])
  const [loading,  setLoading]  = useState(true)
  const [actionId, setActionId] = useState<string | null>(null)

  useEffect(() => { fetchFlags() }, [])

  const fetchFlags = async () => {
    setLoading(true)
    try {
      const res  = await fetch('/api/admin/flags')
      const data = await res.json()
      setFlags(data.flags || [])
    } finally {
      setLoading(false)
    }
  }

  const resolve = async (id: string, action: 'resolve' | 'dismiss') => {
    setActionId(id)
    try {
      await fetch(`/api/admin/flags/${id}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ action }),
      })
      setFlags(p => p.filter(f => f.id !== id))
    } finally {
      setActionId(null)
    }
  }

  const REASON_LABELS: Record<string, string> = {
    wrong_info:   'Wrong information',
    not_instructor: 'Not an instructor',
    spam:         'Spam / fake listing',
    inappropriate: 'Inappropriate content',
    other:        'Other',
  }

  return (
    <div className="space-y-5">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Flagged Listings</h1>
          <p className="text-sm text-gray-500 mt-0.5">{flags.length} pending review</p>
        </div>
        <button onClick={fetchFlags} className="text-sm text-[#1A3CFF] hover:underline">Refresh</button>
      </div>

      {loading && (
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white rounded-2xl p-5 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-2/3 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {!loading && flags.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={28} className="text-green-500" />
          </div>
          <h3 className="font-bold text-gray-900 text-lg mb-1">All clear!</h3>
          <p className="text-gray-500 text-sm">No flagged listings to review right now.</p>
        </div>
      )}

      {!loading && flags.length > 0 && (
        <div className="space-y-3">
          {flags.map(flag => (
            <div key={flag.id} className="bg-white rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Flag size={16} className="text-red-500" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-semibold text-gray-900 text-sm">
                        {flag.instructor?.first_name} {flag.instructor?.last_name}
                      </span>
                      <span className="text-xs text-gray-400">{flag.instructor?.suburb}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-xs px-2.5 py-1 rounded-full font-medium">
                        <AlertTriangle size={10} />
                        {REASON_LABELS[flag.reason] || flag.reason || 'Flagged'}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(flag.created_at).toLocaleDateString('en-AU')}
                      </span>
                    </div>
                    {flag.details && (
                      <p className="text-sm text-gray-600 bg-gray-50 rounded-xl px-3 py-2 mb-2">
                        "{flag.details}"
                      </p>
                    )}
                    {flag.instructor?.slug && (
                      <Link
                        href={`/instructors/${flag.instructor.suburb?.toLowerCase().replace(/\s+/g, '-')}/${flag.instructor.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-xs text-[#1A3CFF] hover:underline"
                      >
                        <ExternalLink size={12} /> View listing
                      </Link>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => resolve(flag.id, 'resolve')}
                    disabled={actionId === flag.id}
                    className="flex items-center gap-1.5 bg-red-50 text-red-700 border border-red-100 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-red-100 disabled:opacity-50 transition-colors"
                  >
                    {actionId === flag.id ? <Loader2 size={12} className="animate-spin" /> : <X size={12} />}
                    Remove listing
                  </button>
                  <button
                    onClick={() => resolve(flag.id, 'dismiss')}
                    disabled={actionId === flag.id}
                    className="flex items-center gap-1.5 bg-gray-50 text-gray-700 border border-gray-200 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-gray-100 disabled:opacity-50 transition-colors"
                  >
                    <CheckCircle size={12} />
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}
