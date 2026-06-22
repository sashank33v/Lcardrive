'use client'
import { useState, useEffect, useRef } from 'react'
import { Search, MapPin, Loader2, X } from 'lucide-react'

interface Suggestion {
  display: string
  suburb:  string
  lat:     number
  lng:     number
}

interface Props {
  value: string
  onChange: (value: string) => void
  onSelect?: (suggestion: Suggestion) => void
  placeholder?: string
}

export function SuburbAutocomplete({ value, onChange, onSelect, placeholder = 'Suburb or postcode...' }: Props) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading]         = useState(false)
  const [open, setOpen]               = useState(false)
  const debounceRef                   = useRef<NodeJS.Timeout | null>(null)
  const wrapperRef                    = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const fetchSuggestions = async (query: string) => {
    if (query.length < 2) {
      setSuggestions([])
      return
    }
    setLoading(true)
    try {
      const key = process.env.NEXT_PUBLIC_LOCATIONIQ_KEY
      const url = `https://api.locationiq.com/v1/autocomplete?key=${key}&q=${encodeURIComponent(query)}&countrycodes=au&tag=place:suburb,place:town,place:city&limit=6`

      const res  = await fetch(url)
      const data = await res.json()

      if (Array.isArray(data)) {
        const mapped: Suggestion[] = data.map((item: any) => ({
          display: item.display_place || item.display_name,
          suburb:  item.address?.name || item.display_place || query,
          lat:     parseFloat(item.lat),
          lng:     parseFloat(item.lon),
        }))
        setSuggestions(mapped)
        setOpen(true)
      }
    } catch (err) {
      console.error('LocationIQ error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleInput = (val: string) => {
    onChange(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 300)
  }

  const handleSelect = (s: Suggestion) => {
    onChange(s.suburb)
    onSelect?.(s)
    setOpen(false)
    setSuggestions([])
  }

  return (
    <div ref={wrapperRef} className="relative">
      <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-3 border border-gray-200 focus-within:border-[#FACC15] transition-colors">
        <Search size={18} className="text-gray-400 flex-shrink-0" />
        <input
          type="text"
          value={value}
          onChange={e => handleInput(e.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder={placeholder}
          className="flex-1 outline-none text-sm text-gray-800 placeholder-gray-400 bg-transparent"
        />
        {loading && <Loader2 size={15} className="text-gray-400 animate-spin" />}
        {value && !loading && (
          <button onClick={() => { onChange(''); setSuggestions([]) }} aria-label="Clear search">
            <X size={15} className="text-gray-400" />
          </button>
        )}
      </div>

      {open && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden max-h-72 overflow-y-auto">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSelect(s)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
            >
              <MapPin size={15} className="text-[#FACC15] flex-shrink-0" aria-hidden="true" />
              <span className="text-sm text-gray-700 truncate">{s.display}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
