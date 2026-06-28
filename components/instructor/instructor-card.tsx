import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Star, CheckCircle, Car, Brain, Globe, Sparkles } from 'lucide-react'

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
  ai_reason?:             string | null
}

export function InstructorCard({
  slug, first_name, last_name, suburb, state,
  hourly_rate, average_rating, review_count = 0,
  transmission, is_verified, profile_photo_url,
  specialises_anxiety, accepts_international,
  years_experience, ai_reason,
}: Props) {
  const name       = `${first_name} ${last_name[0]}.`
  const initials   = `${first_name[0]}${last_name[0]}`.toUpperCase()
  const suburbSlug = suburb.toLowerCase().replace(/\s+/g, '-')
  const href       = `/instructors/${suburbSlug}/${slug}`

  return (
    <Link href={href} className="block group" aria-label={`View ${name}'s profile`}>
      <article className="bg-white rounded-2xl overflow-hidden border border-gray-100 group-hover:border-yellow-300 group-hover:shadow-sm transition-all p-4">

        {/* Top row — avatar + name + price */}
        <div className="flex items-center gap-3 mb-3">

          {/* Circular avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-[#FACC15]">
              {profile_photo_url ? (
                <Image
                  src={profile_photo_url}
                  alt={name}
                  width={56}
                  height={56}
                  className="object-cover w-full h-full"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-900">{initials}</span>
                </div>
              )}
            </div>
            {is_verified && (
              <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                <CheckCircle size={10} className="text-white" />
              </div>
            )}
          </div>

          {/* Name + location */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-base leading-tight">{name}</h3>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin size={11} className="text-gray-400 flex-shrink-0" />
              <span className="text-xs text-gray-500 truncate">
                {suburb}{state ? `, ${state}` : ''}
              </span>
              {years_experience && (
                <span className="ml-auto text-[10px] text-gray-400 flex-shrink-0">
                  {years_experience}+ yrs
                </span>
              )}
            </div>
          </div>

          {/* Price */}
          {hourly_rate && (
            <div className="flex-shrink-0 text-right">
              <p className="font-bold text-gray-900 text-base">${hourly_rate}</p>
              <p className="text-[10px] text-gray-400">/hr</p>
            </div>
          )}
        </div>

        {/* Rating */}
        {true && (
          <div className="flex items-center gap-1 mb-3">
            <Star size={12} className="text-[#FACC15] fill-[#FACC15]" />
            <span className="text-sm font-semibold text-gray-700">
              {average_rating ? Number(average_rating).toFixed(1) : "New"}
            </span>
            <span className="text-xs text-gray-400">({review_count > 0 ? `${review_count} reviews` : "No reviews yet"})</span>
          </div>
        )}
        )}

        {/* Tags */}
        <div className="flex gap-1.5 flex-wrap mb-3">
          {transmission && (
            <span className="inline-flex items-center gap-1 text-[11px] bg-yellow-50 text-yellow-700 border border-yellow-100 px-2.5 py-1 rounded-full font-medium">
              <Car size={10} /> {transmission.charAt(0).toUpperCase() + transmission.slice(1)}
            </span>
          )}
          {specialises_anxiety && (
            <span className="inline-flex items-center gap-1 text-[11px] bg-gray-50 text-gray-600 border border-gray-100 px-2.5 py-1 rounded-full font-medium">
              <Brain size={10} /> Anxiety-friendly
            </span>
          )}
          {accepts_international && (
            <span className="inline-flex items-center gap-1 text-[11px] bg-gray-50 text-gray-600 border border-gray-100 px-2.5 py-1 rounded-full font-medium">
              <Globe size={10} /> Intl.
            </span>
          )}
        </div>

        {/* AI reason */}
        {ai_reason && (
          <div className="bg-yellow-50 border border-yellow-100 rounded-xl px-3 py-2 flex items-start gap-2 mb-3">
            <Sparkles size={11} className="text-yellow-600 mt-0.5 flex-shrink-0" />
            <p className="text-[11px] text-yellow-800 leading-relaxed">{ai_reason}</p>
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
          <span className="text-[11px] text-gray-400">
            {is_verified ? '✅ VicRoads verified' : 'Unclaimed listing'}
          </span>
          <span className="text-xs font-semibold text-[#FACC15] group-hover:underline">
            View profile →
          </span>
        </div>

      </article>
    </Link>
  )
}
