'use client'
import { useState } from 'react'
import { ArrowLeft, ArrowRight, X, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { BottomNav } from '@/components/layout/bottom-nav'
import { InstructorCard } from '@/components/instructor/instructor-card'

const QUESTIONS = [
  { id: 'suburb',          label: 'What suburb are you in?',           type: 'text',   placeholder: 'e.g. Footscray' },
  { id: 'transmission',    label: 'Automatic or manual?',              type: 'choice', options: ['auto', 'manual', 'both'] },
  { id: 'special_needs',   label: 'Any special requirements?',         type: 'multi',  options: ['anxiety', 'adhd', 'international', 'none'] },
  { id: 'available_days',  label: 'Which days can you take lessons?',  type: 'multi',  options: ['mon','tue','wed','thu','fri','sat','sun'] },
  { id: 'max_hourly_rate', label: "What's your max budget per hour?",  type: 'range',  min: 40, max: 150 },
]

export default function FindMyInstructorPage() {
  const [step, setStep]       = useState(0)
  const [answers, setAnswers] = useState<any>({ special_needs: [], available_days: [], max_hourly_rate: 150 })
  const [loading, setLoading] = useState(false)
  const [matches, setMatches] = useState<any[]>([])
  const [fallback, setFallback] = useState(false)
  const [done, setDone]       = useState(false)

  const q = QUESTIONS[step]

  const updateAnswer = (val: any) => setAnswers((p: any) => ({ ...p, [q.id]: val }))

  const toggleMulti = (val: string) => {
    const current = answers[q.id] || []
    setAnswers((p: any) => ({
      ...p,
      [q.id]: current.includes(val)
        ? current.filter((v: string) => v !== val)
        : [...current, val]
    }))
  }

  const next = () => {
    if (step < QUESTIONS.length - 1) setStep(s => s + 1)
    else submit()
  }

  const submit = async () => {
    setDone(true)
    setLoading(true)
    try {
      const res  = await fetch('/api/ai/match', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          suburb:          answers.suburb || '',
          transmission:    answers.transmission || 'auto',
          special_needs:   answers.special_needs || [],
          available_days:  answers.available_days || [],
          max_hourly_rate: answers.max_hourly_rate || 150,
        })
      })
      const data = await res.json()

      if (data.fallback || !data.matches?.length) {
        setFallback(true)
      } else {
        setMatches(data.matches)
      }
    } catch {
      setFallback(true)
    } finally {
      setLoading(false)
    }
  }

  const searchUrl = answers.suburb
    ? `/search?suburb=${encodeURIComponent(answers.suburb)}`
    : '/search'

  // Results screen
  if (done) {
    return (
      <div className="min-h-screen bg-[#F0F2FF]">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-6 pb-28">

          <Link href="/search" className="flex items-center gap-2 text-sm text-gray-500 mb-6 hover:text-gray-700">
            <ArrowLeft size={16} /> Back to search
          </Link>

          {loading && (
            <div className="text-center py-20">
              <Loader2 size={40} className="text-[#1A3CFF] animate-spin mx-auto mb-4" />
              <p className="font-semibold text-gray-700">Finding your best matches...</p>
              <p className="text-sm text-gray-500 mt-1">
                AI is analysing {answers.suburb || 'Melbourne'} instructors
              </p>
            </div>
          )}

          {!loading && fallback && (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">🔍</p>
              <h2 className="font-bold text-gray-900 text-xl mb-2">No matches found</h2>
              <p className="text-gray-500 text-sm mb-6">
                Try broadening your search criteria
              </p>
              <Link href={searchUrl}>
                <button className="bg-[#1A3CFF] text-white px-6 py-3 rounded-xl font-semibold">
                  Browse all instructors
                </button>
              </Link>
            </div>
          )}

          {!loading && matches.length > 0 && (
            <>
              <h2 className="font-bold text-gray-900 text-xl mb-1">Your top matches</h2>
              <p className="text-gray-500 text-sm mb-5">
                AI selected these based on your preferences
              </p>
              <div className="space-y-4">
                {matches.map((m, i) => {
                  const labels = ['Best match', 'Runner up', '3rd pick']
                  return (
                    <div key={m.id}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-6 h-6 bg-[#1A3CFF] text-white text-xs font-bold rounded-full flex items-center justify-center">
                          {i + 1}
                        </span>
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          {labels[i] || `Match ${i + 1}`}
                        </span>
                      </div>
                      <InstructorCard {...m} />
                      {m.ai_reason && (
                        <div className="mt-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                          <p className="text-xs text-blue-700">
                            <span className="font-semibold">✦ Why this match: </span>
                            {m.ai_reason}
                          </p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </main>
        <BottomNav />
      </div>
    )
  }

  // Question flow
  return (
    <div className="min-h-screen bg-[#F0F2FF]">
      <Header />
      <main className="max-w-lg mx-auto px-4 py-8 pb-28">

        {/* Progress bar */}
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => step > 0 && setStep(s => s - 1)} className="text-gray-400 hover:text-gray-600">
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1 flex gap-1.5">
            {QUESTIONS.map((_, i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? 'bg-[#1A3CFF]' : 'bg-gray-200'}`} />
            ))}
          </div>
          <Link href="/search" className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </Link>
        </div>

        <div className="mb-8">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">
            Question {step + 1} of {QUESTIONS.length}
          </p>
          <h2 className="text-2xl font-bold text-gray-900">{q.label}</h2>
        </div>

        {/* Text input */}
        {q.type === 'text' && (
          <input
            autoFocus
            type="text"
            value={answers[q.id] || ''}
            onChange={e => updateAnswer(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && answers[q.id] && next()}
            placeholder={q.placeholder}
            className="w-full border-2 border-gray-200 focus:border-[#1A3CFF] rounded-2xl px-5 py-4 text-lg outline-none bg-white transition-colors"
          />
        )}

        {/* Single choice */}
        {q.type === 'choice' && (
          <div className="space-y-3">
            {q.options?.map(opt => (
              <button
                key={opt}
                onClick={() => { updateAnswer(opt); setTimeout(next, 200) }}
                className={`w-full px-5 py-4 rounded-2xl text-left font-semibold capitalize border-2 transition-all ${
                  answers[q.id] === opt
                    ? 'bg-[#1A3CFF] text-white border-[#1A3CFF]'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-[#1A3CFF]'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {/* Multi select */}
        {q.type === 'multi' && (
          <div className="flex flex-wrap gap-2">
            {q.options?.map(opt => {
              const active = (answers[q.id] || []).includes(opt)
              return (
                <button
                  key={opt}
                  onClick={() => toggleMulti(opt)}
                  className={`px-5 py-3 rounded-2xl font-medium capitalize border-2 transition-all ${
                    active
                      ? 'bg-[#1A3CFF] text-white border-[#1A3CFF]'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-[#1A3CFF]'
                  }`}
                >
                  {opt}
                </button>
              )
            })}
          </div>
        )}

        {/* Range */}
        {q.type === 'range' && (
          <div>
            <p className="text-4xl font-bold text-[#1A3CFF] mb-4 text-center">
              ${answers[q.id] || 150}/hr
            </p>
            <input
              type="range" min={q.min} max={q.max} step={5}
              value={answers[q.id] || 150}
              onChange={e => updateAnswer(parseInt(e.target.value))}
              className="w-full accent-[#1A3CFF]"
            />
            <div className="flex justify-between text-sm text-gray-400 mt-1">
              <span>${q.min}</span><span>${q.max}+</span>
            </div>
          </div>
        )}

        {/* Next button */}
        {(q.type === 'text' || q.type === 'multi' || q.type === 'range') && (
          <button
            onClick={next}
            className="w-full mt-8 bg-[#1A3CFF] text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
          >
            {step === QUESTIONS.length - 1 ? 'Find My Instructor ✦' : 'Next'}
            {step < QUESTIONS.length - 1 && <ArrowRight size={18} />}
          </button>
        )}

      </main>
      <BottomNav />
    </div>
  )
}
