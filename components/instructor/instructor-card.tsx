import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Star, CheckCircle, Car, Brain, Globe } from 'lucide-react'

interface Props {
  id:                     string
  slug:                   string
  first_name:             string
  last_name:              string
  suburb:                 string
  state?:                 string
  hourly_rate?:           number | null
  average_rating?:        number | null
  review_count?:          number
  transmission?:          string | null
  is_verified?:           boolean
  is_claimed?:            boolean
  profile_photo_url?:     string | null
  specialises_anxiety?:   boolean
  accepts_international?: boolean
  years_experience?:      number | null
  profile_completeness?:  number
}

export function InstructorCard({
  slug, first_name, last_name, suburb, state,
  hourly_rate, average_rating, review_count = 0,
  transmission, is_verified, profile_photo_url,
  specialises_anxiety, accepts_international, years_experience,
}: Props) {
  const name       = `${first_name} ${last_name[0]}.`
  const initials   = `${first_name[0]}${last_name[0]}`.toUpperCase()
  const suburbSlug = suburb.toLowerCase().replace(/\s+/g, '-')
  const href       = `/instructors/${suburbSlug}/${slug}`

  return (
    <Link href={href} className="block group" aria-label={`View profile of ${name}, driving instructor in ${suburb}`}>
      <article className="bg-white rounded-2xl p-4 border border-transparent group-hover:border-gray-200 group-hover:shadow-sm transition-all">
        <div className="flex gap-3">

          {/* Avatar — fixed dimensions to prevent CLS */}
          <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-100 to-blue-200">
            {profile_photo_url ? (
              <Image
                src={profile_photo_url}
                alt={`${name} profile photo`}
                width={64}
                height={64}
                className="object-cover w-full h-full"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center" aria-hidden="true">
                <span className="font-bold text-[#1A3CFF] text-lg">{initials}</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="font-bold text-gray-900 text-sm truncate">{name}</h3>
                  {is_verified && (
                    <CheckCircle
                      size={14}
                      className="text-green-500 fill-green-500 flex-shrink-0"
                      aria-label="Verified instructor"
                    />
                  )}
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPin size={11} className="text-gray-400 flex-shrink-0" aria-hidden="true" />
                  <span className="text-xs text-gray-500 truncate">
                    {suburb}{state ? `, ${state}` : ''}
                  </span>
                </div>
              </div>

              {hourly_rate && (
                <div className="flex-shrink-0 text-right" aria-label={`$${hourly_rate} per hour`}>
                  <p className="font-bold text-gray-900 text-sm">${hourly_rate}</p>
                  <p className="text-xs text-gray-400">/hr</p>
                </div>
              )}
            </div>

            {/* Rating */}
            {average_rating && (
              <div
                className="flex items-center gap-1 mt-1.5"
                aria-label={`Rated ${Number(average_rating).toFixed(1)} out of 5 from ${review_count} reviews`}
              >
                <Star size={12} className="text-yellow-400 fill-yellow-400" aria-hidden="true" />
                <span className="text-xs font-semibold text-gray-700">{Number(average_rating).toFixed(1)}</span>
                <span className="text-xs text-gray-400">({review_count})</span>
              </div>
            )}

            {/* Tags */}
            <div className="flex gap-1.5 mt-2 flex-wrap" aria-label="Instructor specialisations">
              {transmission && (
                <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  <Car size={10} aria-hidden="true" />
                  {transmission.charAt(0).toUpperCase() + transmission.slice(1)}
                </span>
              )}
              {specialises_anxiety && (
                <span className="inline-flex items-center gap-1 text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">
                  <Brain size={10} aria-hidden="true" /> Anxiety
                </span>
              )}
              {accepts_international && (
                <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                  <Globe size={10} aria-hidden="true" /> Intl.
                </span>
              )}
              {years_experience && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  {years_experience}+ yrs
                </span>
              )}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
          <span className="text-xs text-gray-400">
            {is_verified ? '✅ Verified instructor' : 'Unverified listing'}
          </span>
          <span className="text-xs font-semibold text-[#1A3CFF] group-hover:underline" aria-hidden="true">
            View profile →
          </span>
        </div>
      </article>
    </Link>
  )
}
