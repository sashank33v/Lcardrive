import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { BottomNav } from '@/components/layout/bottom-nav'
import { InstructorCard } from '@/components/instructor/instructor-card'
import { BreadcrumbJsonLd } from '@/components/seo/json-ld'
import { supabaseServer } from '@/lib/clients/supabase-server'

export const revalidate = 3600

interface Props {
  params: Promise<{ suburb: string }>
}

function formatSuburb(slug: string): string {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { suburb: suburbParam } = await params
  const suburb = formatSuburb(suburbParam)
  return {
    title:       `Driving Instructors in ${suburb} | LCarDrive`,
    description: `Find local, verified driving instructors in ${suburb}, VIC. Compare prices, read reviews and book lessons today.`,
    openGraph: {
      title:       `Driving Instructors in ${suburb} | LCarDrive`,
      description: `Find the best driving instructors in ${suburb}. Verified professionals, competitive rates.`,
      url:         `https://lcardrive.sashank.info/instructors-in/${suburbParam}`,
    },
    alternates: {
      canonical: `https://lcardrive.sashank.info/instructors-in/${suburbParam}`,
    },
  }
}

export async function generateStaticParams() {
  const { data } = await supabaseServer
    .from('instructors')
    .select('suburb')

  const suburbs = [...new Set((data || []).map((i: any) => i.suburb.toLowerCase().replace(/\s+/g, '-')))]
  return suburbs.map(suburb => ({ suburb }))
}

export default async function SuburbPage({ params }: Props) {
  const { suburb: suburbParam } = await params
  const suburb = formatSuburb(suburbParam)

  const { data: instructors } = await supabaseServer
    .from('instructors')
    .select('id, slug, first_name, last_name, suburb, hourly_rate, average_rating, review_count, transmission, is_verified, is_claimed, profile_photo_url, specialises_anxiety, accepts_international, years_experience, profile_completeness, state')
    .ilike('suburb', suburb)
    .order('profile_completeness', { ascending: false })

  if (!instructors || instructors.length === 0) notFound()

  const verified    = instructors.filter(i => i.is_verified).length
  const withPrice   = instructors.filter(i => i.hourly_rate)
  const avgPrice    = withPrice.length ? Math.round(withPrice.reduce((a, i) => a + i.hourly_rate, 0) / withPrice.length) : null
  const autoCount   = instructors.filter(i => i.transmission === 'auto' || i.transmission === 'both').length
  const manualCount = instructors.filter(i => i.transmission === 'manual' || i.transmission === 'both').length
  const minPrice    = withPrice.length ? Math.min(...withPrice.map(i => i.hourly_rate)) : null

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <BreadcrumbJsonLd items={[
        { name: 'Home',   url: 'https://lcardrive.sashank.info' },
        { name: 'Search', url: 'https://lcardrive.sashank.info/search' },
        { name: `Instructors in ${suburb}`, url: `https://lcardrive.sashank.info/instructors-in/${suburbParam}` },
      ]} />

      <main className="max-w-4xl mx-auto px-4 py-6 pb-28">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <Link href="/" className="hover:text-[#FACC15]">Home</Link>
          <span>/</span>
          <Link href="/search" className="hover:text-[#FACC15]">Search</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{suburb}</span>
        </nav>

        {/* Hero */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <MapPin size={20} className="text-[#FACC15]" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Driving Instructors in {suburb}
            </h1>
          </div>
          <p className="text-gray-500 text-sm">
            {instructors.length} instructor{instructors.length !== 1 ? 's' : ''} available in {suburb}, VIC
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total Instructors', value: instructors.length                  },
            { label: 'Verified',          value: verified                            },
            { label: 'Avg. Hourly Rate',  value: avgPrice ? `$${avgPrice}` : 'N/A'  },
            { label: 'Auto Available',    value: autoCount                           },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-2xl p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-[#FACC15]">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* SEO text */}
        <div className="bg-white rounded-2xl p-5 mb-6">
          <h2 className="font-bold text-gray-900 mb-2">Find a Driving Instructor in {suburb}</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Looking for a driving instructor in {suburb}? LCarDrive lists {instructors.length} local instructors
            offering both automatic and manual lessons.{verified > 0 ? ` ${verified} instructors are verified by our team.` : ''}
            {' '}Compare prices, read reviews, and contact instructors directly — no booking fees, no commission.
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            {autoCount > 0   && <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{autoCount} Automatic</span>}
            {manualCount > 0 && <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{manualCount} Manual</span>}
            {minPrice        && <span className="text-xs bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full">From ${minPrice}/hr</span>}
          </div>
        </div>

        {/* Instructor grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {instructors.map(i => <InstructorCard key={i.id} {...i} />)}
        </div>

        {/* CTA */}
        <div className="bg-gray-900 rounded-2xl p-6 text-center">
          <h3 className="text-white font-bold text-lg mb-2">Not sure which instructor to choose?</h3>
          <p className="text-blue-200 text-sm mb-4">Let our AI match you with the perfect instructor based on your needs.</p>
          <Link href="/find-my-instructor">
            <button className="bg-white text-[#FACC15] font-semibold px-6 py-2.5 rounded-xl text-sm hover:bg-yellow-50 transition-colors">
              ✦ Try AI Match
            </button>
          </Link>
        </div>

      </main>

      <BottomNav />
    </div>
  )
}
