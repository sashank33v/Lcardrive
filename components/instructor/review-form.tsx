'use client'
import { useState } from 'react'
import { Star, Loader2, CheckCircle } from 'lucide-react'

interface Props { instructorId: string; instructorName: string }

const SUB_RATINGS = ['patience', 'communication', 'value', 'punctuality', 'overall'] as const

export function ReviewForm({ instructorId, instructorName }: Props) {
  const [form, setForm] = useState({
    reviewer_name:        '',
    reviewer_email:       '',
    rating_overall:       0,
    rating_patience:      0,
    rating_communication: 0,
    rating_value:         0,
    rating_punctuality:   0,
    pass_outcome:         '',
    review_text:          '',
  })
  const [loading,   setLoading]   = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error,     setError]     = useState('')

  const setRating = (field: string, val: number) => setForm(p => ({ ...p, [field]: val }))

  const submit = async () => {
    if (!form.reviewer_name || !form.reviewer_email || !form.rating_overall || !form.pass_outcome) {
      setError('Please fill in all required fields and add an overall rating.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, instructor_id: instructorId })
      })
      if (!res.ok) throw new Error('Failed to submit')
      setSubmitted(true)
    } catch {
      setError('Failed to submit review. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) return (
    <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
      <CheckCircle size={32} className="text-green-500 mx-auto mb-3" />
      <h3 className="font-bold text-green-800 mb-1">Review submitted!</h3>
      <p className="text-sm text-green-700">Thanks! Your review will appear after a quick check by our team.</p>
    </div>
  )

  const StarRating = ({ field, label }: { field: string; label: string }) => {
    const val = (form as any)[`rating_${field}`]
    return (
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-700 capitalize">{label}</span>
        <div className="flex gap-1">
          {[1,2,3,4,5].map(n => (
            <button key={n} onClick={() => setRating(`rating_${field}`, n)}>
              <Star size={20} className={n <= val ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-5 space-y-4">
      <h2 className="font-bold text-gray-900">Leave a Review</h2>
      <p className="text-sm text-gray-500">Had lessons with {instructorName}? Share your experience.</p>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1 block">Your Name *</label>
          <input value={form.reviewer_name} onChange={e => setForm(p => ({ ...p, reviewer_name: e.target.value }))}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#1A3CFF]"
            placeholder="First name" />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1 block">Email * (not shown)</label>
          <input type="email" value={form.reviewer_email} onChange={e => setForm(p => ({ ...p, reviewer_email: e.target.value }))}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#1A3CFF]"
            placeholder="your@email.com" />
        </div>
      </div>

      <div className="space-y-3 bg-gray-50 rounded-xl p-4">
        <p className="text-sm font-semibold text-gray-700">Rate your experience *</p>
        {SUB_RATINGS.map(r => <StarRating key={r} field={r} label={r} />)}
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-600 mb-1 block">Test outcome *</label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { val: 'passed_first',  label: '✅ Passed first go' },
            { val: 'passed_retry',  label: '✅ Passed after retries' },
            { val: 'still_learning',label: '📚 Still learning' },
            { val: 'not_tested',    label: '⏳ Not tested yet' },
          ].map(({ val, label }) => (
            <button key={val} onClick={() => setForm(p => ({ ...p, pass_outcome: val }))}
              className={`py-2.5 px-3 rounded-xl text-xs font-medium border-2 transition-colors text-left ${form.pass_outcome === val ? 'bg-[#1A3CFF] text-white border-[#1A3CFF]' : 'bg-white text-gray-700 border-gray-200'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-600 mb-1 block">Your review (optional)</label>
        <textarea value={form.review_text} onChange={e => setForm(p => ({ ...p, review_text: e.target.value }))}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#1A3CFF] resize-none"
          rows={3} placeholder="Share your experience with future learners..." maxLength={1000} />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button onClick={submit} disabled={loading}
        className="w-full bg-[#1A3CFF] text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50">
        {loading ? <Loader2 size={16} className="animate-spin" /> : null}
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </div>
  )
}
