import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Shield, Calendar, Sparkles, MapPin, Star, ArrowRight, CheckCircle } from 'lucide-react'
import { OrganisationJsonLd } from '@/components/seo/json-ld'
import { Header } from '@/components/layout/header'
import { BottomNav } from '@/components/layout/bottom-nav'
import { Footer } from '@/components/layout/footer'
import { HomeSearchCard } from '@/components/search/home-search-card'
import { supabaseServer } from '@/lib/clients/supabase-server'

export const metadata: Metadata = {
  title: 'Find a Driving Instructor Near You | LCarDrive Melbourne',
  description: 'Find verified local driving instructors across Melbourne. Compare prices, read reviews, contact directly. Free, no commission, AI-matched.',
  openGraph: {
    url: 'https://lcardrive.sashank.info',
    title: 'Find a Driving Instructor Near You | LCarDrive Melbourne',
    description: 'Find verified local driving instructors across Melbourne.',
  },
}

async function getStats() {
  const [{ count: verified }, { data: reviews }, { data: topInstructors }] = await Promise.all([
    supabaseServer.from('instructors').select('*', { count: 'exact', head: true }).eq('is_verified', true),
    supabaseServer.from('reviews').select('rating_overall').eq('is_approved', true),
    supabaseServer
      .from('instructors')
      .select('id, first_name, last_name, suburb, price_per_hour, rating, review_count, transmission, photo_url, is_verified, specialisations, slug')
      .eq('is_active', true)
      .order('rating', { ascending: false })
      .limit(3),
  ])
  const avg = reviews?.length
    ? (reviews.reduce((s, r) => s + (r.rating_overall || 0), 0) / reviews.length).toFixed(1)
    : '4.9'
  return { verified: verified || 0, avg, total: (verified || 0) + 30, topInstructors: topInstructors || [] }
}

const SUBURBS = [
  { name: 'Footscray',        slug: 'footscray',        count: 12 },
  { name: 'Sunshine',         slug: 'sunshine',         count: 11 },
  { name: 'St Kilda',         slug: 'st-kilda',         count: 8  },
  { name: 'Werribee',         slug: 'werribee',         count: 9  },
  { name: 'Hoppers Crossing', slug: 'hoppers-crossing', count: 7  },
  { name: 'Dandenong',        slug: 'dandenong',        count: 10 },
]

export default async function HomePage() {
  const stats = await getStats()

  return (
    <>
      <OrganisationJsonLd />
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main id="main-content" className="flex-1">

          {/* ── HERO ── */}
          <section className="bg-white pt-10 pb-8 px-4 max-w-5xl mx-auto w-full">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-8 max-w-2xl">
              Learn to drive with confidence.
            </h1>

            {/* Search card — pills are INSIDE this component, no duplicates */}
            <div className="max-w-2xl mb-10">
              <HomeSearchCard />
            </div>

            {/* Top Instructors */}
            <div className="max-w-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Top instructors</h2>
                <Link href="/search" className="text-sm font-semibold text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors">
                  View all <ArrowRight size={14} />
                </Link>
              </div>

              <div className="space-y-3">
                {stats.topInstructors.length > 0 ? (
                  stats.topInstructors.map((instructor: any) => (
                    <Link
                      key={instructor.id}
                      href={`/instructors/${instructor.suburb?.toLowerCase().replace(/\s+/g, '-')}/${instructor.slug}`}
                    >
                      <div className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-4 hover:border-[#FACC15] hover:shadow-sm transition-all">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                          {instructor.photo_url ? (
                            <Image
                              src={instructor.photo_url}
                              alt={`${instructor.first_name} ${instructor.last_name}`}
                              width={80}
                              height={80}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full bg-[#FACC15] flex items-center justify-center text-gray-900 font-bold text-lg">
                              {instructor.first_name?.[0]}{instructor.last_name?.[0]}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-bold text-gray-900 text-base">
                              {instructor.first_name} {instructor.last_name?.charAt(0)}.
                            </p>
                            <span className="font-bold text-gray-900 text-base flex-shrink-0">
                              ${instructor.price_per_hour}
                              <span className="text-gray-400 text-xs font-normal">/hr</span>
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Star size={13} className="text-[#FACC15] fill-[#FACC15]" />
                            <span className="text-sm text-gray-600">
                              {instructor.rating?.toFixed(1)} ({instructor.review_count} reviews)
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                            {instructor.transmission?.map((t: string) => (
                              <span key={t} className="text-xs font-semibold px-2.5 py-1 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-100 uppercase">
                                {t}
                              </span>
                            ))}
                            {instructor.is_verified && (
                              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-100">
                                Verified
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  [
                    { name: 'Sarah J.', price: 70, rating: 4.9, reviews: 124, tags: ['AUTO', 'TOP RATED'] },
                    { name: 'David C.', price: 65, rating: 4.8, reviews: 89,  tags: ['MANUAL', 'PATIENT'] },
                  ].map((p) => (
                    <div key={p.name} className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-4">
                      <div className="w-16 h-16 rounded-xl bg-[#FACC15] flex items-center justify-center text-gray-900 font-bold text-lg flex-shrink-0">
                        {p.name[0]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <p className="font-bold text-gray-900">{p.name}</p>
                          <span className="font-bold text-gray-900">${p.price}<span className="text-gray-400 text-xs font-normal">/hr</span></span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Star size={13} className="text-[#FACC15] fill-[#FACC15]" />
                          <span className="text-sm text-gray-600">{p.rating} ({p.reviews} reviews)</span>
                        </div>
                        <div className="flex gap-1.5 mt-2">
                          {p.tags.map(t => (
                            <span key={t} className="text-xs font-semibold px-2.5 py-1 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-100">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          {/* ── AI MATCH BANNER ── */}
          <section className="px-4 max-w-5xl mx-auto w-full py-4">
            <Link href="/find-my-instructor">
              <div className="bg-gray-900 rounded-2xl px-6 py-5 flex items-center justify-between hover:bg-gray-800 transition-colors cursor-pointer max-w-2xl md:max-w-none">
                <div>
                  <p className="font-bold text-white text-base">Not sure who to pick?</p>
                  <p className="text-gray-400 text-sm mt-0.5">Find my match</p>
                </div>
                <div className="w-11 h-11 bg-[#FACC15] rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles size={20} className="text-gray-900" />
                </div>
              </div>
            </Link>
          </section>

          {/* ── FEATURE CARDS ── */}
          <section className="px-4 max-w-5xl mx-auto w-full py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-5">
                <Shield size={22} className="text-yellow-600 mb-3" />
                <p className="text-sm font-medium text-gray-800 leading-snug">Verified & background checked instructors only.</p>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                <Calendar size={22} className="text-gray-600 mb-3" />
                <p className="text-sm font-medium text-gray-800 leading-snug">Contact instructors directly — no middleman.</p>
              </div>
              <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-5">
                <Star size={22} className="text-yellow-600 mb-3" />
                <p className="text-sm font-medium text-gray-800 leading-snug">Real student reviews you can trust.</p>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                <CheckCircle size={22} className="text-gray-600 mb-3" />
                <p className="text-sm font-medium text-gray-800 leading-snug">Free to use. No commission, ever.</p>
              </div>
            </div>
          </section>

          {/* ── BROWSE BY SUBURB ── */}
          <section className="bg-gray-50 py-12 px-4">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Browse by suburb</h2>
                  <p className="text-gray-500 text-sm mt-1">Find help in your local neighbourhood</p>
                </div>
                <Link href="/search" className="text-sm font-semibold text-gray-500 hover:text-gray-900 flex items-center gap-1">
                  View all <ArrowRight size={14} />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {SUBURBS.map(({ name, slug, count }) => (
                  <Link key={slug} href={`/instructors-in/${slug}`}>
                    <div className="bg-white border border-gray-100 rounded-xl p-4 hover:border-[#FACC15] hover:bg-yellow-50 active:scale-[0.98] transition-all cursor-pointer h-24 flex flex-col justify-between">
                      <MapPin size={16} className="text-[#FACC15]" />
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{name}</p>
                        <p className="text-gray-400 text-xs">{count} instructors</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* ── HOW IT WORKS ── */}
          <section className="py-12 px-4 bg-white">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-xl font-bold text-gray-900">How it works</h2>
                <p className="text-gray-500 text-sm mt-1">Simple, free, no sign-up required to search</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl md:max-w-none mx-auto">
                {[
                  { n: '1', title: 'Search',  desc: 'Enter your suburb and filter by price, transmission, and needs.' },
                  { n: '2', title: 'Compare', desc: 'Read reviews, check prices and test centre knowledge.'           },
                  { n: '3', title: 'Contact', desc: 'Reach out directly — no fees, no middleman.'                    },
                ].map(({ n, title, desc }) => (
                  <div key={n} className="flex items-start gap-4 bg-gray-50 rounded-2xl p-5 border border-gray-100">
                    <div className="w-9 h-9 bg-[#FACC15] text-gray-900 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {n}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">{title}</p>
                      <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── INSTRUCTOR CTA ── */}
          <section className="py-10 px-4 bg-gray-50">
            <div className="max-w-5xl mx-auto">
              <div className="bg-white border border-gray-100 rounded-2xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-2xl md:max-w-none mx-auto">
                <div>
                  <p className="font-semibold text-gray-900">Are you a driving instructor?</p>
                  <p className="text-gray-500 text-sm mt-0.5">Claim your free profile and get found by learners in your area.</p>
                </div>
                <Link href="/search?mode=claim" className="flex-shrink-0">
                  <button className="bg-[#FACC15] text-gray-900 font-semibold px-6 py-3 rounded-xl hover:bg-yellow-400 transition-colors whitespace-nowrap text-sm">
                    Claim free profile
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
