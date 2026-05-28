import Link from 'next/link'
import { Search, MapPin, ChevronDown, Settings2, Car, Brain, Shield, Star, ArrowRight } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { BottomNav } from '@/components/layout/bottom-nav'

export default function HomePage() {
  const suburbs = [
    { name: 'Melbourne West',  count: 32, gradient: 'from-emerald-700 to-emerald-500' },
    { name: 'Melbourne North', count: 28, gradient: 'from-blue-700 to-blue-500'       },
    { name: 'Melbourne South', count: 24, gradient: 'from-violet-700 to-violet-500'   },
    { name: 'Melbourne East',  count: 19, gradient: 'from-orange-700 to-orange-500'   },
  ]

  const stats = [
    { value: '80+',  label: 'Verified Local Instructors', icon: Shield, bg: 'bg-blue-50',   color: 'text-[#1A3CFF]'  },
    { value: '4.9/5', label: 'Average Local Reviews',     icon: Star,   bg: 'bg-yellow-50', color: 'text-yellow-500 fill-yellow-500' },
  ]

  return (
    <div className="min-h-screen bg-[#F0F2FF]">
      <Header />

      <main className="pb-24 md:pb-12">
        <div className="max-w-6xl mx-auto px-4">

          {/* ── HERO SECTION ── */}
          <section className="pt-6 pb-8 md:pt-12 md:pb-12 md:grid md:grid-cols-2 md:gap-12 md:items-center">

            {/* Left: text + search */}
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-3">
                Find your perfect<br />driving instructor.
              </h2>
              <p className="text-gray-500 text-base md:text-lg mb-6">
                Local, verified experts ready to help you pass.
              </p>

              {/* Search Card */}
              <div className="bg-white rounded-2xl p-4 shadow-sm mb-5 md:shadow-md">
                <Link href="/search">
                  <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 mb-3 hover:border-[#1A3CFF] transition-colors cursor-pointer">
                    <Search size={18} className="text-gray-400" />
                    <span className="text-gray-400 text-sm">Suburb or Postcode</span>
                  </div>
                </Link>

                <div className="flex items-center justify-between border border-gray-200 rounded-xl px-4 py-3 mb-3 cursor-pointer hover:border-gray-300">
                  <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-gray-400" />
                    <span className="text-sm text-gray-700">Within 10km</span>
                  </div>
                  <ChevronDown size={16} className="text-gray-400" />
                </div>

                <Link href="/search">
                  <button className="w-full bg-[#1A3CFF] text-white font-semibold py-3.5 rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors">
                    Search Instructors
                  </button>
                </Link>
              </div>

              {/* Quick Filter Chips */}
              <div className="flex gap-2 flex-wrap">
                {[
                  { label: 'Auto',             icon: Settings2 },
                  { label: 'Manual',           icon: Car       },
                  { label: 'Anxiety-friendly', icon: Brain     },
                ].map(({ label, icon: Icon }) => (
                  <Link
                    key={label}
                    href={`/search?filter=${label.toLowerCase()}`}
                    className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 whitespace-nowrap hover:border-[#1A3CFF] hover:text-[#1A3CFF] transition-colors"
                  >
                    <Icon size={14} />
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right: AI Banner (desktop shows here, mobile shows below) */}
            <div className="hidden md:block">
              <div className="bg-[#1A3CFF] rounded-2xl p-8 relative overflow-hidden">
                <h3 className="text-white font-bold text-2xl mb-2">Not sure who to pick?</h3>
                <p className="text-blue-200 mb-6">Answer 5 questions — AI recommends your best match.</p>
                <Link href="/find-my-instructor">
                  <button className="flex items-center gap-2 bg-white text-[#1A3CFF] font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors">
                    ✦ Try AI Match
                    <ArrowRight size={16} />
                  </button>
                </Link>
                <div className="absolute right-6 bottom-4 text-white/10 text-9xl select-none">🤖</div>
              </div>
            </div>
          </section>

          {/* ── AI MATCH BANNER (mobile only) ── */}
          <section className="md:hidden mb-6">
            <div className="bg-[#1A3CFF] rounded-2xl p-5 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-white font-bold text-lg mb-1">Not sure who to pick?</h3>
                <p className="text-blue-200 text-sm mb-4">Answer 5 questions — AI recommends your best match.</p>
                <Link href="/find-my-instructor">
                  <button className="flex items-center gap-2 bg-white/20 border border-white/40 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-white/30 transition-colors text-sm">
                    ✦ Try AI Match
                  </button>
                </Link>
              </div>
              <div className="absolute right-4 bottom-0 text-white/20 text-7xl select-none">🤖</div>
            </div>
          </section>

          {/* ── STATS ── */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
            {stats.map(({ value, label, icon: Icon, bg, color }) => (
              <div key={label} className="bg-white rounded-2xl px-4 py-3.5 flex items-center gap-4 shadow-sm">
                <div className={`w-10 h-10 ${bg} rounded-full flex items-center justify-center flex-shrink-0`}>
                  <Icon size={20} className={color} />
                </div>
                <div>
                  <p className="font-bold text-gray-900">{value}</p>
                  <p className="text-sm text-gray-500">{label}</p>
                </div>
              </div>
            ))}
          </section>

          {/* ── HOW IT WORKS (desktop only) ── */}
          <section className="hidden md:block mb-12">
            <h3 className="font-bold text-gray-900 text-2xl mb-6 text-center">How it works</h3>
            <div className="grid grid-cols-3 gap-6">
              {[
                { step: '1', title: 'Search',  desc: 'Enter your suburb and filter by your preferences'    },
                { step: '2', title: 'Compare', desc: 'Read reviews, check prices and availability'          },
                { step: '3', title: 'Contact', desc: 'Reach out directly — no booking fees, no commission'  },
              ].map(({ step, title, desc }) => (
                <div key={step} className="bg-white rounded-2xl p-6 text-center shadow-sm">
                  <div className="w-10 h-10 bg-[#1A3CFF] rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">{step}</span>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1">{title}</h4>
                  <p className="text-sm text-gray-500">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── BROWSE BY SUBURB ── */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 text-lg md:text-2xl">Browse by Suburb</h3>
              <Link href="/search" className="text-sm text-[#1A3CFF] font-medium flex items-center gap-1 hover:underline">
                View all <ArrowRight size={14} />
              </Link>
            </div>
            {/* 2 cols mobile → 4 cols desktop */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {suburbs.map(({ name, count, gradient }) => (
                <Link
                  key={name}
                  href={`/search?suburb=${encodeURIComponent(name)}`}
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

          {/* ── FOR INSTRUCTORS STRIP ── */}
          <section className="bg-white rounded-2xl p-6 md:p-8 text-center md:flex md:items-center md:justify-between md:text-left mb-8">
            <div className="mb-4 md:mb-0">
              <h3 className="font-bold text-gray-900 text-lg">Are you a driving instructor?</h3>
              <p className="text-gray-500 text-sm">Claim your free profile and get found by learners in your area.</p>
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
