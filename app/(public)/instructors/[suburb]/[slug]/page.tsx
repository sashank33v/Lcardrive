import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  MapPin, Star, CheckCircle, Car, Brain, Globe, Calendar,
  Clock, Phone, Mail, ChevronLeft, Sparkles
} from 'lucide-react'
import { Header } from '@/components/layout/header'
import { BottomNav } from '@/components/layout/bottom-nav'
import { Footer } from '@/components/layout/footer'
import { InstructorJsonLd, BreadcrumbJsonLd } from '@/components/seo/json-ld'
import { ReviewForm } from '@/components/instructor/review-form'
import { ShareButton } from '@/components/instructor/share-button'
import { getInstructorBySlug, getAllSlugs } from '@/lib/repos/instructors.repo'
import { supabaseServer } from '@/lib/clients/supabase-server'

export const revalidate = 3600

const GRADS = [
  'from-blue-700 to-blue-900',
  'from-indigo-700 to-indigo-900',
  'from-teal-700 to-teal-900',
  'from-violet-700 to-violet-900',
]

interface Props { params: Promise<{ suburb: string; slug: string }> }

export async function generateStaticParams() {
  const slugs = await getAllSlugs()
  return slugs.map(({ suburb, slug }: any) => ({ suburb, slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const instructor = await getInstructorBySlug(slug)
  if (!instructor) return {}
  return {
    title: `${instructor.first_name} ${instructor.last_name} — Driving Instructor in ${instructor.suburb} | LCarDrive`,
    description: instructor.bio?.slice(0, 155) ||
      `Book lessons with ${instructor.first_name} in ${instructor.suburb}. Verified, ${instructor.years_experience}+ years experience.`,
  }
}

export default async function ProfilePage({ params }: Props) {
  const { suburb, slug } = await params
  const instructor        = await getInstructorBySlug(slug)
  if (!instructor) notFound()

  const { data: reviews } = await supabaseServer
    .from('reviews')
    .select('*')
    .eq('instructor_id', instructor.id)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })

  const avg = reviews?.length
    ? reviews.reduce((s, r) => s + r.rating_overall, 0) / reviews.length
    : null

  const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  reviews?.forEach(r => { if (r.rating_overall) distribution[r.rating_overall]++ })

  const packages = (() => {
    try {
      return typeof instructor.package_options === 'string'
        ? JSON.parse(instructor.package_options)
        : (instructor.package_options || [])
    } catch { return [] }
  })()

  const grad     = GRADS[instructor.first_name.charCodeAt(0) % GRADS.length]
  const initials = `${instructor.first_name[0]}${instructor.last_name[0]}`.toUpperCase()

  const DAY_MAP:  Record<string, string> = { mon:'Mon', tue:'Tue', wed:'Wed', thu:'Thu', fri:'Fri', sat:'Sat', sun:'Sun' }
  const SLOT_MAP: Record<string, string> = { morning:'Morning', afternoon:'Afternoon', evening:'Evening' }

  return (
    <>
      <InstructorJsonLd
        name={`${instructor.first_name} ${instructor.last_name}`}
        suburb={instructor.suburb}
        state={instructor.state || 'VIC'}
        postcode={instructor.postcode || '3000'}
        phone={instructor.phone}
        email={instructor.email}
        bio={instructor.bio}
        photo={instructor.profile_photo_url}
        hourlyRate={instructor.hourly_rate}
        rating={avg ?? undefined}
        reviewCount={reviews?.length || 0}
        slug={slug}
      />
      <BreadcrumbJsonLd items={[
        { name: 'Home',   url: '/'       },
        { name: 'Search', url: '/search' },
        { name: `${instructor.first_name} ${instructor.last_name}`, url: `/instructors/${suburb}/${slug}` },
      ]} />

      <div className="min-h-screen bg-[#F0F2FF] flex flex-col">
        <Header />
        <main id="main-content" className="flex-1">

          {/* ── HERO BANNER ── */}
          <div className={`relative bg-gradient-to-br ${grad} h-48 md:h-56`}>
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}
            />
            <div className="absolute top-4 left-4">
              <Link href="/search"
                className="flex items-center gap-1.5 text-white/80 hover:text-white text-sm bg-black/20 px-3 py-1.5 rounded-xl backdrop-blur-sm transition-colors"
              >
                <ChevronLeft size={14} /> Back to search
              </Link>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4">

            {/* Profile photo overlapping banner */}
            <div className="flex items-end gap-5 -mt-16 mb-6 relative z-10">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl border-4 border-white shadow-lg overflow-hidden flex-shrink-0">
                {instructor.profile_photo_url ? (
                  <Image
                    src={instructor.profile_photo_url}
                    alt={`${instructor.first_name} ${instructor.last_name}`}
                    width={128} height={128}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${grad} flex items-center justify-center`}>
                    <span className="text-3xl font-bold text-white/80">{initials}</span>
                  </div>
                )}
              </div>
              <div className="pb-2 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {instructor.first_name} {instructor.last_name}
                  </h1>
                  {instructor.is_verified && (
                    <span className="flex items-center gap-1 bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">
                      <CheckCircle size={11} /> Verified
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                  <div className="flex items-center gap-1">
                    <MapPin size={13} className="text-gray-400" />
                    <span className="text-sm text-gray-500">
                      {instructor.suburb}{instructor.state ? `, ${instructor.state}` : ''}
                    </span>
                  </div>
                  {avg && (
                    <div className="flex items-center gap-1">
                      <Star size={13} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-semibold text-gray-700">{avg.toFixed(1)}</span>
                      <span className="text-sm text-gray-400">({reviews?.length || 0} reviews)</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Main 2-col grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-16">

              {/* ── LEFT COLUMN ── */}
              <div className="lg:col-span-2 space-y-5">

                {/* About */}
                {instructor.bio && (
                  <div className="bg-white rounded-2xl p-6">
                    <h2 className="font-bold text-gray-900 mb-3 text-lg">About {instructor.first_name}</h2>
                    <p className="text-gray-600 leading-relaxed">{instructor.bio}</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {instructor.transmission && (
                        <span className="flex items-center gap-1.5 text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full font-medium">
                          <Car size={12} />
                          {instructor.transmission.charAt(0).toUpperCase() + instructor.transmission.slice(1)}
                        </span>
                      )}
                      {instructor.years_experience && (
                        <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full font-medium">
                          {instructor.years_experience}+ years experience
                        </span>
                      )}
                      {instructor.dual_controls && (
                        <span className="text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-full font-medium">
                          Dual controls
                        </span>
                      )}
                      {instructor.specialises_anxiety && (
                        <span className="flex items-center gap-1.5 text-xs bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full font-medium">
                          <Brain size={12} /> Anxiety-friendly
                        </span>
                      )}
                      {instructor.accepts_international && (
                        <span className="flex items-center gap-1.5 text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full font-medium">
                          <Globe size={12} /> International learners
                        </span>
                      )}
                      {(instructor.languages || []).map((l: string) => (
                        <span key={l} className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full font-medium">
                          {l}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Vehicle */}
                {instructor.vehicle_make && (
                  <div className="bg-white rounded-2xl p-6">
                    <h2 className="font-bold text-gray-900 mb-3 text-lg">Teaching Vehicle</h2>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Car size={22} className="text-[#1A3CFF]" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {instructor.vehicle_year} {instructor.vehicle_make} {instructor.vehicle_model}
                        </p>
                        <p className="text-sm text-gray-500 capitalize">
                          {instructor.transmission} transmission
                          {instructor.dual_controls ? ' · Dual controls' : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Availability */}
                {(instructor.availability_days || []).length > 0 && (
                  <div className="bg-white rounded-2xl p-6">
                    <h2 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
                      <Calendar size={18} className="text-[#1A3CFF]" /> Availability
                    </h2>
                    <div className="flex gap-2 flex-wrap mb-3">
                      {(instructor.availability_days || []).map((d: string) => (
                        <span key={d} className="text-xs font-semibold bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full">
                          {DAY_MAP[d] || d}
                        </span>
                      ))}
                    </div>
                    {(instructor.availability_slots || []).length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {(instructor.availability_slots || []).map((s: string) => (
                          <span key={s} className="text-xs text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
                            <Clock size={10} className="inline mr-1" />
                            {SLOT_MAP[s] || s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Test centres */}
                {(instructor.familiar_test_centres || []).length > 0 && (
                  <div className="bg-white rounded-2xl p-6">
                    <h2 className="font-bold text-gray-900 mb-3 text-lg">Familiar Test Centres</h2>
                    <div className="flex flex-wrap gap-2">
                      {instructor.familiar_test_centres.map((c: string) => (
                        <span key={c} className="flex items-center gap-1.5 text-sm text-gray-700 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl">
                          <MapPin size={12} className="text-[#1A3CFF]" /> {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reviews */}
                <div className="bg-white rounded-2xl p-6">
                  <h2 className="font-bold text-gray-900 mb-5 text-lg">Student Reviews</h2>
                  {reviews && reviews.length > 0 ? (
                    <>
                      {/* Rating summary */}
                      <div className="flex items-start gap-6 mb-6 pb-6 border-b border-gray-100">
                        <div className="text-center flex-shrink-0">
                          <p className="text-5xl font-bold text-gray-900">{avg?.toFixed(1)}</p>
                          <div className="flex justify-center my-1.5">
                            {[1,2,3,4,5].map(s => (
                              <Star key={s} size={14} className={s <= Math.round(avg || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} />
                            ))}
                          </div>
                          <p className="text-xs text-gray-400">{reviews.length} reviews</p>
                        </div>
                        <div className="flex-1 space-y-1.5">
                          {[5,4,3,2,1].map(n => (
                            <div key={n} className="flex items-center gap-2">
                              <span className="text-xs text-gray-500 w-2 flex-shrink-0">{n}</span>
                              <Star size={10} className="text-yellow-400 fill-yellow-400 flex-shrink-0" />
                              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-yellow-400 rounded-full transition-all"
                                  style={{ width: reviews.length ? `${(distribution[n] / reviews.length) * 100}%` : '0%' }}
                                />
                              </div>
                              <span className="text-xs text-gray-400 w-4 flex-shrink-0">{distribution[n]}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Review list */}
                      <div className="space-y-4">
                        {reviews.slice(0, 5).map(r => (
                          <div key={r.id} className="border-b border-gray-50 last:border-0 pb-4 last:pb-0">
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div>
                                <p className="text-sm font-semibold text-gray-800">{r.reviewer_name}</p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <div className="flex">
                                    {[1,2,3,4,5].map(s => (
                                      <Star key={s} size={11} className={s <= r.rating_overall ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} />
                                    ))}
                                  </div>
                                  {r.pass_outcome && (
                                    <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded capitalize">
                                      {r.pass_outcome.replace(/_/g, ' ')}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <span className="text-xs text-gray-400 flex-shrink-0">
                                {new Date(r.created_at).toLocaleDateString('en-AU')}
                              </span>
                            </div>
                            {r.review_text && (
                              <p className="text-sm text-gray-600 leading-relaxed">{r.review_text}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-gray-400 text-center py-6">
                      No reviews yet. Be the first to review!
                    </p>
                  )}
                </div>

                {/* Leave a review */}
                <div className="bg-white rounded-2xl p-6">
                  <h2 className="font-bold text-gray-900 mb-4 text-lg">Leave a Review</h2>
                  <ReviewForm instructorId={instructor.id} instructorName={`${instructor.first_name} ${instructor.last_name}`} />
                </div>

              </div>

              {/* ── RIGHT COLUMN — sticky pricing ── */}
              <div className="lg:col-span-1">
                <div className="sticky top-20 space-y-4">

                  {/* Pricing card */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-3xl font-bold text-gray-900">${instructor.hourly_rate || '—'}</span>
                      <span className="text-gray-500 text-sm">/hr</span>
                    </div>

                    {packages.length > 0 && (
                      <div className="space-y-2 mb-5">
                        <div className="flex justify-between text-sm py-1.5 border-b border-gray-50">
                          <span className="text-gray-600">Single lesson</span>
                          <span className="font-semibold text-gray-900">${instructor.hourly_rate}</span>
                        </div>
                        {packages.map((p: any) => (
                          <div key={p.key} className="flex justify-between text-sm py-1.5 border-b border-gray-50 last:border-0">
                            <span className="text-gray-600">{p.label}</span>
                            <span className="font-semibold text-blue-700">${p.price}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="space-y-2.5">
                      {instructor.phone && (
                        <a href={`tel:${instructor.phone}`}
                          className="w-full flex items-center justify-center gap-2 bg-[#1A3CFF] text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors"
                        >
                          <Phone size={16} /> Call {instructor.first_name}
                        </a>
                      )}
                      {instructor.email && !instructor.email.includes('@example') && (
                        <a href={`mailto:${instructor.email}`}
                          className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-800 font-semibold py-3 rounded-xl hover:bg-gray-200 transition-colors"
                        >
                          <Mail size={16} /> Email {instructor.first_name}
                        </a>
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <ShareButton
                          url={`${process.env.NEXT_PUBLIC_APP_URL}/instructors/${suburb}/${slug}`}
                          name={`${instructor.first_name} ${instructor.last_name}`}
                      />
                      {!instructor.is_claimed && (
                        <Link href={`/claim/${instructor.id}`} className="text-xs text-gray-400 hover:text-gray-600">
                          Claim profile
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Quick facts */}
                  <div className="bg-white rounded-2xl p-5 border border-gray-100">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Quick Info</p>
                    <div className="space-y-2.5">
                      {instructor.lesson_duration_mins && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Lesson duration</span>
                          <span className="font-medium text-gray-800">{instructor.lesson_duration_mins} min</span>
                        </div>
                      )}
                      {instructor.notice_hours && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Booking notice</span>
                          <span className="font-medium text-gray-800">{instructor.notice_hours}h min</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Status</span>
                        <span className={`font-medium ${instructor.is_verified ? 'text-green-600' : 'text-gray-500'}`}>
                          {instructor.is_verified ? '✅ Verified' : 'Unclaimed'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* AI match prompt */}
                  <div className="bg-gradient-to-br from-purple-600 to-[#1A3CFF] rounded-2xl p-4">
                    <p className="text-white font-semibold text-sm mb-1 flex items-center gap-2">
                      <Sparkles size={14} /> Not sure this is the one?
                    </p>
                    <p className="text-white/70 text-xs mb-3">Let AI find your perfect match.</p>
                    <Link href="/find-my-instructor">
                      <button className="w-full bg-white text-purple-700 text-xs font-bold py-2 rounded-xl hover:bg-purple-50 transition-colors">
                        Try AI Match →
                      </button>
                    </Link>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </main>
        <Footer />
        <BottomNav />
      </div>
    </>
  )
}
