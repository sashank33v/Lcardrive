'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { SignIn, useUser } from '@clerk/nextjs'
import { Loader2, ShieldCheck, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { Header } from '@/components/layout/header'
import { BottomNav } from '@/components/layout/bottom-nav'

export default function ClaimPage() {
  const params = useParams()
  const id     = params.id as string
  const { isSignedIn, isLoaded } = useUser()

  const [instructor, setInstructor] = useState<any>(null)
  const [loading,    setLoading]    = useState(true)
  const [adi,        setAdi]        = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted,  setSubmitted]  = useState(false)

  useEffect(() => {
    fetch(`/api/instructors/${id}`)
      .then(r => r.json())
      .then(d => {
        if (d.instructor) setInstructor(d.instructor)
        setLoading(false)
      })
  }, [id])

  const submit = async () => {
    if (!adi.trim()) {
      toast.error('Please enter your ADI registration number')
      return
    }
    setSubmitting(true)
    try {
      const res  = await fetch('/api/claims', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instructor_id: id, adi_registration: adi.trim() })
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Failed to submit claim')
        return
      }
      setSubmitted(true)
      toast.success('Claim submitted! We\'ll verify within 48 hours.')
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || !isLoaded) {
    return (
      <div className="min-h-screen bg-[#F0F2FF] flex items-center justify-center">
        <Loader2 size={32} className="text-[#1A3CFF] animate-spin" />
      </div>
    )
  }

  if (!instructor) {
    return (
      <div className="min-h-screen bg-[#F0F2FF]">
        <Header />
        <main className="max-w-md mx-auto px-4 py-12 text-center">
          <p className="text-gray-500">Instructor not found.</p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F0F2FF]">
      <Header />

      <main className="max-w-md mx-auto px-4 py-8 pb-24">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-50 rounded-2xl mb-4">
            <ShieldCheck size={26} className="text-[#1A3CFF]" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Claim this profile</h1>
          <p className="text-sm text-gray-500">
            Verify you're <strong>{instructor.first_name} {instructor.last_name}</strong> in {instructor.suburb}
          </p>
        </div>

        {/* Already claimed */}
        {instructor.is_claimed && !submitted && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-4 text-center">
            <p className="text-sm text-yellow-800 font-semibold">⚠️ This profile has already been claimed.</p>
            <p className="text-xs text-yellow-700 mt-1">If you believe this is an error, please contact support.</p>
          </div>
        )}

        {/* Sign in required */}
        {!isSignedIn && !instructor.is_claimed && (
          <div className="flex justify-center">
            <SignIn forceRedirectUrl={`/claim/${id}`} />
          </div>
        )}

        {/* Claim form */}
        {isSignedIn && !instructor.is_claimed && !submitted && (
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ADI Registration Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={adi}
                onChange={e => setAdi(e.target.value.toUpperCase())}
                placeholder="e.g. ADI123456"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1A3CFF] transition-colors"
              />
              <p className="text-xs text-gray-400 mt-1.5">
                Your VicRoads Accredited Driving Instructor number
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
              <p className="text-xs text-blue-800 leading-relaxed">
                <strong>Verification process:</strong> Our team will verify your ADI number against VicRoads records within <strong>24–48 hours</strong>. You'll receive an email when approved.
              </p>
            </div>

            <button
              onClick={submit}
              disabled={submitting || !adi.trim()}
              className="w-full bg-[#1A3CFF] text-white font-semibold py-3.5 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {submitting
                ? <><Loader2 size={16} className="animate-spin" /> Submitting...</>
                : 'Submit Claim'
              }
            </button>
          </div>
        )}

        {/* Submitted state */}
        {submitted && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-2xl mb-3">
              <CheckCircle size={26} className="text-green-600" />
            </div>
            <h2 className="font-bold text-green-900 text-lg mb-1">Claim submitted!</h2>
            <p className="text-sm text-green-700 mb-4">
              We've received your claim and will verify within 48 hours. Check your email for updates.
            </p>
            <a href="/portal">
              <button className="bg-[#1A3CFF] text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-blue-700 text-sm">
                Go to Portal
              </button>
            </a>
          </div>
        )}

      </main>

      <BottomNav />
    </div>
  )
}
