'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { SuburbAutocomplete } from '@/components/search/suburb-autocomplete'

interface Props { defaultSuburb?: string }

export function SearchBarClient({ defaultSuburb = '' }: Props) {
  const [suburb, setSuburb] = useState(defaultSuburb)
  const router              = useRouter()

  const go = (s: string) => {
    if (s.trim()) router.push(`/search?suburb=${encodeURIComponent(s.trim())}`)
  }

  return (
    <div className="flex gap-2 items-center">
      <div className="flex-1">
        <SuburbAutocomplete
          value={suburb}
          onChange={setSuburb}
          onSelect={s => go(s.suburb)}
          placeholder="Search suburb or postcode..."
        />
      </div>
      <button
        onClick={() => go(suburb)}
        className="flex items-center gap-2 bg-[#FACC15] text-gray-900 font-semibold px-4 py-3 rounded-xl hover:bg-yellow-400 active:bg-yellow-500 transition-colors flex-shrink-0"
      >
        <Search size={16} />
        <span className="hidden sm:inline">Search</span>
      </button>
    </div>
  )
}
