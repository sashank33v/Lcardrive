import { notFound } from 'next/navigation'
import { MapPin, Star, CheckCircle, Brain, Globe, Clock, Car, Share2, Flag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { BottomNav } from '@/components/layout/bottom-nav'
import { ReviewForm } from '@/components/instructor/review-form'
import { getInstructorBySlug } from '@/lib/repos/instructors.repo'
import { supabaseServer } from '@/lib/clients/supabase-server'
import { ShareButton } from '@/components/instructor/share-button'

export const revalidate = 3600

interface Props {
  params: { suburb: string; slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const instructor = await getInstructorBySlug(params.slug)
  if (!instructor) return {}
  const name = `${instructor.first_name} ${instructor.last_name[0]}.`
  return {
    title: `${name} — Driving Instructor in ${instructor.suburb} | LCarDrive`,
    description: instructor.bio?.slice(0, 150) || `${name} is a driving instructor in ${instructor.suburb}.`,
  }
}

async function getApprovedReviews(instructorId: string) {
  const { data } = await supabaseServer
    .from('reviews')
    .select('*')
    .eq('instructor_id', instructorId)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })
  return data || []
}

function ContactBar({ hourlyRate, phone, email }: { hourlyRate: any; phone: any; email: any }) {
  const href = phone ? `tel:${phone}` : `mailto:${email}`
  const price = hourlyRate ? `$${hourlyRate}/hr` : 'Contact for pricing'
  return (
    <div className="fixed bottom-16 md:bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-40 shadow-lg">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">Starting from</p>
          <p className="font-bold text-lg text-gray-900">{price}</p>
        </div>
        <a href={href} className="bg-[#1A3CFF] text-white font-semibold px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors">Contact Instructor</a>
      </div>
    </div>
  )
}

export default async function ProfilePage({ params }: Props) {
  const instructor = await getInstructorBySlug(params.slug)
  if (!instructor) notFound()

  const reviews  = await getApprovedReviews(instructor.id)
  const name     = `${instructor.first_name} ${instructor.last_name[0]}.`
  const initials = `${instructor.first_name[0]}${instructor.last_name[0]}`.toUpperCase()

  const ratingBars = [
    { label: 'Patience',      val: instructor.avg_rating_patience      },
    { label: 'Communication', val: instructor.avg_rating_communication  },
    { label: 'Value',         val: instructor.avg_rating_value          },
    { label: 'Punctuality',   val: instructor.avg_rating_punctuality    },
    { label: 'Overall',       val: instructor.average_rating            },
  ]

  return (
    <div className="min-h-screen bg-[#F0F2FF]">
      <Header />

      <main className="max-w-3xl mx-auto pb-32">

        {/* Hero */}
        <div className="relative bg-gray-800 h-52 md:h-72 overflow-hidden">
          {instructor.profile_photo_url ? (
            <Image src={instructor.profile_photo_url} alt={name} fill className="object-cover opacity-70" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#1A3CFF] to-blue-800" />
          )}

         <ShareButton url={`/instructors/${params.suburb}/${params.slug}`} name={name} />

          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
            <div className="flex items-end gap-3">
              <div className="w-16 h-16 rounded-2xl bg-white overflow-hidden border-2 border-white flex-shrink-0 shadow-lg">
                {instructor.profile_photo_url ? (
                  <Image src={instructor.profile_photo_url} alt={name} width={64} height={64} className="object-cover w-full h-full" />
                ) : (
                  <div className="w-full h-full bg-[#1A3CFF] flex items-center justify-center">
                    <span className="text-white font-bold text-xl">{initials}</span>
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h1 className="text-white font-bold text-xl">{name}</h1>
                  {instructor.is_verified && (
                    <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
                      <CheckCircle size={10} /> VERIFIED
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <MapPin size={12} className="text-white/70" />
                    <span className="text-white/80 text-sm">{instructor.suburb}</span>
                  </div>
                  {instructor.average_rating && (
                    <div className="flex items-center gap-1">
                      <Star size={12} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-white font-bold text-sm">{Number(instructor.average_rating).toFixed(1)}</span>
                      <span className="text-white/70 text-xs">({instructor.review_count})</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 pt-5 space-y-4">

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {instructor.transmission && (
              <span className="flex items-center gap-1.5 text-sm px-3 py-1.5 bg-white rounded-full border border-gray-200 text-gray-700">
                <Car size={14} /> {instructor.transmission.charAt(0).toUpperCase() + instructor.transmission.slice(1)}
              </span>
            )}
            {instructor.years_experience && (
              <span className="flex items-center gap-1.5 text-sm px-3 py-1.5 bg-white rounded-full border border-gray-200 text-gray-700">
                <Clock size={14} /> {instructor.years_experience}+ Years Exp.
              </span>
            )}
            {instructor.specialises_anxiety && (
              <span className="flex items-center gap-1.5 text-sm px-3 py-1.5 bg-purple-50 rounded-full border border-purple-100 text-purple-700">
                <Brain size={14} /> Anxiety-Friendly
              </span>
            )}
            {instructor.accepts_international && (
              <span className="flex items-center gap-1.5 text-sm px-3 py-1.5 bg-blue-50 rounded-full border border-blue-100 text-blue-700">
                <Globe size={14} /> Intl. Licence
              </span>
            )}
          </div>

          {/* About */}
          {instructor.bio && (
            <div className="bg-white rounded-2xl p-5">
              <h2 className="font-bold text-gray-900 mb-3">About Me</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{instructor.bio}</p>
            </div>
          )}

          {/* Test Centres */}
          {instructor.familiar_test_centres?.length > 0 && (
            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-[#1A3CFF] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Local Test Route Expert</p>
                  <p className="text-gray-600 text-sm mt-0.5">Knows {instructor.familiar_test_centres.join(', ')} test routes.</p>
                </div>
              </div>
            </div>
          )}

          {/* Pricing */}
          {instructor.hourly_rate && (
            <div className="bg-white rounded-2xl p-5">
              <h2 className="font-bold text-gray-900 mb-3">Pricing</h2>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Per hour</span>
                <span className="font-bold text-2xl text-gray-900">${instructor.hourly_rate}</span>
              </div>
              {instructor.lesson_duration_mins && (
                <p className="text-xs text-gray-400">{instructor.lesson_duration_mins} min lessons</p>
              )}
              {Array.isArray(instructor.package_options) && instructor.package_options.length > 0 && (
                <div className="mt-3 space-y-2 border-t border-gray-100 pt-3">
                  <p className="text-sm font-semibold text-gray-700">Packages</p>
                  {instructor.package_options.map((pkg: any) => (
                    <div key={pkg.key} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{pkg.label}</span>
                      <span className="font-bold text-gray-900">${pkg.price}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Vehicle */}
          {instructor.vehicle_make && (
            <div className="bg-white rounded-2xl p-5">
              <h2 className="font-bold text-gray-900 mb-3">Vehicle</h2>
              <p className="text-gray-700 text-sm">
                {instructor.vehicle_year} {instructor.vehicle_make} {instructor.vehicle_model}
                {instructor.dual_controls && (
                  <span className="ml-2 text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">Dual Controls</span>
                )}
              </p>
            </div>
          )}

          {/* Languages */}
          {instructor.languages?.length > 0 && (
            <div className="bg-white rounded-2xl p-5">
              <h2 className="font-bold text-gray-900 mb-3">Languages</h2>
              <div className="flex flex-wrap gap-2">
                {instructor.languages.map((lang: string) => (
                  <span key={lang} className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">{lang}</span>
                ))}
              </div>
            </div>
          )}

          {/* Availability */}
          {instructor.availability_days?.length > 0 && (
            <div className="bg-white rounded-2xl p-5">
              <h2 className="font-bold text-gray-900 mb-3">Availability</h2>
              <div className="flex flex-wrap gap-2">
                {['mon','tue','wed','thu','fri','sat','sun'].map(day => {
                  const active = instructor.availability_days.includes(day)
                  return (
                    <span key={day} className={`text-sm px-3 py-1.5 rounded-full capitalize font-medium ${active ? 'bg-[#1A3CFF] text-white' : 'bg-gray-100 text-gray-400'}`}>
                      {day}
                    </span>
                  )
                })}
              </div>
            </div>
          )}

          {/* Rating Breakdown */}
          {instructor.review_count > 0 && (
            <div className="bg-white rounded-2xl p-5">
              <h2 className="font-bold text-gray-900 mb-4">Reviews ({instructor.review_count})</h2>
              <div className="space-y-2.5 mb-5">
                {ratingBars.map(({ label, val }) => val ? (
                  <div key={label} className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-24 flex-shrink-0">{label}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div className="bg-[#1A3CFF] h-2 rounded-full" style={{ width: `${(val / 5) * 100}%` }} />
                    </div>
                    <span className="text-xs font-bold text-gray-700 w-6">{Number(val).toFixed(1)}</span>
                  </div>
                ) : null)}
              </div>
              <div className="space-y-4">
                {reviews.slice(0, 5).map(r => (
                  <div key={r.id} className="border-t border-gray-100 pt-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm text-gray-900">{r.reviewer_name}</span>
                      <div className="flex items-center gap-0.5">
                        {[1,2,3,4,5].map(n => (
                          <Star key={n} size={12} className={n <= r.rating_overall ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} />
                        ))}
                      </div>
                    </div>
                    {r.pass_outcome && (
                      <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full mb-1 inline-block capitalize">
                        {r.pass_outcome.replace(/_/g, ' ')}
                      </span>
                    )}
                    {r.review_text && <p className="text-sm text-gray-600 mt-1">{r.review_text}</p>}
                    <p className="text-xs text-gray-400 mt-1">{new Date(r.created_at).toLocaleDateString('en-AU')}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Review Form */}
          <ReviewForm instructorId={instructor.id} instructorName={instructor.first_name} />

          {/* Report */}
          <div className="text-center pb-4">
            <button className="text-xs text-gray-400 flex items-center gap-1 mx-auto hover:text-gray-600 transition-colors">
              <Flag size={11} /> Report this listing
            </button>
          </div>

        </div>
      </main>

      {/* Contact bar — verified instructors */}
      {instructor.is_verified && (instructor.phone || instructor.email) && (
        <ContactBar hourlyRate={instructor.hourly_rate} phone={instructor.phone} email={instructor.email} />
      )}

      {/* Claim bar — unclaimed instructors */}
      {!instructor.is_verified && (
        <div className="fixed bottom-16 md:bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-40">
          <div className="max-w-3xl mx-auto">
            <Link href={`/claim/${instructor.id}`}>
              <button className="w-full bg-[#1A3CFF] text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors">
                Claim this profile
              </button>
            </Link>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
