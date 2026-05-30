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
    <div className="bg-white rounded-2xl p-4 shadow-sm mb-5 md:shadow-md">
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

      {/* Search button */}
      <button
        onClick={handleSearch}
        className="w-full bg-[#1A3CFF] text-white font-semibold py-3.5 rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors"
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
            className="flex items-center gap-1.5 px-4 py-2 bg-[#F0F2FF] border border-gray-200 rounded-full text-sm font-medium text-gray-700 whitespace-nowrap hover:border-[#1A3CFF] hover:text-[#1A3CFF] transition-colors"
          >
            <Icon size={14} />
            {label}
          </Link>
        ))}
      </div>
    </div>
  )
}
