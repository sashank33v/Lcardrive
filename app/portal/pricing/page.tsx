'use client'
import { useEffect, useState } from 'react'
import { Save, Loader2 } from 'lucide-react'

export default function PortalPricingPage() {
  const [form, setForm]       = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)

  useEffect(() => {
    fetch('/api/portal').then(r => r.json())
      .then(d => { if (d.instructor) setForm(d.instructor); setLoading(false) })
  }, [])

  const update = (field: string, value: any) => setForm((p: any) => ({ ...p, [field]: value }))

  const save = async () => {
    setSaving(true)
    await fetch('/api/portal', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hourly_rate:          form.hourly_rate,
        lesson_duration_mins: form.lesson_duration_mins,
        package_options:      form.package_options,
      })
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1A3CFF] bg-white"
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5"

  if (loading) return <div className="animate-pulse h-64 bg-gray-200 rounded-2xl" />

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Pricing</h1>
        <button onClick={save} disabled={saving} className="flex items-center gap-2 bg-[#1A3CFF] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {saved ? 'Saved!' : 'Save'}
        </button>
      </div>

      <div className="bg-white rounded-2xl p-5 space-y-4">
        <h2 className="font-bold text-gray-900">Lesson Rates</h2>

        <div>
          <label className={labelClass}>Hourly Rate (AUD)</label>
          <div className="relative">
            <span className="absolute left-4 top-3 text-gray-500 text-sm">$</span>
            <input type="number" className={`${inputClass} pl-8`} value={form.hourly_rate || ''} onChange={e => update('hourly_rate', parseFloat(e.target.value))} placeholder="70" />
          </div>
        </div>

        <div>
          <label className={labelClass}>Lesson Duration</label>
          <div className="flex gap-2">
            {[60, 90].map(d => (
              <button key={d} onClick={() => update('lesson_duration_mins', d)} className={`flex-1 py-3 rounded-xl text-sm font-medium border-2 transition-colors ${form.lesson_duration_mins === d ? 'bg-[#1A3CFF] text-white border-[#1A3CFF]' : 'bg-white text-gray-700 border-gray-200'}`}>
                {d} minutes
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 space-y-4">
        <h2 className="font-bold text-gray-900">Package Options</h2>
        <p className="text-sm text-gray-500">Offer discounted packages to attract more learners.</p>

        {[
          { label: '5-Hour Pack', key: 'pack5', hours: 5 },
          { label: '10-Hour Pack', key: 'pack10', hours: 10 },
        ].map(({ label, key, hours }) => {
          const packages = form.package_options || []
          const pkg = packages.find((p: any) => p.key === key) || {}
          const idx = packages.findIndex((p: any) => p.key === key)

          const updatePkg = (price: string) => {
            const updated = [...packages]
            const newPkg = { key, label, hours, price: parseFloat(price) || 0 }
            if (idx >= 0) updated[idx] = newPkg
            else updated.push(newPkg)
            update('package_options', updated)
          }

          return (
            <div key={key}>
              <label className={labelClass}>{label} price ($)</label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-gray-500 text-sm">$</span>
                <input type="number" className={`${inputClass} pl-8`} value={pkg.price || ''} onChange={e => updatePkg(e.target.value)} placeholder={`e.g. ${(form.hourly_rate || 70) * hours * 0.9}`} />
              </div>
              {form.hourly_rate && (
                <p className="text-xs text-gray-400 mt-1">
                  Full price: ${(form.hourly_rate * hours).toFixed(0)} · Suggested 10% off: ${(form.hourly_rate * hours * 0.9).toFixed(0)}
                </p>
              )}
            </div>
          )
        })}
      </div>

      <button onClick={save} disabled={saving} className="w-full bg-[#1A3CFF] text-white font-semibold py-4 rounded-2xl hover:bg-blue-700 disabled:opacity-50">
        {saved ? '✅ Pricing Saved!' : saving ? 'Saving...' : 'Save Pricing'}
      </button>
    </div>
  )
}
