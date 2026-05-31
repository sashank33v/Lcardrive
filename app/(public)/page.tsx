import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRight, Shield, Star } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { BottomNav } from '@/components/layout/bottom-nav'
import { HomeSearchCard } from '@/components/search/home-search-card'
import { OrganisationJsonLd } from '@/components/seo/json-ld'

export const metadata: Metadata = {
  title:       'Find a Driving Instructor Near You | LCarDrive',
  description: 'Find local, verified driving instructors across Melbourne. Compare prices, read reviews and contact instructors directly. No booking fees.',
  keywords:    ['driving instructor Melbourne', 'driving lessons Melbourne', 'learn to drive Melbourne'],
  openGraph: {
    title:       'Find a Driving Instructor Near You | LCarDrive',
    description: 'Local, verified driving instructors across Melbourne. Compare prices and read reviews.',
    url:         'https://lcardrive.com.au',
    siteName:    'LCarDrive',
    locale:      'en_AU',
    type:        'website',
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Find a Driving Instructor | LCarDrive',
    description: 'Local, verified driving instructors across Melbourne.',
  },
  alternates: {
    canonical: 'https://lcardrive.com.au',
  },
}

export default function HomePage() {
  const suburbs = [
    { name: 'Footscray',  count: 12, gradient: 'from-emerald-700 to-emerald-500' },
    { name: 'Sunshine',   count: 11, gradient: 'from-blue-700 to-blue-500'       },
    { name: 'Werribee',   count: 10, gradient: 'from-violet-700 to-violet-500'   },
    { name: 'Coburg',     count: 8,  gradient: 'from-orange-700 to-orange-500'   },
    { name: 'Preston',    count: 7,  gradient: 'from-rose-700 to-rose-500'       },
    { name: 'Epping',     count: 7,  gradient: 'from-teal-700 to-teal-500'       },
    { name: 'Bundoora',   count: 7,  gradient: 'from-indigo-700 to-indigo-500'   },
    { name: 'Thomastown', count: 6,  gradient: 'from-amber-700 to-amber-500'     },
  ]

  return (
    <div className="min-h-screen bg-[#F0F2FF]">
      <Header />
      <OrganisationJsonLd />

      <main className="pb-24 md:pb-12">
        <div className="max-w-6xl mx-auto px-4">

          {/* Hero */}
          <section className="pt-6 pb-4 md:pt-12 md:pb-10 md:grid md:grid-cols-2 md:gap-12 md:items-start">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-3">
                Find your perfect<br />driving instructor.
              </h1>
              <p className="text-gray-500 text-base md:text-lg mb-6">
                Local, verified experts across Melbourne ready to help you pass.
              </p>
              <HomeSearchCard />
            </div>

            {/* Desktop AI banner */}
            <div className="hidden md:block pt-16">
              <div className="bg-[#1A3CFF] rounded-2xl p-8 relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-blue-200 text-sm font-medium uppercase tracking-wide mb-2">✦ AI-Powered</p>
                  <h2 className="text-white font-bold text-2xl mb-3">Not sure who to pick?</h2>
                  <p className="text-blue-200 mb-6 text-sm leading-relaxed">
                    Answer 5 quick questions and our AI will recommend the best instructor for your learning style, suburb and budget.
                  </p>
                  <Link href="/find-my-instructor">
                    <button className="flex items-center gap-2 bg-white text-[#1A3CFF] font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors">
                      ✦ Try AI Match <ArrowRight size={16} />
                    </button>
                  </Link>
                </div>
                <div className="absolute right-6 bottom-4 text-white/10 text-9xl select-none pointer-events-none">🤖</div>
              </div>
            </div>
          </section>

          {/* Mobile AI banner */}
          <section className="md:hidden mb-6">
            <div className="bg-[#1A3CFF] rounded-2xl p-5 relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-white font-bold text-lg mb-1">Not sure who to pick?</h2>
                <p className="text-blue-200 text-sm mb-4">Answer 5 questions — AI recommends your best match.</p>
                <Link href="/find-my-instructor">
                  <button className="flex items-center gap-2 bg-white/20 border border-white/40 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-white/30 transition-colors text-sm">
                    ✦ Try AI Match
                  </button>
                </Link>
              </div>
              <div className="absolute right-4 bottom-0 text-white/20 text-7xl select-none pointer-events-none">🤖</div>
            </div>
          </section>

          {/* Stats */}
          <section className="grid grid-cols-2 gap-3 mb-8">
            {[
              { value: '96+',   label: 'Verified Instructors', icon: Shield, bg: 'bg-blue-50',   color: 'text-[#1A3CFF]'                 },
              { value: '4.9/5', label: 'Average Star Rating',  icon: Star,   bg: 'bg-yellow-50', color: 'text-yellow-500 fill-yellow-500' },
            ].map(({ value, label, icon: Icon, bg, color }) => (
              <div key={label} className="bg-white rounded-2xl px-4 py-3.5 flex items-center gap-3 shadow-sm">
                <div className={`w-10 h-10 ${bg} rounded-full flex items-center justify-center flex-shrink-0`}>
                  <Icon size={20} className={color} />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-lg leading-none">{value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </section>

          {/* How it works (desktop) */}
          <section className="hidden md:block mb-10">
            <h2 className="font-bold text-gray-900 text-2xl mb-6 text-center">How it works</h2>
            <div className="grid grid-cols-3 gap-6">
              {[
                { step: '1', title: 'Search',  desc: 'Enter your suburb and filter by price, transmission, and specialisation' },
                { step: '2', title: 'Compare', desc: 'Read reviews, check prices, availability and test centre knowledge'       },
                { step: '3', title: 'Contact', desc: 'Reach out directly — no booking fees, no middleman, no commission'        },
              ].map(({ step, title, desc }) => (
                <div key={step} className="bg-white rounded-2xl p-6 text-center shadow-sm">
                  <div className="w-10 h-10 bg-[#1A3CFF] rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">{step}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Browse by Suburb */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900 text-lg md:text-2xl">Browse by Suburb</h2>
              <Link href="/search" className="text-sm text-[#1A3CFF] font-medium flex items-center gap-1 hover:underline">
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {suburbs.map(({ name, count, gradient }) => (
                <Link
                  key={name}
                  href={`/instructors-in/${name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="relative rounded-2xl overflow-hidden h-28 md:h-36 hover:opacity-90 hover:scale-[1.02] transition-all"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white font-bold text-sm">{name}</p>
                    <p className="text-white/80 text-xs">{count} Instructors</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* For Instructors strip */}
          <section className="bg-white rounded-2xl p-6 md:p-8 text-center md:flex md:items-center md:justify-between md:text-left mb-8 shadow-sm">
            <div className="mb-4 md:mb-0">
              <h2 className="font-bold text-gray-900 text-lg">Are you a driving instructor?</h2>
              <p className="text-gray-500 text-sm mt-1">Claim your free profile and get found by learners in your area. No subscription fees.</p>
            </div>
            <Link href="/portal">
              <button className="bg-[#1A3CFF] text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors whitespace-nowrap">
                Claim Free Profile
              </button>
            </Link>
          </section>

        </div>
      </main>

      <BottomNav />
    </div>
  )
}
