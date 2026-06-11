'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Settings2, Car, Brain } from 'lucide-react'
import Link from 'next/link'
import { SuburbAutocomplete } from '@/components/search/suburb-autocomplete'

export function HomeSearchCard() {
  const [suburb, setSuburb] = useState('')
  const router = useRouter()

  const handleSearch = () => {
    if (suburb.trim()) {
      router.push(`/search?suburb=${encodeURIComponent(suburb.trim())}`)
    } else {
      router.push('/search')
    }
  }

  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">

      {/* Suburb autocomplete */}
      <div className="mb-3">
        <SuburbAutocomplete
          value={suburb}
          onChange={setSuburb}
          onSelect={s => {
            setSuburb(s.suburb)
            router.push(`/search?suburb=${encodeURIComponent(s.suburb)}`)
          }}
          placeholder="Suburb or Postcode"
        />
      </div>

      {/* Search button — lime yellow with dark text */}
      <button
        onClick={handleSearch}
        className="w-full bg-[#FACC15] text-gray-900 font-semibold py-3.5 rounded-xl hover:bg-yellow-400 active:bg-yellow-500 transition-colors"
      >
        Search Instructors
      </button>

      {/* Quick filter chips */}
      <div className="flex gap-2 flex-wrap mt-3">
        {[
          { label: 'Auto',             icon: Settings2, filter: 'auto'             },
          { label: 'Manual',           icon: Car,       filter: 'manual'           },
          { label: 'Anxiety-friendly', icon: Brain,     filter: 'anxiety-friendly' },
        ].map(({ label, icon: Icon, filter }) => (
          <Link
            key={label}
            href={`/search?transmission=${filter === 'anxiety-friendly' ? '' : filter}${filter === 'anxiety-friendly' ? '&anxiety=true' : ''}`}
            className="flex items-center gap-1.5 px-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm font-medium text-gray-700 whitespace-nowrap hover:border-[#FACC15] hover:bg-yellow-50 hover:text-gray-900 transition-colors"
          >
            <Icon size={14} />
            {label}
          </Link>
        ))}
      </div>
    </div>
  )
}
