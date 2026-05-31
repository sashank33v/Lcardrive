'use client'
import { Suspense, useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { SlidersHorizontal, X } from 'lucide-react'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { BottomNav } from '@/components/layout/bottom-nav'
import { InstructorCard } from '@/components/instructor/instructor-card'
import { SuburbAutocomplete } from '@/components/search/suburb-autocomplete'
import { CardSkeleton } from '@/components/ui/skeletons'

function SearchContent() {
  const searchParams = useSearchParams()

  const [instructors, setInstructors] = useState<any[]>([])
  const [total,       setTotal]       = useState(0)
  const [loading,     setLoading]     = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const [suburb,       setSuburb]       = useState(searchParams.get('suburb')       || '')
  const [transmission, setTransmission] = useState(searchParams.get('transmission') || '')
  const [maxPrice,     setMaxPrice]     = useState(searchParams.get('max_price')    || '')
  const [anxiety,      setAnxiety]      = useState(searchParams.get('anxiety')      === 'true')
  const [intl,         setIntl]         = useState(searchParams.get('intl')         === 'true')
  const [sort,         setSort]         = useState(searchParams.get('sort')         || 'relevance')

  const fetchInstructors = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (suburb)       params.set('suburb',       suburb)
      if (transmission) params.set('transmission', transmission)
      if (maxPrice)     params.set('max_price',    maxPrice)
      if (anxiety)      params.set('anxiety',      'true')
      if (intl)         params.set('intl',         'true')
      params.set('sort', sort)

      const res  = await fetch(`/api/instructors/search?${params}`)
      const data = await res.json()
      const list = data.instructors || data.data || []
      setInstructors(list)
      setTotal(data.total || list.length || 0)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [suburb, transmission, maxPrice, anxiety, intl, sort])

  useEffect(() => { fetchInstructors() }, [fetchInstructors])

  const clearAll = () => {
    setSuburb('')
    setTransmission('')
    setMaxPrice('')
    setAnxiety(false)
    setIntl(false)
  }

  const activeFilters = [
    transmission && { label: transmission.charAt(0).toUpperCase() + transmission.slice(1), clear: () => setTransmission('') },
    maxPrice     && { label: `Under $${maxPrice}/hr`, clear: () => setMaxPrice('')   },
    anxiety      && { label: 'Anxiety-friendly',      clear: () => setAnxiety(false) },
    intl         && { label: 'Intl. licence',          clear: () => setIntl(false)   },
  ].filter(Boolean) as { label: string; clear: () => void }[]

  return (
    <div className="min-h-screen bg-[#F0F2FF]">
      <Header />

      {/* Sticky search bar */}
      <div className="sticky top-[57px] z-30 bg-[#F0F2FF] px-4 py-3 border-b border-gray-100">
        <div className="max-w-6xl mx-auto flex gap-2">

          <div className="flex-1">
            <SuburbAutocomplete
              value={suburb}
              onChange={setSuburb}
              onSelect={() => setTimeout(fetchInstructors, 100)}
              placeholder="Search suburb or postcode..."
            />
          </div>

          <button
            onClick={() => setShowFilters(true)}
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors flex-shrink-0 ${
              activeFilters.length > 0
                ? 'bg-[#1A3CFF] text-white border-[#1A3CFF]'
                : 'bg-white text-gray-700 border-gray-200'
            }`}
          >
            <SlidersHorizontal size={15} />
            <span className="hidden sm:inline">Filters</span>
            {activeFilters.length > 0 && (
              <span className="bg-white text-[#1A3CFF] text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {activeFilters.length}
              </span>
            )}
          </button>
        </div>

        {/* Active filter chips */}
        {activeFilters.length > 0 && (
          <div className="max-w-6xl mx-auto flex gap-2 mt-2 flex-wrap">
            {activeFilters.map(f => (
              <button
                key={f.label}
                onClick={f.clear}
                className="flex items-center gap-1 px-3 py-1 bg-[#1A3CFF] text-white text-xs rounded-full font-medium"
              >
                {f.label} <X size={11} />
              </button>
            ))}
            <button
              onClick={clearAll}
              className="text-xs text-gray-500 hover:text-gray-700 underline"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Filter bottom sheet */}
      {showFilters && (
        <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setShowFilters(false)}>
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg text-gray-900">Filters</h3>
              <button onClick={() => setShowFilters(false)}>
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Transmission */}
            <div className="mb-5">
              <p className="text-sm font-semibold text-gray-700 mb-2">Transmission</p>
              <div className="flex gap-2">
                {['auto', 'manual', 'both'].map(t => (
                  <button
                    key={t}
                    onClick={() => setTransmission(transmission === t ? '' : t)}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium border-2 capitalize transition-colors ${
                      transmission === t
                        ? 'bg-[#1A3CFF] text-white border-[#1A3CFF]'
                        : 'bg-white text-gray-700 border-gray-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Max price */}
            <div className="mb-5">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Max price: {maxPrice ? `$${maxPrice}/hr` : 'Any'}
              </p>
              <input
                type="range" min={40} max={150} step={5}
                value={maxPrice || 150}
                onChange={e => setMaxPrice(e.target.value === '150' ? '' : e.target.value)}
                className="w-full accent-[#1A3CFF]"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>$40</span><span>$150+</span>
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-3 mb-6">
              {[
                { label: 'Anxiety-friendly instructor',      val: anxiety, set: setAnxiety },
                { label: 'International licence conversion', val: intl,    set: setIntl    },
              ].map(({ label, val, set }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{label}</span>
                  <button
                    onClick={() => set(!val)}
                    className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${val ? 'bg-[#1A3CFF]' : 'bg-gray-200'}`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${val ? 'left-5' : 'left-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowFilters(false)}
              className="w-full bg-[#1A3CFF] text-white font-semibold py-3.5 rounded-xl"
            >
              Show {total} Result{total !== 1 ? 's' : ''}
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-4 pb-28">

        {/* Sort + count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">
            {loading
              ? 'Searching...'
              : `${total} instructor${total !== 1 ? 's' : ''} found${suburb ? ` near ${suburb}` : ''}`
            }
          </p>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white text-gray-700 outline-none cursor-pointer"
          >
            <option value="relevance">Relevance</option>
            <option value="price_asc">Price: Low–High</option>
            <option value="rating">Top Rated</option>
            <option value="newest">Newest</option>
          </select>
        </div>

        {/* Results grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          {loading
            ? Array(6).fill(0).map((_, i) => <CardSkeleton key={i} />)
            : instructors.map(i => <InstructorCard key={i.id} {...i} />)
          }
        </div>

        {/* Empty state */}
        {!loading && instructors.length === 0 && (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">🔍</p>
            <h3 className="font-bold text-gray-900 text-lg mb-2">No instructors found</h3>
            <p className="text-gray-500 text-sm mb-6">
              Try a different suburb or remove some filters
            </p>
            <button
              onClick={clearAll}
              className="bg-[#1A3CFF] text-white px-6 py-3 rounded-xl font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* AI Match banner */}
        {!loading && (
          <div className="bg-gradient-to-r from-blue-700 to-[#1A3CFF] rounded-2xl p-6 text-center">
            <p className="text-3xl mb-2">🤖</p>
            <h3 className="text-white font-bold text-lg mb-1">Not sure who to pick?</h3>
            <p className="text-blue-200 text-sm mb-4">
              Let our AI match you with the perfect instructor for your learning style.
            </p>
            <Link href="/find-my-instructor">
              <button className="bg-white text-[#1A3CFF] font-semibold px-6 py-2.5 rounded-xl text-sm hover:bg-blue-50 transition-colors">
                ✦ Help Me Choose
              </button>
            </Link>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F0F2FF]" />}>
      <SearchContent />
    </Suspense>
  )
}
