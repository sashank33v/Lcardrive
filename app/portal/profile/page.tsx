'use client'
import { useEffect, useState } from 'react'
import { Save, Sparkles, Loader2 } from 'lucide-react'
import { PhotoUpload } from '@/components/instructor/photo-upload'

export default function PortalProfilePage() {
  const [form, setForm]       = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [bioLoading, setBioLoading] = useState(false)

  useEffect(() => {
    fetch('/api/portal')
      .then(r => r.json())
      .then(d => { if (d.instructor) setForm(d.instructor); setLoading(false) })
  }, [])

  const update = (field: string, value: any) => setForm((p: any) => ({ ...p, [field]: value }))

  const save = async () => {
    setSaving(true)
    await fetch('/api/portal', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const generateBio = async () => {
    setBioLoading(true)
    try {
      const res = await fetch('/api/ai/bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          years_experience: form.years_experience || 1,
          licence_types:    form.licence_types || ['car'],
          teaching_style:   'patient, calm, encouraging',
          learner_types:    'nervous beginners and experienced learners',
          proud_of:         'high pass rate and student confidence',
          specialisations:  form.specialises_anxiety ? 'anxiety-friendly' : '',
        })
      })
      const data = await res.json()
      if (data.bio) update('bio', data.bio)
    } catch (err) {
      console.error(err)
    } finally {
      setBioLoading(false)
    }
  }

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-8 bg-gray-200 rounded w-48" /><div className="h-64 bg-gray-200 rounded-2xl" /></div>

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1A3CFF] bg-white transition-colors"
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5"

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 bg-[#1A3CFF] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {saved ? 'Saved!' : saving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>

{/* Personal info */}
      <div className="bg-white rounded-2xl p-5 space-y-4">
        <h2 className="font-bold text-gray-900">Personal Information</h2>
        <PhotoUpload
          currentPhoto={form.profile_photo_url}
          onUploaded={url => update('profile_photo_url', url)}
        />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>First Name</label>
            <input className={inputClass} value={form.first_name || ''} onChange={e => update('first_name', e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Last Name</label>
            <input className={inputClass} value={form.last_name || ''} onChange={e => update('last_name', e.target.value)} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Phone</label>
          <input className={inputClass} value={form.phone || ''} onChange={e => update('phone', e.target.value)} placeholder="04XX XXX XXX" />
        </div>
        <div>
          <label className={labelClass}>Email</label>
          <input className={inputClass} value={form.email || ''} onChange={e => update('email', e.target.value)} placeholder="you@email.com" />
        </div>
        <div>
          <label className={labelClass}>Years Experience</label>
          <input type="number" className={inputClass} value={form.years_experience || ''} onChange={e => update('years_experience', parseInt(e.target.value))} min={0} max={50} />
        </div>
      </div>

      {/* Bio */}
      <div className="bg-white rounded-2xl p-5 space-y-3" id="bio">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-gray-900">Bio</h2>
          <button
            onClick={generateBio}
            disabled={bioLoading}
            className="flex items-center gap-1.5 text-xs bg-purple-50 text-purple-700 border border-purple-200 px-3 py-1.5 rounded-xl font-medium hover:bg-purple-100 transition-colors disabled:opacity-50"
          >
            {bioLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
            {bioLoading ? 'Generating...' : '✨ Generate with AI'}
          </button>
        </div>
        <textarea
          className={`${inputClass} resize-none`}
          rows={5}
          value={form.bio || ''}
          onChange={e => update('bio', e.target.value)}
          placeholder="Tell learners about yourself, your teaching style, and why they should choose you..."
          maxLength={500}
        />
        <p className="text-xs text-gray-400 text-right">{(form.bio || '').length}/500</p>
      </div>

      {/* Teaching */}
      <div className="bg-white rounded-2xl p-5 space-y-4">
        <h2 className="font-bold text-gray-900">Teaching Details</h2>

        <div>
          <label className={labelClass}>Transmission</label>
          <div className="flex gap-2">
            {['auto', 'manual', 'both'].map(t => (
              <button
                key={t}
                onClick={() => update('transmission', t)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border capitalize transition-colors ${
                  form.transmission === t ? 'bg-[#1A3CFF] text-white border-[#1A3CFF]' : 'bg-white text-gray-700 border-gray-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className={labelClass}>Hourly Rate ($AUD)</label>
          <input type="number" className={inputClass} value={form.hourly_rate || ''} onChange={e => update('hourly_rate', parseFloat(e.target.value))} placeholder="75" />
        </div>

        <div className="space-y-3">
          <label className={labelClass}>Specialisations</label>
          {[
            { key: 'specialises_anxiety', label: 'Anxiety-friendly instructor' },
            { key: 'accepts_international', label: 'International licence conversion' },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm text-gray-700">{label}</span>
              <button
                onClick={() => update(key, !form[key])}
                className={`w-11 h-6 rounded-full transition-colors relative ${form[key] ? 'bg-[#1A3CFF]' : 'bg-gray-200'}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${form[key] ? 'left-5' : 'left-0.5'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Vehicle */}
      <div className="bg-white rounded-2xl p-5 space-y-4">
        <h2 className="font-bold text-gray-900">Vehicle</h2>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className={labelClass}>Make</label>
            <input className={inputClass} value={form.vehicle_make || ''} onChange={e => update('vehicle_make', e.target.value)} placeholder="Toyota" />
          </div>
          <div>
            <label className={labelClass}>Model</label>
            <input className={inputClass} value={form.vehicle_model || ''} onChange={e => update('vehicle_model', e.target.value)} placeholder="Corolla" />
          </div>
          <div>
            <label className={labelClass}>Year</label>
            <input type="number" className={inputClass} value={form.vehicle_year || ''} onChange={e => update('vehicle_year', parseInt(e.target.value))} placeholder="2022" />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700">Dual controls</span>
          <button
            onClick={() => update('dual_controls', !form.dual_controls)}
            className={`w-11 h-6 rounded-full transition-colors relative ${form.dual_controls ? 'bg-[#1A3CFF]' : 'bg-gray-200'}`}
          >
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${form.dual_controls ? 'left-5' : 'left-0.5'}`} />
          </button>
        </div>
      </div>

      {/* Availability */}
      <div className="bg-white rounded-2xl p-5 space-y-3">
        <h2 className="font-bold text-gray-900">Available Days</h2>
        <div className="flex flex-wrap gap-2">
          {['mon','tue','wed','thu','fri','sat','sun'].map(day => {
            const active = (form.availability_days || []).includes(day)
            return (
              <button
                key={day}
                onClick={() => {
                  const days = form.availability_days || []
                  update('availability_days', active ? days.filter((d: string) => d !== day) : [...days, day])
                }}
                className={`px-4 py-2 rounded-xl text-sm font-medium capitalize border transition-colors ${
                  active ? 'bg-[#1A3CFF] text-white border-[#1A3CFF]' : 'bg-white text-gray-600 border-gray-200'
                }`}
              >
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </button>
            )
          })}
        </div>
      </div>

      {/* Save button bottom */}
      <button
        onClick={save}
        disabled={saving}
        className="w-full bg-[#1A3CFF] text-white font-semibold py-4 rounded-2xl hover:bg-blue-700 disabled:opacity-50 transition-colors text-base"
      >
        {saved ? '✅ Profile Saved!' : saving ? 'Saving...' : 'Save Profile'}
      </button>
    </div>
  )
}
