'use client'
import { useState } from 'react'
import {
  ArrowLeft, ArrowRight, X, Loader2,
  Car, Settings2, Shuffle, HelpCircle,
  Heart, Zap, Globe2, CheckCircle2,
  MapPin, Sparkles, Calendar, DollarSign
} from 'lucide-react'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { BottomNav } from '@/components/layout/bottom-nav'
import { InstructorCard } from '@/components/instructor/instructor-card'

type QuestionType = 'text' | 'choice' | 'multi' | 'range'

interface Option {
  value: string
  label: string
  desc:  string
  Icon:  any
}

interface Question {
  id:      string
  label:   string
  hint?:   string
  type:    QuestionType
  options?: Option[]
  min?:    number
  max?:    number
  placeholder?: string
}

const QUESTIONS: Question[] = [
  {
    id:    'suburb',
    label: 'Where do you live?',
    hint:  "We'll find instructors in your area",
    type:  'text',
    placeholder: 'Enter suburb or postcode',
  },
  {
    id:    'transmission',
    label: 'Automatic or manual?',
    hint:  'Choose the transmission type you want to learn',
    type:  'choice',
    options: [
      { value: 'auto',   label: 'Automatic', desc: 'Easier to learn',  Icon: Car        },
      { value: 'manual', label: 'Manual',    desc: 'More control',     Icon: Settings2  },
      { value: 'both',   label: 'Both',      desc: "I'm flexible",     Icon: Shuffle    },
      { value: 'any',    label: 'Not sure',  desc: 'Help me decide',   Icon: HelpCircle },
    ],
  },
  {
    id:    'special_needs',
    label: 'Any special requirements?',
    hint:  'Select all that apply',
    type:  'multi',
    options: [
      { value: 'anxiety',       label: 'Anxiety-friendly', desc: 'Calm, patient instructor', Icon: Heart       },
      { value: 'adhd',          label: 'ADHD support',     desc: 'Adaptive teaching',        Icon: Zap         },
      { value: 'international', label: 'Intl. licence',    desc: 'Overseas conversion',      Icon: Globe2      },
      { value: 'none',          label: 'None',             desc: 'Just regular lessons',     Icon: CheckCircle2 },
    ],
  },
  {
    id:    'available_days',
    label: 'When can you take lessons?',
    hint:  'Select all days that work for you',
    type:  'multi',
    options: [
      { value: 'mon', label: 'Monday',    desc: '', Icon: Calendar },
      { value: 'tue', label: 'Tuesday',   desc: '', Icon: Calendar },
      { value: 'wed', label: 'Wednesday', desc: '', Icon: Calendar },
      { value: 'thu', label: 'Thursday',  desc: '', Icon: Calendar },
      { value: 'fri', label: 'Friday',    desc: '', Icon: Calendar },
      { value: 'sat', label: 'Saturday',  desc: '', Icon: Calendar },
      { value: 'sun', label: 'Sunday',    desc: '', Icon: Calendar },
    ],
  },
  {
    id:    'max_hourly_rate',
    label: "What's your budget?",
    hint:  'Maximum you want to spend per hour',
    type:  'range',
    min:   40,
    max:   150,
  },
]

export default function FindMyInstructorPage() {
  const [step, setStep]       = useState(0)
  const [answers, setAnswers] = useState<any>({ special_needs: [], available_days: [], max_hourly_rate: 80 })
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

  const canAdvance = () => {
    if (q.type === 'text')   return !!answers[q.id]?.trim()
    if (q.type === 'choice') return !!answers[q.id]
    if (q.type === 'multi')  return (answers[q.id] || []).length > 0
    if (q.type === 'range')  return true
    return false
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
        body: JSON.stringify({
          suburb:          answers.suburb || '',
          transmission:    answers.transmission || 'auto',
          special_needs:   answers.special_needs || [],
          available_days:  answers.available_days || [],
          max_hourly_rate: answers.max_hourly_rate || 150,
        })
      })
      const data = await res.json()
      if (data.fallback || !data.matches?.length) setFallback(true)
      else setMatches(data.matches)
    } catch {
      setFallback(true)
    } finally {
      setLoading(false)
    }
  }

  const searchUrl = answers.suburb ? `/search?suburb=${encodeURIComponent(answers.suburb)}` : '/search'

  // Results screen
  if (done) {
    return (
      <div className="min-h-screen bg-[#F0F2FF]">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-8 pb-28">

          <Link href="/search" className="flex items-center gap-2 text-sm text-gray-500 mb-6 hover:text-gray-700 transition-colors">
            <ArrowLeft size={16} /> Back to search
          </Link>

          {loading && (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#1A3CFF] rounded-2xl mb-4">
                <Loader2 size={28} className="text-white animate-spin" />
              </div>
              <p className="font-semibold text-gray-900 text-lg">Finding your perfect matches</p>
              <p className="text-sm text-gray-500 mt-1">AI is analysing instructors in {answers.suburb || 'your area'}...</p>
            </div>
          )}

          {!loading && fallback && (
            <div className="text-center py-12 bg-white rounded-2xl p-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mb-4">
                <HelpCircle size={28} className="text-gray-400" />
              </div>
              <h2 className="font-bold text-gray-900 text-xl mb-2">No matches found</h2>
              <p className="text-gray-500 text-sm mb-6">Try broadening your search criteria</p>
              <Link href={searchUrl}>
                <button className="bg-[#1A3CFF] text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                  Browse all instructors
                </button>
              </Link>
            </div>
          )}

          {!loading && matches.length > 0 && (
            <>
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-100 text-purple-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
                  <Sparkles size={12} /> AI-MATCHED
                </div>
                <h2 className="font-bold text-gray-900 text-2xl mb-1">Your top matches</h2>
                <p className="text-gray-500 text-sm">Based on your preferences in {answers.suburb}</p>
              </div>

              <div className="space-y-5">
                {matches.map((m, i) => {
                  const labels = ['Best match', 'Runner up', '3rd pick']
                  return (
                    <div key={m.id}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-7 h-7 bg-[#1A3CFF] text-white text-xs font-bold rounded-full flex items-center justify-center">
                          {i + 1}
                        </span>
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                          {labels[i] || `Match ${i + 1}`}
                        </span>
                      </div>
                      <InstructorCard {...m} />
                      {m.ai_reason && (
                        <div className="mt-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                          <p className="text-xs text-blue-700 flex items-start gap-2">
                            <Sparkles size={12} className="mt-0.5 flex-shrink-0" />
                            <span><span className="font-semibold">Why this match: </span>{m.ai_reason}</span>
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
      <main className="max-w-xl mx-auto px-4 py-6 pb-28">

        {/* Top bar */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => step > 0 && setStep(s => s - 1)}
            disabled={step === 0}
            className="w-10 h-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="flex-1 flex gap-1.5">
            {QUESTIONS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? 'bg-[#1A3CFF]' : 'bg-gray-200'}`}
              />
            ))}
          </div>
          <Link
            href="/search"
            className="w-10 h-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:border-gray-300 transition-colors"
          >
            <X size={16} />
          </Link>
        </div>

        {/* AI badge */}
        <div className="inline-flex items-center gap-1.5 bg-purple-50 border border-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
          <Sparkles size={11} />
          AI-POWERED MATCH · {step + 1}/{QUESTIONS.length}
        </div>

        {/* Question */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1.5">{q.label}</h2>
          {q.hint && <p className="text-sm text-gray-500">{q.hint}</p>}
        </div>

        {/* Text input */}
        {q.type === 'text' && (
          <div className="relative mb-6">
            <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              autoFocus
              type="text"
              value={answers[q.id] || ''}
              onChange={e => updateAnswer(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && canAdvance() && next()}
              placeholder={q.placeholder}
              className="w-full bg-white border-2 border-gray-200 focus:border-[#1A3CFF] rounded-2xl pl-12 pr-5 py-4 text-base outline-none transition-colors placeholder-gray-400"
            />
          </div>
        )}

        {/* Single choice cards */}
        {q.type === 'choice' && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            {q.options?.map(opt => {
              const selected = answers[q.id] === opt.value
              const Icon = opt.Icon
              return (
                <button
                  key={opt.value}
                  onClick={() => updateAnswer(opt.value)}
                  className={`bg-white rounded-2xl p-5 text-left border-2 transition-all ${
                    selected
                      ? 'border-[#1A3CFF] bg-blue-50/30 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                    selected ? 'bg-[#1A3CFF] text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                    <Icon size={20} />
                  </div>
                  <p className="font-semibold text-gray-900 text-sm mb-0.5">{opt.label}</p>
                  <p className="text-xs text-gray-500">{opt.desc}</p>
                </button>
              )
            })}
          </div>
        )}

        {/* Multi-select special needs (4 cards in grid) */}
        {q.type === 'multi' && q.id === 'special_needs' && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            {q.options?.map(opt => {
              const selected = (answers[q.id] || []).includes(opt.value)
              const Icon = opt.Icon
              return (
                <button
                  key={opt.value}
                  onClick={() => toggleMulti(opt.value)}
                  className={`bg-white rounded-2xl p-5 text-left border-2 transition-all relative ${
                    selected
                      ? 'border-[#1A3CFF] bg-blue-50/30 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {selected && (
                    <div className="absolute top-3 right-3 w-5 h-5 bg-[#1A3CFF] rounded-full flex items-center justify-center">
                      <CheckCircle2 size={14} className="text-white" />
                    </div>
                  )}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                    selected ? 'bg-[#1A3CFF] text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                    <Icon size={20} />
                  </div>
                  <p className="font-semibold text-gray-900 text-sm mb-0.5">{opt.label}</p>
                  <p className="text-xs text-gray-500">{opt.desc}</p>
                </button>
              )
            })}
          </div>
        )}

        {/* Multi-select days (compact pills) */}
        {q.type === 'multi' && q.id === 'available_days' && (
          <div className="grid grid-cols-2 gap-2.5 mb-6">
            {q.options?.map(opt => {
              const selected = (answers[q.id] || []).includes(opt.value)
              return (
                <button
                  key={opt.value}
                  onClick={() => toggleMulti(opt.value)}
                  className={`bg-white rounded-xl p-4 text-left border-2 transition-all flex items-center justify-between ${
                    selected
                      ? 'border-[#1A3CFF] bg-blue-50/30'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className={`font-semibold text-sm ${selected ? 'text-[#1A3CFF]' : 'text-gray-900'}`}>
                    {opt.label}
                  </span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selected ? 'bg-[#1A3CFF] border-[#1A3CFF]' : 'border-gray-300'
                  }`}>
                    {selected && <CheckCircle2 size={12} className="text-white" />}
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {/* Range slider */}
        {q.type === 'range' && (
          <div className="bg-white rounded-2xl p-6 mb-6 border-2 border-gray-200">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-50 rounded-2xl mb-3">
                <DollarSign size={24} className="text-[#1A3CFF]" />
              </div>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-5xl font-bold text-[#1A3CFF]">${answers[q.id] || 80}</span>
                <span className="text-gray-500 text-sm">/hr</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Maximum hourly rate</p>
            </div>
            <input
              type="range"
              min={q.min} max={q.max} step={5}
              value={answers[q.id] || 80}
              onChange={e => updateAnswer(parseInt(e.target.value))}
              className="w-full accent-[#1A3CFF]"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>${q.min}</span>
              <span>${q.max}+</span>
            </div>
          </div>
        )}

        {/* Continue button */}
        <button
          onClick={next}
          disabled={!canAdvance()}
          className="w-full bg-[#1A3CFF] text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {step === QUESTIONS.length - 1 ? (
            <><Sparkles size={16} /> Find My Instructor</>
          ) : (
            <>Continue <ArrowRight size={16} /></>
          )}
        </button>

      </main>
      <BottomNav />
    </div>
  )
}
