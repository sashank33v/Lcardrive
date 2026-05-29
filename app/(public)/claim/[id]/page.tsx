'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth, SignIn } from '@clerk/nextjs'
import { CheckCircle, Loader2 } from 'lucide-react'
import { Header } from '@/components/layout/header'

export default function ClaimPage() {
  const { id }          = useParams()
  const { isSignedIn, isLoaded } = useAuth()
  const router          = useRouter()

  const [instructor, setInstructor] = useState<any>(null)
  const [adi, setAdi]               = useState('')
  const [loading, setLoading]       = useState(false)
  const [success, setSuccess]       = useState(false)
  const [error, setError]           = useState('')

  useEffect(() => {
    fetch(`/api/instructors/${id}`)
      .then(r => r.json())
      .then(d => setInstructor(d.instructor))
  }, [id])

  const submit = async () => {
    if (!adi.trim()) { setError('Please enter your ADI registration number'); return }
    setLoading(true)
    setError('')
    try {
      const res  = await fetch('/api/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instructor_id: id, adi_registration: adi })
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Failed to submit claim'); return }
      setSuccess(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isLoaded) return <div className="min-h-screen bg-[#F0F2FF]" />

  if (success) return (
    <div className="min-h-screen bg-[#F0F2FF] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-sm">
        <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Claim submitted!</h2>
        <p className="text-gray-500 text-sm mb-6">
          We'll verify your ADI number within 24–48 hours. You'll receive an email when your profile is verified.
        </p>
        <button onClick={() => router.push('/portal')}
          className="w-full bg-[#1A3CFF] text-white font-semibold py-3 rounded-xl">
          Go to Portal
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F0F2FF]">
      <Header />
      <main className="max-w-lg mx-auto px-4 py-8">

        <div className="bg-white rounded-2xl p-6 shadow-sm mb-4">
          <h1 className="text-xl font-bold text-gray-900 mb-1">Claim this profile</h1>
          <p className="text-gray-500 text-sm mb-4">
            Verify you are this instructor to unlock your free profile.
          </p>
          {instructor && (
            <div className="bg-[#F0F2FF] rounded-xl p-4 mb-4">
              <p className="font-bold text-gray-900">{instructor.first_name} {instructor.last_name}</p>
              <p className="text-sm text-gray-500">{instructor.suburb}, VIC</p>
            </div>
          )}
        </div>

        {!isSignedIn ? (
          <div className="flex justify-center">
            <SignIn redirectUrl={`/claim/${id}`} />
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-gray-900 mb-4">Enter your ADI registration number</h2>
            <input
              type="text"
              value={adi}
              onChange={e => setAdi(e.target.value)}
              placeholder="e.g. ADI123456"
              className="w-full border-2 border-gray-200 focus:border-[#1A3CFF] rounded-xl px-4 py-3 outline-none mb-3 transition-colors"
            />
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            <p className="text-xs text-gray-400 mb-4">
              Your ADI number is on your VicRoads instructor licence. An admin will verify it within 24–48 hours.
            </p>
            <button
              onClick={submit}
              disabled={loading}
              className="w-full bg-[#1A3CFF] text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : null}
              {loading ? 'Submitting...' : 'Submit Claim'}
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
