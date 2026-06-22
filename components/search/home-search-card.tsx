'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Settings2, Car, Brain, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { SuburbAutocomplete } from '@/components/search/suburb-autocomplete'

const RADIUS_OPTIONS = [5, 10, 20, 50]

export function HomeSearchCard() {
  const [suburb, setSuburb]   = useState('')
  const [radius, setRadius]   = useState(10)
  const [showRadius, setShowRadius] = useState(false)
  const router = useRouter()

  const handleSearch = () => {
    if (suburb.trim()) {
      router.push(`/search?suburb=${encodeURIComponent(suburb.trim())}&radius=${radius}`)
    } else {
      router.push('/search')
    }
  }

  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">

      {/* Suburb autocomplete + radius selector */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1">
          <SuburbAutocomplete
            value={suburb}
            onChange={setSuburb}
            onSelect={s => {
              setSuburb(s.suburb)
              router.push(`/search?suburb=${encodeURIComponent(s.suburb)}&radius=${radius}`)
            }}
            placeholder="Enter your suburb or postcode"
          />
        </div>

        {/* Radius selector */}
        <div className="relative flex-shrink-0">
          <button
            type="button"
            onClick={() => setShowRadius(!showRadius)}
            className="flex items-center gap-1.5 px-3 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-[#FACC15] bg-white transition-colors whitespace-nowrap"
          >
            <span className="text-xs text-gray-400 font-medium">RADIUS</span>
            <span className="text-gray-900">{radius} km</span>
            <ChevronDown size={14} className="text-gray-400" />
          </button>

          {showRadius && (
            <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden min-w-[100px]">
              {RADIUS_OPTIONS.map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => { setRadius(r); setShowRadius(false) }}
                  className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${
                    radius === r
                      ? 'bg-[#FACC15] text-gray-900'
                      : 'text-gray-700 hover:bg-yellow-50'
                  }`}
                >
                  {r} km
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Search button */}
      <button
        onClick={handleSearch}
        className="w-full bg-[#FACC15] text-gray-900 font-semibold py-3.5 rounded-xl hover:bg-yellow-400 active:bg-yellow-500 transition-colors"
      >
        Search Suburb
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
            href={`/search?transmission=${filter === 'anxiety-friendly' ? '' : filter}${filter === 'anxiety-friendly' ? '&anxiety=true' : ''}&radius=${radius}`}
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
