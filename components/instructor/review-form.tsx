'use client'
import { useState } from 'react'
import { Star, Loader2, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface Props {
  instructorId:   string
  instructorName: string
}

const SUB_RATINGS = [
  { key: 'rating_patience',      label: 'Patience'      },
  { key: 'rating_communication', label: 'Communication' },
  { key: 'rating_value',         label: 'Value'         },
  { key: 'rating_punctuality',   label: 'Punctuality'   },
]

const PASS_OPTIONS = [
  { value: 'first_attempt', label: '✅ Passed first go!' },
  { value: 'multiple',      label: '🔄 Passed (multiple attempts)' },
  { value: 'still_learning',label: '📚 Still learning'  },
  { value: 'not_tested',    label: '🚗 Not tested yet'  },
]

function StarRating({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          className="transition-transform hover:scale-110"
        >
          <Star
            size={24}
            className={`transition-colors ${n <= (hover || value) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
          />
        </button>
      ))}
    </div>
  )
}

export function ReviewForm({ instructorId, instructorName }: Props) {
  const [open,        setOpen]        = useState(false)
  const [submitting,  setSubmitting]  = useState(false)
  const [submitted,   setSubmitted]   = useState(false)

  const [overall,      setOverall]     = useState(0)
  const [subRatings,   setSubRatings]  = useState<Record<string, number>>({})
  const [passOutcome,  setPassOutcome] = useState('')
  const [reviewText,   setReviewText]  = useState('')
  const [reviewerName, setName]        = useState('')
  const [reviewerEmail,setEmail]       = useState('')

  const handleSubmit = async () => {
    if (!overall)            return toast.error('Please add an overall rating')
    if (!passOutcome)        return toast.error('Please select your test outcome')
    if (!reviewerName.trim()) return toast.error('Please enter your name')
    if (!reviewerEmail.trim()) return toast.error('Please enter your email')

    setSubmitting(true)
    try {
      const res = await fetch('/api/reviews', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instructor_id:        instructorId,
          rating_overall:       overall,
          rating_patience:      subRatings.rating_patience,
          rating_communication: subRatings.rating_communication,
          rating_value:         subRatings.rating_value,
          rating_punctuality:   subRatings.rating_punctuality,
          pass_outcome:         passOutcome,
          review_text:          reviewText.trim(),
          reviewer_name:        reviewerName.trim(),
          reviewer_email:       reviewerEmail.trim(),
        })
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Failed to submit review')
        return
      }

      setSubmitted(true)
      toast.success('Review submitted! It will appear after approval.')
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
        <CheckCircle size={32} className="text-green-500 mx-auto mb-2" />
        <p className="font-bold text-green-800">Review submitted!</p>
        <p className="text-sm text-green-700 mt-1">It will appear on the profile after approval.</p>
      </div>
    )
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full bg-white border-2 border-dashed border-gray-200 rounded-2xl py-4 text-sm font-semibold text-gray-600 hover:border-[#1A3CFF] hover:text-[#1A3CFF] transition-colors flex items-center justify-center gap-2"
      >
        <Star size={16} /> Write a review for {instructorName}
      </button>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-5 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900">Write a Review</h3>
        <button onClick={() => setOpen(false)} className="text-xs text-gray-400 hover:text-gray-600">Cancel</button>
      </div>

      {/* Overall rating */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-2">Overall Rating <span className="text-red-500">*</span></p>
        <StarRating value={overall} onChange={setOverall} />
      </div>

      {/* Sub-ratings */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-gray-700">Detailed Ratings</p>
        {SUB_RATINGS.map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-sm text-gray-600 w-28">{label}</span>
            <StarRating
              value={subRatings[key] || 0}
              onChange={n => setSubRatings(p => ({ ...p, [key]: n }))}
            />
          </div>
        ))}
      </div>

      {/* Pass outcome */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-2">Test Outcome <span className="text-red-500">*</span></p>
        <div className="grid grid-cols-2 gap-2">
          {PASS_OPTIONS.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setPassOutcome(opt.value)}
              className={`text-sm px-3 py-2.5 rounded-xl border-2 text-left transition-colors ${
                passOutcome === opt.value
                  ? 'border-[#1A3CFF] bg-blue-50 text-[#1A3CFF] font-medium'
                  : 'border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Review text */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-2">Your Review</p>
        <textarea
          rows={3}
          value={reviewText}
          onChange={e => setReviewText(e.target.value)}
          placeholder={`Share your experience with ${instructorName}...`}
          maxLength={1000}
          className="w-full border border-gray-200 focus:border-[#1A3CFF] rounded-xl px-4 py-3 text-sm outline-none resize-none bg-white transition-colors placeholder-gray-400"
        />
        <p className="text-xs text-gray-400 text-right mt-1">{reviewText.length}/1000</p>
      </div>

      {/* Name + Email */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-1.5">Your Name <span className="text-red-500">*</span></p>
          <input
            type="text"
            value={reviewerName}
            onChange={e => setName(e.target.value)}
            placeholder="First name"
            className="w-full border border-gray-200 focus:border-[#1A3CFF] rounded-xl px-3 py-2.5 text-sm outline-none bg-white transition-colors"
          />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-1.5">Your Email <span className="text-red-500">*</span></p>
          <input
            type="email"
            value={reviewerEmail}
            onChange={e => setEmail(e.target.value)}
            placeholder="email@example.com"
            className="w-full border border-gray-200 focus:border-[#1A3CFF] rounded-xl px-3 py-2.5 text-sm outline-none bg-white transition-colors"
          />
        </div>
      </div>

      <p className="text-xs text-gray-400">
        Your email won't be shown publicly. Reviews are approved before appearing.
      </p>

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full bg-[#1A3CFF] text-white font-semibold py-3.5 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
      >
        {submitting ? <><Loader2 size={16} className="animate-spin" /> Submitting...</> : 'Submit Review'}
      </button>
    </div>
  )
}
