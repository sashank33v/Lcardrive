import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, SlidersHorizontal, Sparkles, Search as SearchIcon, ArrowRight } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { BottomNav } from '@/components/layout/bottom-nav'
import { Footer } from '@/components/layout/footer'
import { InstructorCard } from '@/components/instructor/instructor-card'
import { SearchBarClient } from '@/components/search/search-bar-client'
import { CardSkeleton } from '@/components/ui/skeletons'

export const metadata: Metadata = {
  title: 'Find a Driving Instructor | LCarDrive',
  description: 'Search verified driving instructors by suburb across Melbourne.',
}

const NEARBY = ['Footscray', 'Sunshine', 'St Kilda', 'Werribee', 'Dandenong', 'Hoppers Crossing']

async function fetchInstructors(params: {
  suburb?: string; transmission?: string; maxPrice?: number;
  anxietyFriendly?: boolean; international?: boolean
}) {
  const url = new URL(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/instructors/search`)
  if (params.suburb)          url.searchParams.set('suburb',          params.suburb)
  if (params.transmission)    url.searchParams.set('transmission',    params.transmission)
  if (params.maxPrice)        url.searchParams.set('maxPrice',        String(params.maxPrice))
  if (params.anxietyFriendly) url.searchParams.set('anxietyFriendly','1')
  if (params.international)   url.searchParams.set('international',   '1')
  try {
    const res  = await fetch(url.toString(), { cache: 'no-store' })
    const data = await res.json()
    return { instructors: data.instructors || data.data || [], total: data.total || 0 }
  } catch { return { instructors: [], total: 0 } }
}

interface PageProps {
  searchParams: Promise<{
    suburb?: string; transmission?: string; maxPrice?: string;
    anxietyFriendly?: string; international?: string
  }>
}

async function Results({ searchParams }: PageProps) {
  const sp = await searchParams
  const { instructors, total } = await fetchInstructors({
    suburb:          sp.suburb,
    transmission:    sp.transmission,
    maxPrice:        sp.maxPrice ? Number(sp.maxPrice) : undefined,
    anxietyFriendly: sp.anxietyFriendly === '1',
    international:   sp.international   === '1',
  })

  if (!sp.suburb && instructors.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 bg-yellow-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <SearchIcon size={28} className="text-[#FACC15]" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Search for instructors</h2>
        <p className="text-gray-500 text-sm mb-8">Enter a suburb or postcode above to get started</p>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Popular suburbs</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {NEARBY.map(s => (
            <Link key={s} href={`/search?suburb=${encodeURIComponent(s)}`}
              className="text-sm text-gray-700 bg-yellow-50 border border-yellow-100 px-3 py-1.5 rounded-full hover:bg-yellow-100 transition-colors"
            >
              {s}
            </Link>
          ))}
        </div>
      </div>
    )
  }

  if (instructors.length === 0) {
    return (
      <div className="py-12">
        <div className="bg-white rounded-2xl p-8 text-center mb-6 border border-gray-100">
          <div className="w-14 h-14 bg-yellow-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MapPin size={24} className="text-[#FACC15]" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No instructors found in {sp.suburb}</h2>
          <p className="text-gray-500 text-sm mb-6">Try a nearby suburb or broaden your filters.</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {NEARBY.map(s => (
              <Link key={s} href={`/search?suburb=${encodeURIComponent(s)}`}
                className="text-sm text-gray-700 bg-yellow-50 px-3 py-1.5 rounded-full hover:bg-yellow-100 transition-colors border border-yellow-100"
              >
                Try {s}
              </Link>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* AI banner */}
      <div className="bg-gray-900 rounded-2xl p-4 mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-white font-bold text-sm flex items-center gap-2">
            <Sparkles size={14} className="text-[#FACC15]" /> Smart Matching
          </p>
          <p className="text-gray-400 text-xs mt-0.5">
            Not sure who to pick? Our AI finds your top 3.
          </p>
        </div>
        <Link href="/find-my-instructor" className="flex-shrink-0">
          <button className="bg-[#FACC15] text-gray-900 text-xs font-bold px-4 py-2 rounded-xl hover:bg-yellow-400 transition-colors flex items-center gap-1">
            Help me choose <ArrowRight size={12} />
          </button>
        </Link>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        <strong className="text-gray-900">{total}</strong> instructor{total !== 1 ? 's' : ''}
        {sp.suburb ? ` near ${sp.suburb}` : ''}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {instructors.map((i: any) => <InstructorCard key={i.id} {...i} />)}
      </div>
    </div>
  )
}

export default async function SearchPage({ searchParams }: PageProps) {
  const sp = await searchParams

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      {/* Search bar */}
      <div className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-5xl mx-auto px-4">
          <SearchBarClient defaultSuburb={sp.suburb || ''} />

          {/* Active filter chips */}
          <div className="flex gap-2 flex-wrap mt-3">
            {sp.transmission && (
              <span className="text-xs bg-yellow-50 text-yellow-700 border border-yellow-100 font-semibold px-3 py-1 rounded-full capitalize">
                {sp.transmission}
              </span>
            )}
            {sp.anxietyFriendly === '1' && (
              <span className="text-xs bg-yellow-50 text-yellow-700 border border-yellow-100 font-semibold px-3 py-1 rounded-full">
                Anxiety-friendly
              </span>
            )}
            {sp.maxPrice && (
              <span className="text-xs bg-yellow-50 text-yellow-700 border border-yellow-100 font-semibold px-3 py-1 rounded-full">
                Under ${sp.maxPrice}/hr
              </span>
            )}
            {(sp.transmission || sp.anxietyFriendly || sp.maxPrice) && (
              <Link href={sp.suburb ? `/search?suburb=${sp.suburb}` : '/search'}
                className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1"
              >
                Clear filters
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-5xl mx-auto px-4 py-6 w-full pb-24">
        <div className="flex gap-6">

          {/* Desktop sidebar filters */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="bg-white rounded-2xl p-4 sticky top-20 border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <SlidersHorizontal size={15} className="text-gray-500" />
                <p className="text-sm font-bold text-gray-900">Filters</p>
              </div>
              <form method="GET" action="/search" className="space-y-5">
                {sp.suburb && <input type="hidden" name="suburb" value={sp.suburb} />}

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Transmission</p>
                  {['auto','manual','both'].map(t => (
                    <label key={t} className="flex items-center gap-2.5 py-1.5 cursor-pointer">
                      <input type="radio" name="transmission" value={t}
                        defaultChecked={sp.transmission === t}
                        className="accent-[#FACC15]"
                      />
                      <span className="text-sm text-gray-700 capitalize">{t}</span>
                    </label>
                  ))}
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Max Price</p>
                  {[60,80,100,120].map(p => (
                    <label key={p} className="flex items-center gap-2.5 py-1.5 cursor-pointer">
                      <input type="radio" name="maxPrice" value={p}
                        defaultChecked={sp.maxPrice === String(p)}
                        className="accent-[#FACC15]"
                      />
                      <span className="text-sm text-gray-700">Up to ${p}/hr</span>
                    </label>
                  ))}
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Preferences</p>
                  <label className="flex items-center gap-2.5 py-1.5 cursor-pointer">
                    <input type="checkbox" name="anxietyFriendly" value="1"
                      defaultChecked={sp.anxietyFriendly === '1'}
                      className="accent-[#FACC15]"
                    />
                    <span className="text-sm text-gray-700">Anxiety-friendly</span>
                  </label>
                  <label className="flex items-center gap-2.5 py-1.5 cursor-pointer">
                    <input type="checkbox" name="international" value="1"
                      defaultChecked={sp.international === '1'}
                      className="accent-[#FACC15]"
                    />
                    <span className="text-sm text-gray-700">International learners</span>
                  </label>
                </div>

                <button type="submit"
                  className="w-full bg-[#FACC15] text-gray-900 text-sm font-semibold py-2.5 rounded-xl hover:bg-yellow-400 transition-colors"
                >
                  Apply Filters
                </button>
              </form>
            </div>
          </aside>

          {/* Results */}
          <main className="flex-1 min-w-0">
            <Suspense fallback={
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1,2,3,4].map(i => <CardSkeleton key={i} />)}
              </div>
            }>
              <Results searchParams={searchParams} />
            </Suspense>
          </main>

        </div>
      </div>

      <Footer />
      <BottomNav />
    </div>
  )
}
