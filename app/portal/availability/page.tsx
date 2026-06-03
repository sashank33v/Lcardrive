'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save, Calendar, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

const DAYS = [
  { key: 'mon', label: 'Monday'    },
  { key: 'tue', label: 'Tuesday'   },
  { key: 'wed', label: 'Wednesday' },
  { key: 'thu', label: 'Thursday'  },
  { key: 'fri', label: 'Friday'    },
  { key: 'sat', label: 'Saturday'  },
  { key: 'sun', label: 'Sunday'    },
]

const SLOTS = [
  { key: 'morning',   label: 'Morning',   desc: '6am – 12pm' },
  { key: 'afternoon', label: 'Afternoon', desc: '12pm – 5pm' },
  { key: 'evening',   label: 'Evening',   desc: '5pm – 9pm'  },
]

export default function AvailabilityPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [days,    setDays]    = useState<string[]>([])
  const [slots,   setSlots]   = useState<string[]>([])

  useEffect(() => {
    fetch('/api/portal')
      .then(r => r.json())
      .then(d => {
        if (d.instructor) {
          setDays(d.instructor.availability_days   || [])
          setSlots(d.instructor.availability_slots || [])
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const toggleDay  = (key: string) =>
    setDays(p  => p.includes(key) ? p.filter(d => d !== key) : [...p, key])

  const toggleSlot = (key: string) =>
    setSlots(p => p.includes(key) ? p.filter(s => s !== key) : [...p, key])

  const save = async () => {
    if (saving) return
    if (days.length  === 0) { toast.error('Please select at least one day');       return }
    if (slots.length === 0) { toast.error('Please select at least one time slot'); return }

    setSaving(true)
    try {
      const res  = await fetch('/api/portal', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          availability_days:  days,
          availability_slots: slots,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Failed to save')
        return
      }

      toast.success('Availability saved!')
      setTimeout(() => router.push('/portal'), 1200)

    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={28} className="text-[#1A3CFF] animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-5 pb-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Availability</h1>
          <p className="text-gray-500 text-sm mt-0.5">Set the days and times you're available for lessons</p>
        </div>
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 bg-[#1A3CFF] text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      {/* Days */}
      <div className="bg-white rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
            <Calendar size={16} className="text-[#1A3CFF]" />
          </div>
          <div>
            <p className="font-bold text-gray-900">Available Days</p>
            <p className="text-xs text-gray-500">Select all days you can teach</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {DAYS.map(({ key, label }) => {
            const active = days.includes(key)
            return (
              <button key={key} onClick={() => toggleDay(key)}
                className={`py-3 px-4 rounded-xl text-sm font-semibold border-2 transition-all ${
                  active
                    ? 'border-[#1A3CFF] bg-blue-50 text-[#1A3CFF]'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>
        {days.length === 0 && (
          <p className="text-xs text-amber-600 mt-3">⚠️ Please select at least one day</p>
        )}
      </div>

      {/* Slots */}
      <div className="bg-white rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
            <Clock size={16} className="text-[#1A3CFF]" />
          </div>
          <div>
            <p className="font-bold text-gray-900">Time Slots</p>
            <p className="text-xs text-gray-500">When during the day are you available?</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SLOTS.map(({ key, label, desc }) => {
            const active = slots.includes(key)
            return (
              <button key={key} onClick={() => toggleSlot(key)}
                className={`py-4 px-4 rounded-xl border-2 text-left transition-all ${
                  active ? 'border-[#1A3CFF] bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <p className={`font-semibold text-sm ${active ? 'text-[#1A3CFF]' : 'text-gray-800'}`}>{label}</p>
                <p className={`text-xs mt-0.5 ${active ? 'text-blue-500' : 'text-gray-400'}`}>{desc}</p>
              </button>
            )
          })}
        </div>
        {slots.length === 0 && (
          <p className="text-xs text-amber-600 mt-3">⚠️ Please select at least one time slot</p>
        )}
      </div>

      {/* Summary */}
      {days.length > 0 && slots.length > 0 && (
        <div className="bg-[#F0F2FF] border border-blue-100 rounded-2xl p-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">Your availability summary</p>
          <p className="text-xs text-gray-600 mb-1">
            <strong>Days:</strong> {days.map(d => DAYS.find(x => x.key === d)?.label).join(', ')}
          </p>
          <p className="text-xs text-gray-600">
            <strong>Times:</strong> {slots.map(s => SLOTS.find(x => x.key === s)?.label).join(', ')}
          </p>
        </div>
      )}

      {/* Bottom save */}
      <button onClick={save} disabled={saving || days.length === 0 || slots.length === 0}
        className="w-full flex items-center justify-center gap-2 bg-[#1A3CFF] text-white font-semibold py-3.5 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
        {saving ? 'Saving...' : 'Save Availability'}
      </button>
    </div>
  )
}
