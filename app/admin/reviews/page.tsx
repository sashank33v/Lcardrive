'use client'
import { useEffect, useState } from 'react'
import { Star, CheckCircle, Trash2, Loader2 } from 'lucide-react'

export default function AdminReviewsPage() {
  const [reviews,  setReviews]  = useState<any[]>([])
  const [loading,  setLoading]  = useState(true)
  const [actionId, setActionId] = useState<string | null>(null)

  useEffect(() => { fetchReviews() }, [])

  const fetchReviews = async () => {
    setLoading(true)
    try {
      const res  = await fetch('/api/admin/reviews')
      const data = await res.json()
      setReviews(data.reviews || [])
    } finally {
      setLoading(false)
    }
  }

  const action = async (id: string, act: 'approve' | 'reject') => {
    setActionId(id)
    try {
      await fetch(`/api/admin/reviews/${id}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ action: act }),
      })
      setReviews(p => p.filter(r => r.id !== id))
    } finally {
      setActionId(null)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
          <p className="text-sm text-gray-500 mt-0.5">{reviews.length} pending approval</p>
        </div>
        <button onClick={fetchReviews} className="text-sm text-[#1A3CFF] hover:underline">Refresh</button>
      </div>

      {loading && (
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white rounded-2xl p-5 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-full mb-1" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
            </div>
          ))}
        </div>
      )}

      {!loading && reviews.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={28} className="text-green-500" />
          </div>
          <h3 className="font-bold text-gray-900 text-lg mb-1">All caught up!</h3>
          <p className="text-gray-500 text-sm">No reviews pending approval.</p>
        </div>
      )}

      {!loading && reviews.length > 0 && (
        <div className="space-y-3">
          {reviews.map(r => (
            <div key={r.id} className="bg-white rounded-2xl p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-semibold text-gray-900 text-sm">{r.reviewer_name}</span>
                    <span className="text-xs text-gray-400">→</span>
                    <span className="text-sm text-gray-600">{r.instructor?.first_name} {r.instructor?.last_name}</span>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {[1,2,3,4,5].map(n => (
                      <Star key={n} size={12} className={n <= r.rating_overall ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} />
                    ))}
                    {r.pass_outcome && (
                      <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">
                        {r.pass_outcome.replace(/_/g, ' ')}
                      </span>
                    )}
                  </div>
                  {r.review_text && (
                    <p className="text-sm text-gray-600 bg-gray-50 rounded-xl px-3 py-2">{r.review_text}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">{new Date(r.created_at).toLocaleDateString('en-AU')}</p>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => action(r.id, 'approve')}
                    disabled={actionId === r.id}
                    className="flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-green-100 disabled:opacity-50 transition-colors"
                  >
                    {actionId === r.id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />}
                    Approve
                  </button>
                  <button
                    onClick={() => action(r.id, 'reject')}
                    disabled={actionId === r.id}
                    className="flex items-center gap-1.5 bg-red-50 text-red-700 border border-red-100 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-red-100 disabled:opacity-50 transition-colors"
                  >
                    <Trash2 size={12} /> Delete
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
