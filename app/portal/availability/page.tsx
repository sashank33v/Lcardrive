'use client'
import { useEffect, useState } from 'react'
import { Save, Loader2, Clock, Sun, Sunset, Moon } from 'lucide-react'

const DAYS = [
  { key: 'mon', label: 'Monday'    },
  { key: 'tue', label: 'Tuesday'   },
  { key: 'wed', label: 'Wednesday' },
  { key: 'thu', label: 'Thursday'  },
  { key: 'fri', label: 'Friday'    },
  { key: 'sat', label: 'Saturday'  },
  { key: 'sun', label: 'Sunday'    },
]

const TIME_SLOTS = [
  { key: 'morning',   label: 'Morning',   desc: '6am – 12pm',  Icon: Sun     },
  { key: 'afternoon', label: 'Afternoon', desc: '12pm – 5pm',  Icon: Sunset  },
  { key: 'evening',   label: 'Evening',   desc: '5pm – 9pm',   Icon: Moon    },
]

export default function AvailabilityPage() {
  const [days,      setDays]      = useState<string[]>([])
  const [slots,     setSlots]     = useState<string[]>([])
  const [notice,    setNotice]    = useState(24)
  const [loading,   setLoading]   = useState(true)
  const [saving,    setSaving]    = useState(false)
  const [saved,     setSaved]     = useState(false)

  useEffect(() => {
    fetch('/api/portal')
      .then(r => r.json())
      .then(d => {
        if (d.instructor) {
          setDays(d.instructor.availability_days  || [])
          setSlots(d.instructor.availability_slots || [])
          setNotice(d.instructor.notice_hours      || 24)
        }
        setLoading(false)
      })
  }, [])

  const toggleDay = (key: string) =>
    setDays(p => p.includes(key) ? p.filter(d => d !== key) : [...p, key])

  const toggleSlot = (key: string) =>
    setSlots(p => p.includes(key) ? p.filter(s => s !== key) : [...p, key])

  const selectAll  = () => setDays(DAYS.map(d => d.key))
  const clearAll   = () => setDays([])
  const selectWeekdays = () => setDays(['mon','tue','wed','thu','fri'])
  const selectWeekends = () => setDays(['sat','sun'])

  const save = async () => {
    setSaving(true)
    try {
      await fetch('/api/portal', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          availability_days:  days,
          availability_slots: slots,
          notice_hours:       notice,
        })
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="max-w-2xl mx-auto space-y-4 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-48" />
      <div className="h-48 bg-gray-200 rounded-2xl" />
      <div className="h-32 bg-gray-200 rounded-2xl" />
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Availability</h1>
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 bg-[#1A3CFF] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {saved ? '✅ Saved!' : saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      {/* Available Days */}
      <div className="bg-white rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900">Available Days</h2>
          <div className="flex gap-2">
            <button onClick={selectWeekdays} className="text-xs text-[#1A3CFF] hover:underline">Weekdays</button>
            <span className="text-gray-300">·</span>
            <button onClick={selectWeekends} className="text-xs text-[#1A3CFF] hover:underline">Weekends</button>
            <span className="text-gray-300">·</span>
            <button onClick={selectAll}      className="text-xs text-[#1A3CFF] hover:underline">All</button>
            <span className="text-gray-300">·</span>
            <button onClick={clearAll}       className="text-xs text-gray-400 hover:underline">Clear</button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {DAYS.map(({ key, label }) => {
            const active = days.includes(key)
            return (
              <button
                key={key}
                onClick={() => toggleDay(key)}
                className={`flex items-center justify-between rounded-xl px-4 py-3 border-2 transition-all ${
                  active
                    ? 'bg-blue-50 border-[#1A3CFF] text-[#1A3CFF]'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="font-medium text-sm">{label}</span>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  active ? 'bg-[#1A3CFF] border-[#1A3CFF]' : 'border-gray-300'
                }`}>
                  {active && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Time Slots */}
      <div className="bg-white rounded-2xl p-5">
        <h2 className="font-bold text-gray-900 mb-4">Preferred Time Slots</h2>
        <p className="text-sm text-gray-500 mb-4">Let learners know when you typically teach</p>
        <div className="grid grid-cols-3 gap-3">
          {TIME_SLOTS.map(({ key, label, desc, Icon }) => {
            const active = slots.includes(key)
            return (
              <button
                key={key}
                onClick={() => toggleSlot(key)}
                className={`rounded-2xl p-4 border-2 transition-all text-center ${
                  active
                    ? 'bg-blue-50 border-[#1A3CFF]'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 transition-colors ${
                  active ? 'bg-[#1A3CFF] text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  <Icon size={20} />
                </div>
                <p className={`font-semibold text-sm ${active ? 'text-[#1A3CFF]' : 'text-gray-900'}`}>{label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Notice Period */}
      <div className="bg-white rounded-2xl p-5">
        <h2 className="font-bold text-gray-900 mb-2">Booking Notice</h2>
        <p className="text-sm text-gray-500 mb-4">Minimum notice you need before a lesson</p>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <Clock size={22} className="text-[#1A3CFF]" />
          </div>
          <div className="flex-1">
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-3xl font-bold text-[#1A3CFF]">{notice}</span>
              <span className="text-gray-500 text-sm">hours</span>
            </div>
            <input
              type="range" min={1} max={72} step={1}
              value={notice}
              onChange={e => setNotice(parseInt(e.target.value))}
              className="w-full accent-[#1A3CFF]"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>1 hr</span><span>72 hrs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary card */}
      {days.length > 0 && (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
          <p className="text-sm text-blue-800 font-semibold mb-1">Your availability summary</p>
          <p className="text-sm text-blue-700">
            Available {days.length === 7 ? 'every day' : days.join(', ').toUpperCase()}
            {slots.length > 0 && ` · ${slots.join(', ')} sessions`}
            {' '}· {notice}h notice required
          </p>
        </div>
      )}

      <button
        onClick={save}
        disabled={saving}
        className="w-full bg-[#1A3CFF] text-white font-semibold py-4 rounded-2xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {saved ? '✅ Availability Saved!' : saving ? 'Saving...' : 'Save Availability'}
      </button>

    </div>
  )
}
