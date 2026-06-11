'use client'
import { useEffect, useState } from 'react'
import { Save, X, Loader2, Plus } from 'lucide-react'
import melbourneSuburbs from '@/data/melbourne-suburbs.json'
import testCentres from '@/data/vicroads-test-centres.json'

export default function ServiceAreasPage() {
  const [form, setForm]             = useState<any>({})
  const [loading, setLoading]       = useState(true)
  const [saving, setSaving]         = useState(false)
  const [saved, setSaved]           = useState(false)
  const [suburbInput, setSuburbInput] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])

  useEffect(() => {
    fetch('/api/portal').then(r => r.json())
      .then(d => { if (d.instructor) setForm(d.instructor); setLoading(false) })
  }, [])

  const handleSuburbInput = (val: string) => {
    setSuburbInput(val)
    if (val.length < 2) { setSuggestions([]); return }
    const matches = (melbourneSuburbs as any[])
      .filter(s => s.suburb.toLowerCase().includes(val.toLowerCase()))
      .slice(0, 6).map(s => s.suburb)
    setSuggestions(matches)
  }

  const addSuburb = (suburb: string) => {
    const current = form.service_suburbs || []
    if (!current.includes(suburb)) {
      setForm((p: any) => ({ ...p, service_suburbs: [...current, suburb] }))
    }
    setSuburbInput('')
    setSuggestions([])
  }

  const removeSuburb = (suburb: string) =>
    setForm((p: any) => ({ ...p, service_suburbs: (p.service_suburbs || []).filter((s: string) => s !== suburb) }))

  const toggleTestCentre = (id: string) => {
    const current = form.familiar_test_centres || []
    setForm((p: any) => ({
      ...p,
      familiar_test_centres: current.includes(id)
        ? current.filter((c: string) => c !== id)
        : [...current, id],
    }))
  }

  const save = async () => {
    setSaving(true)
    await fetch('/api/portal', {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        service_suburbs:       form.service_suburbs,
        familiar_test_centres: form.familiar_test_centres,
        service_radius_km:     form.service_radius_km,
      }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (loading) return <div className="animate-pulse h-64 bg-gray-100 rounded-2xl" />

  return (
    <div className="max-w-2xl mx-auto space-y-5">

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Service Areas</h1>
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 bg-[#FACC15] text-gray-900 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-yellow-400 disabled:opacity-50 transition-colors"
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {saved ? 'Saved!' : 'Save'}
        </button>
      </div>

      {/* Suburbs */}
      <div className="bg-white rounded-2xl p-5 space-y-4 border border-gray-100">
        <h2 className="font-bold text-gray-900">Suburbs You Serve</h2>
        <p className="text-sm text-gray-500">Add all suburbs where you offer lessons.</p>
        <div className="relative">
          <input
            type="text" value={suburbInput} onChange={e => handleSuburbInput(e.target.value)}
            placeholder="Type a suburb name..."
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#FACC15]"
          />
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-10 mt-1">
              {suggestions.map(s => (
                <button key={s} onClick={() => addSuburb(s)}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-yellow-50 flex items-center gap-2"
                >
                  <Plus size={14} className="text-[#FACC15]" /> {s}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {(form.service_suburbs || []).map((s: string) => (
            <span key={s} className="flex items-center gap-1.5 bg-yellow-50 text-yellow-700 border border-yellow-100 px-3 py-1.5 rounded-full text-sm font-medium">
              {s}
              <button onClick={() => removeSuburb(s)}><X size={13} /></button>
            </span>
          ))}
          {(form.service_suburbs || []).length === 0 && (
            <p className="text-sm text-gray-400 italic">No suburbs added yet</p>
          )}
        </div>
      </div>

      {/* Test Centres */}
      <div className="bg-white rounded-2xl p-5 space-y-3 border border-gray-100">
        <h2 className="font-bold text-gray-900">VicRoads Test Centres I Know</h2>
        <p className="text-sm text-gray-500">Tick the test centres you know well. This helps learners find you.</p>
        <div className="grid grid-cols-2 gap-2">
          {(testCentres as any[]).map(tc => {
            const active = (form.familiar_test_centres || []).includes(tc.id)
            return (
              <button key={tc.id} onClick={() => toggleTestCentre(tc.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border-2 text-left transition-colors ${
                  active
                    ? 'bg-[#FACC15] text-gray-900 border-[#FACC15]'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-yellow-300'
                }`}
              >
                {active ? '✓' : '○'} {tc.name}
              </button>
            )
          })}
        </div>
      </div>

      <button onClick={save} disabled={saving}
        className="w-full bg-[#FACC15] text-gray-900 font-semibold py-4 rounded-2xl hover:bg-yellow-400 disabled:opacity-50 transition-colors"
      >
        {saved ? '✅ Saved!' : 'Save Service Areas'}
      </button>

    </div>
  )
}
