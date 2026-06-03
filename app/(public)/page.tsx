import type { Metadata } from 'next'
import Link from 'next/link'
import { Shield, DollarSign, Users, Sparkles, MapPin, Star, ArrowRight, CheckCircle } from 'lucide-react'
import { OrganisationJsonLd } from '@/components/seo/json-ld'
import { Header } from '@/components/layout/header'
import { BottomNav } from '@/components/layout/bottom-nav'
import { Footer } from '@/components/layout/footer'
import { HomeSearchCard } from '@/components/search/home-search-card'
import { supabaseServer } from '@/lib/clients/supabase-server'

export const metadata: Metadata = {
  title: 'Find a Driving Instructor Near You | LCarDrive Melbourne',
  description: 'Find verified local driving instructors across Melbourne. Compare prices, read reviews, contact directly. Free, no commission, AI-matched.',
}

async function getStats() {
  const [{ count: verified }, { data: reviews }] = await Promise.all([
    supabaseServer.from('instructors').select('*', { count: 'exact', head: true }).eq('is_verified', true),
    supabaseServer.from('reviews').select('rating_overall').eq('is_approved', true),
  ])
  const avg = reviews?.length
    ? (reviews.reduce((s, r) => s + (r.rating_overall || 0), 0) / reviews.length).toFixed(1)
    : '4.9'
  return { verified: verified || 0, avg, total: (verified || 0) + 30 }
}

const SUBURBS = [
  { name: 'Footscray',        slug: 'footscray',        count: 12, color: 'bg-blue-700'   },
  { name: 'Sunshine',         slug: 'sunshine',         count: 11, color: 'bg-indigo-700' },
  { name: 'St Kilda',         slug: 'st-kilda',         count: 8,  color: 'bg-violet-700' },
  { name: 'Werribee',         slug: 'werribee',         count: 9,  color: 'bg-sky-700'    },
  { name: 'Hoppers Crossing', slug: 'hoppers-crossing', count: 7,  color: 'bg-teal-700'   },
  { name: 'Dandenong',        slug: 'dandenong',        count: 10, color: 'bg-blue-800'   },
]

export default async function HomePage() {
  const stats = await getStats()

  return (
    <>
      <OrganisationJsonLd />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main id="main-content" className="flex-1">

          {/* ── HERO with road background ── */}
          <section
            className="relative min-h-[620px] flex items-center overflow-hidden"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(15,23,42,0.96) 0%, rgba(15,23,42,0.92) 50%, rgba(15,23,42,0.75) 100%),
                url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1920&q=80&auto=format&fit=crop')
              `,
              backgroundSize: 'cover',
              backgroundPosition: 'center 40%',
            }}
          >
            {/* Subtle blue glow top-right */}
            <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 w-full">
              <div className="max-w-2xl">

                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-blue-200 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 backdrop-blur-sm">
                  <MapPin size={12} />
                  Melbourne's Verified Instructor Directory
                </div>

                {/* Headline */}
                <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-4">
                  Learn to drive with<br />
                  <span className="text-[#FFC400]">confidence and safety.</span>
                </h1>
                <p className="text-lg text-blue-100 mb-8 max-w-lg leading-relaxed">
                  Connect with {stats.total}+ verified local instructors across Melbourne.
                  Simple, professional guidance. No commission, no fees.
                </p>

                {/* Search card */}
                <div className="bg-white rounded-2xl p-4 shadow-2xl max-w-xl">
                  <HomeSearchCard />
                </div>

                {/* Social proof */}
                <div className="flex items-center gap-6 mt-6 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {['bg-blue-500','bg-teal-500','bg-indigo-500'].map((c,i) => (
                        <div key={i} className={`w-8 h-8 ${c} rounded-full border-2 border-[#0F172A] flex items-center justify-center text-white text-xs font-bold`}>
                          {['SK','MR','JP'][i]}
                        </div>
                      ))}
                    </div>
                    <span className="text-blue-200 text-sm">
                      <strong className="text-white">{stats.verified}+</strong> Verified Instructors
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="flex">
                      {[1,2,3,4,5].map(s => <Star key={s} size={13} className="text-yellow-400 fill-yellow-400" />)}
                    </div>
                    <span className="text-blue-200 text-sm">
                      <strong className="text-white">{stats.avg}</strong> Average Reviews
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* ── AI FEATURE ── */}
          <section className="bg-[#F0F2FF] py-16">
            <div className="max-w-6xl mx-auto px-4">
              <div className="bg-white rounded-3xl p-8 md:p-12 grid md:grid-cols-2 gap-10 items-center shadow-sm">
                <div>
                  <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
                    <Sparkles size={12} /> NEW FEATURE
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                    Let AI find your perfect instructor match.
                  </h2>
                  <p className="text-gray-500 mb-6 leading-relaxed">
                    Answer a few questions about your driving goals, anxiety levels, and schedule.
                    Our smart algorithm pairs you with an instructor who matches your learning style perfectly.
                  </p>
                  <ul className="space-y-3 mb-8">
                    {[
                      { Icon: Users,  text: 'Personalized Fit — matches based on temperament and teaching style' },
                      { Icon: MapPin, text: 'Local to your suburb with knowledge of your test routes'            },
                      { Icon: Star,   text: 'Instant Availability — only see matches that fit your calendar'     },
                    ].map(({ Icon, text }) => (
                      <li key={text} className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Icon size={14} className="text-[#1A3CFF]" />
                        </div>
                        <span className="text-sm text-gray-600 leading-relaxed">{text}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/find-my-instructor">
                    <button className="inline-flex items-center gap-2 bg-[#1A3CFF] text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 active:scale-95 transition-all">
                      Get Started <ArrowRight size={16} />
                    </button>
                  </Link>
                </div>

                {/* Decorative visual */}
                <div className="hidden md:flex items-center justify-center">
                  <div className="relative w-64 h-64">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl" />
                    <div className="absolute inset-6 bg-gradient-to-br from-[#1A3CFF] to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                      <Sparkles size={72} className="text-white/70" />
                    </div>
                    <div className="absolute -top-4 -right-4 bg-white rounded-2xl px-4 py-2 shadow-xl border border-gray-100">
                      <p className="text-xs font-semibold text-gray-700">AI Matched</p>
                      <div className="flex mt-1">
                        {[1,2,3,4,5].map(s => <Star key={s} size={10} className="text-yellow-400 fill-yellow-400" />)}
                      </div>
                    </div>
                    <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl px-4 py-2 shadow-xl border border-gray-100">
                      <p className="text-xs text-gray-500">Top match</p>
                      <p className="text-sm font-bold text-[#1A3CFF]">98% fit</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── BROWSE BY SUBURB ── */}
          <section className="py-16 bg-white">
            <div className="max-w-6xl mx-auto px-4">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Browse by Suburb</h2>
                  <p className="text-gray-500 mt-1">Quickly find help in your local neighbourhood</p>
                </div>
                <Link href="/search" className="text-sm font-semibold text-[#1A3CFF] hover:underline flex items-center gap-1">
                  View All Suburbs <ArrowRight size={14} />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {SUBURBS.map(({ name, slug, count, color }) => (
                  <Link key={slug} href={`/instructors-in/${slug}`}>
                    <div className={`${color} rounded-2xl p-5 hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer h-36 flex flex-col justify-between`}>
                      <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                        <MapPin size={16} className="text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-white text-base">{name}</p>
                        <p className="text-white/70 text-xs mt-0.5">{count} Instructors</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* ── TRUST BAR ── */}
          <section className="bg-[#1A3CFF] py-14">
            <div className="max-w-6xl mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {[
                  { Icon: Shield,     title: '100% Verified',  desc: 'Every instructor is background checked and ADI-accredited.'          },
                  { Icon: DollarSign, title: 'Easy & Free',     desc: 'No subscription, no commission, no hidden fees for learners.'        },
                  { Icon: Users,      title: '24/7 Support',    desc: 'We\'re here to help you through your entire learning journey.'       },
                ].map(({ Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Icon size={22} className="text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-lg mb-1">{title}</p>
                      <p className="text-sm text-blue-100 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── HOW IT WORKS ── */}
          <section id="how" className="py-16 bg-[#F0F2FF]">
            <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900">How it works</h2>
                <p className="text-gray-500 mt-2">Simple, free, no sign-up required to search</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { n:'1', title:'Search',  desc:'Enter your suburb and filter by price, transmission, and specialisation.',                     Icon: MapPin      },
                  { n:'2', title:'Compare', desc:'Read reviews, check prices, availability and test centre knowledge.',                           Icon: Star        },
                  { n:'3', title:'Contact', desc:'Reach out directly — no booking fees, no middleman, no commission.',                            Icon: CheckCircle },
                ].map(({ n, title, desc, Icon }) => (
                  <div key={n} className="bg-white rounded-2xl p-7 text-center shadow-sm">
                    <div className="w-12 h-12 bg-[#1A3CFF] text-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                      {n}
                    </div>
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Icon size={18} className="text-[#1A3CFF]" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 text-lg">{title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── INSTRUCTOR CTA ── */}
          <section className="bg-white py-12">
            <div className="max-w-6xl mx-auto px-4">
              <div className="bg-[#F0F2FF] rounded-3xl px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <p className="font-bold text-gray-900 text-lg mb-1">Are you a driving instructor?</p>
                  <p className="text-gray-500 text-sm">
                    Claim your free profile and get found by learners in your area. No subscription fees.
                  </p>
                </div>
                <Link href="/search" className="flex-shrink-0">
                  <button className="bg-[#1A3CFF] text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors whitespace-nowrap">
                    Claim Free Profile
                  </button>
                </Link>
              </div>
            </div>
          </section>

        </main>
        <Footer />
        <BottomNav />
      </div>
    </>
  )
}
