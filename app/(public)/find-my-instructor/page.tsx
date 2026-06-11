'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Car, Sparkles, Brain, ChevronRight, ChevronLeft, Loader2, CheckCircle } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { BottomNav } from '@/components/layout/bottom-nav'
import { InstructorCard } from '@/components/instructor/instructor-card'
import { SuburbAutocomplete } from '@/components/search/suburb-autocomplete'
import toast from 'react-hot-toast'

const STEPS = [
  { id: 1, label: 'Transmission' },
  { id: 2, label: 'Experience'   },
  { id: 3, label: 'Preferences'  },
  { id: 4, label: 'Location'     },
  { id: 5, label: 'Budget'       },
]

const Q1 = [
  { value: 'auto',   icon: Car,    title: 'Automatic',  desc: 'Easier to learn, no gear changes to worry about'   },
  { value: 'manual', icon: Car,    title: 'Manual',     desc: 'Traditional gear shifting, full control'            },
  { value: 'both',   icon: Car,    title: 'Either',     desc: "Open to both, happy to follow instructor's advice"  },
]
const Q2 = [
  { value: 'complete_beginner', icon: Sparkles,    title: 'Complete beginner', desc: 'Never driven before'                       },
  { value: 'some_experience',   icon: Sparkles,    title: 'Some experience',   desc: 'Had a few lessons or practised with family' },
  { value: 'test_ready',        icon: CheckCircle, title: 'Test ready',        desc: 'Need a few top-up lessons before the test'  },
]
const Q3 = [
  { value: 'patient_calm',  icon: Brain, title: 'Calm & patient',    desc: 'I get anxious and need a supportive instructor' },
  { value: 'goal_oriented', icon: Brain, title: 'Goal-oriented',     desc: 'I want to pass as efficiently as possible'      },
  { value: 'technique',     icon: Brain, title: 'Technique-focused', desc: 'I want to understand the mechanics properly'    },
  { value: 'no_preference', icon: Brain, title: 'No preference',     desc: 'Any good instructor works for me'               },
]

export default function FindMyInstructor() {
  const router = useRouter()
  const [step,    setStep]    = useState(1)
  const [trans,   setTrans]   = useState('')
  const [exp,     setExp]     = useState('')
  const [pref,    setPref]    = useState('')
  const [suburb,  setSuburb]  = useState('')
  const [budget,  setBudget]  = useState(100)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any[] | null>(null)

  const progress = (step / STEPS.length) * 100
  const canNext  = () => {
    if (step === 1) return !!trans
    if (step === 2) return !!exp
    if (step === 3) return !!pref
    if (step === 4) return !!suburb.trim()
    return true
  }

  const next = () => setStep(s => Math.min(s + 1, STEPS.length))
  const back = () => step > 1 ? setStep(s => s - 1) : router.push('/')

  const submit = async () => {
    setLoading(true)
    try {
      const res  = await fetch('/api/ai/match', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ transmission: trans, experience: exp, preference: pref, suburb, budget }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'No matches found'); return }
      setResults(data.instructors || [])
      setStep(6)
    } catch { toast.error('Something went wrong. Please try again.') }
    finally   { setLoading(false) }
  }

  function OptionCard({ value, icon: Icon, title, desc, selected, onSelect }: any) {
    const isSelected = selected === value
    return (
      <button
        onClick={() => onSelect(value)}
        className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
          isSelected
            ? 'border-[#FACC15] bg-yellow-50'
            : 'border-gray-200 bg-white hover:border-gray-300'
        }`}
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
          isSelected ? 'bg-[#FACC15]' : 'bg-gray-100'
        }`}>
          <Icon size={18} className={isSelected ? 'text-gray-900' : 'text-gray-500'} />
        </div>
        <p className={`font-semibold text-sm mb-0.5 ${isSelected ? 'text-gray-900' : 'text-gray-900'}`}>
          {title}
        </p>
        <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
      </button>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      {step < 6 && (
        <div className="max-w-3xl mx-auto w-full px-4 pt-6 pb-24">

          {/* Progress header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#FACC15] rounded-xl flex items-center justify-center">
                  <Sparkles size={15} className="text-gray-900" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">AI Match Wizard</p>
                  <p className="text-sm font-bold text-gray-900">Step {step} of {STEPS.length}</p>
                </div>
              </div>
              <div className="flex gap-1.5">
                {STEPS.map(s => (
                  <div key={s.id} className={`h-1.5 rounded-full transition-all ${
                    s.id <= step ? 'bg-[#FACC15] w-8' : 'bg-gray-200 w-4'
                  }`} />
                ))}
              </div>
            </div>
            <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#FACC15] rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Step 1 — Transmission */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">What type of transmission?</h2>
              <p className="text-gray-500 text-sm mb-6">Choose the type of car you want to learn in.</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {Q1.map(q => <OptionCard key={q.value} {...q} selected={trans} onSelect={setTrans} />)}
              </div>
            </div>
          )}

          {/* Step 2 — Experience */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">What's your experience level?</h2>
              <p className="text-gray-500 text-sm mb-6">Be honest — it helps us match the right instructor.</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {Q2.map(q => <OptionCard key={q.value} {...q} selected={exp} onSelect={setExp} />)}
              </div>
            </div>
          )}

          {/* Step 3 — Preferences */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">What teaching style suits you?</h2>
              <p className="text-gray-500 text-sm mb-6">We'll match you with someone who fits how you learn.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Q3.map(q => <OptionCard key={q.value} {...q} selected={pref} onSelect={setPref} />)}
              </div>
            </div>
          )}

          {/* Step 4 — Suburb */}
          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">What suburb are you in?</h2>
              <p className="text-gray-500 text-sm mb-6">We'll find instructors who know your local roads.</p>
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Your suburb or postcode
                </label>
                <SuburbAutocomplete
                  value={suburb}
                  onChange={setSuburb}
                  onSelect={s => setSuburb(s.suburb)}
                  placeholder="e.g. Footscray, Sunshine, 3011..."
                />
              </div>
            </div>
          )}

          {/* Step 5 — Budget */}
          {step === 5 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">What's your budget?</h2>
              <p className="text-gray-500 text-sm mb-6">Maximum hourly rate you're comfortable with.</p>
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="text-center mb-6">
                  <span className="text-5xl font-bold text-gray-900">${budget}</span>
                  <span className="text-gray-500 text-lg">/hr</span>
                </div>
                <input
                  type="range" min={50} max={150} step={5} value={budget}
                  onChange={e => setBudget(Number(e.target.value))}
                  className="w-full accent-[#FACC15] mb-3"
                />
                <div className="flex justify-between text-xs text-gray-400 mb-5">
                  <span>$50/hr</span><span>$150/hr</span>
                </div>
                <div className="flex justify-center gap-3">
                  {[60, 80, 100, 120].map(v => (
                    <button key={v} onClick={() => setBudget(v)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        budget === v
                          ? 'bg-[#FACC15] text-gray-900'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      ${v}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <button onClick={back}
              className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft size={16} /> Back
            </button>
            {step < STEPS.length ? (
              <button onClick={next} disabled={!canNext()}
                className="flex items-center gap-2 bg-[#FACC15] text-gray-900 font-semibold px-6 py-2.5 rounded-xl hover:bg-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
              >
                Next Step <ChevronRight size={16} />
              </button>
            ) : (
              <button onClick={submit} disabled={loading || !canNext()}
                className="flex items-center gap-2 bg-[#FACC15] text-gray-900 font-semibold px-6 py-2.5 rounded-xl hover:bg-yellow-400 disabled:opacity-50 transition-all active:scale-95"
              >
                {loading
                  ? <><Loader2 size={16} className="animate-spin" /> Matching...</>
                  : <><Sparkles size={16} /> Find My Match</>
                }
              </button>
            )}
          </div>
        </div>
      )}

      {/* Results */}
      {step === 6 && results && (
        <div className="max-w-3xl mx-auto w-full px-4 py-8 pb-24">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#FACC15] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles size={28} className="text-gray-900" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Your top {results.length} match{results.length !== 1 ? 'es' : ''}
            </h2>
            <p className="text-gray-500 text-sm">
              AI-selected based on your style, suburb and budget near <strong>{suburb}</strong>
            </p>
          </div>

          {results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {results.map((i: any) => <InstructorCard key={i.id} {...i} />)}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 text-center mb-6 border border-gray-100">
              <p className="text-gray-500 mb-2">No exact matches found.</p>
              <p className="text-sm text-gray-400">Try broadening your preferences.</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => { setStep(1); setResults(null) }}
              className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 font-semibold px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Try again
            </button>
            <a href={`/search?suburb=${encodeURIComponent(suburb)}&transmission=${trans}`}
              className="flex items-center justify-center gap-2 bg-[#FACC15] text-gray-900 font-semibold px-6 py-3 rounded-xl hover:bg-yellow-400 transition-colors"
            >
              Browse all in {suburb} <ChevronRight size={16} />
            </a>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
