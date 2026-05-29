'use client'
import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, Star } from 'lucide-react'

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchReviews = () => {
    fetch('/api/admin/reviews').then(r => r.json())
      .then(d => { setReviews(d.reviews || []); setLoading(false) })
  }

  useEffect(() => { fetchReviews() }, [])

  const action = async (id: string, act: 'approve' | 'reject') => {
    await fetch(`/api/admin/reviews/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: act })
    })
    fetchReviews()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Reviews Moderation</h1>

      {loading && <p className="text-gray-500">Loading...</p>}

      {!loading && reviews.length === 0 && (
        <div className="bg-white rounded-2xl p-8 text-center">
          <p className="text-3xl mb-2">✅</p>
          <p className="font-semibold text-gray-700">No pending reviews</p>
        </div>
      )}

      <div className="space-y-3">
        {reviews.map(r => (
          <div key={r.id} className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-gray-900">{r.reviewer_name}</p>
                  <div className="flex items-center gap-0.5">
                    {Array(r.rating_overall).fill(0).map((_, i) => (
                      <Star key={i} size={12} className="text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full capitalize">
                    {r.pass_outcome?.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-1">
                  For: <span className="font-medium">{r.instructors?.first_name} {r.instructors?.last_name}</span>
                  {' · '}{r.instructors?.suburb}
                </p>
                {r.review_text && (
                  <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-3 mt-2">
                    "{r.review_text}"
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(r.created_at).toLocaleDateString('en-AU')}
                </p>
              </div>

              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => action(r.id, 'reject')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-medium hover:bg-red-100"
                >
                  <XCircle size={15} /> Reject
                </button>
                <button
                  onClick={() => action(r.id, 'approve')}
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
