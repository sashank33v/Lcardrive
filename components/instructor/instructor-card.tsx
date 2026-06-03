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

const GRAD = ['from-blue-600 to-blue-800','from-indigo-600 to-indigo-800','from-teal-600 to-teal-800','from-violet-600 to-violet-800']

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
  const grad       = GRAD[(first_name.charCodeAt(0) + last_name.charCodeAt(0)) % GRAD.length]

  return (
    <Link href={href} className="block group" aria-label={`View ${name}'s profile`}>
      <article className="bg-white rounded-2xl overflow-hidden border border-gray-100 group-hover:border-gray-200 group-hover:shadow-md transition-all">

        {/* Photo header */}
        <div className="relative h-40 overflow-hidden">
          {profile_photo_url ? (
            <Image src={profile_photo_url} alt={name} fill className="object-cover" loading="lazy" />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${grad} flex items-center justify-center`}>
              <span className="text-4xl font-bold text-white/80">{initials}</span>
            </div>
          )}

          {/* Overlays */}
          {is_verified && (
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
              <CheckCircle size={10} />
              Verified
            </div>
          )}
          {average_rating && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              <Star size={11} className="text-yellow-400 fill-yellow-400" />
              {Number(average_rating).toFixed(1)}
              <span className="text-white/60">({review_count})</span>
            </div>
          )}
        </div>

        {/* Card body */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-bold text-gray-900 text-base leading-tight">{name}</h3>
            {hourly_rate && (
              <div className="flex-shrink-0 text-right">
                <p className="font-bold text-[#1A3CFF] text-base">${hourly_rate}</p>
                <p className="text-[10px] text-gray-400">/hr</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 mb-3">
            <MapPin size={11} className="text-gray-400 flex-shrink-0" />
            <span className="text-xs text-gray-500 truncate">{suburb}{state ? `, ${state}` : ''}</span>
            {years_experience && (
              <span className="ml-auto text-[10px] text-gray-400 flex-shrink-0">{years_experience}+ yrs</span>
            )}
          </div>

          {/* Tags */}
          <div className="flex gap-1.5 flex-wrap mb-3">
            {transmission && (
              <span className="inline-flex items-center gap-1 text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                <Car size={10} /> {transmission.charAt(0).toUpperCase() + transmission.slice(1)}
              </span>
            )}
            {specialises_anxiety && (
              <span className="inline-flex items-center gap-1 text-[11px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                <Brain size={10} /> Anxiety-friendly
              </span>
            )}
            {accepts_international && (
              <span className="inline-flex items-center gap-1 text-[11px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                <Globe size={10} /> Intl.
              </span>
            )}
          </div>

          {/* AI reason */}
          {ai_reason && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 flex items-start gap-2 mb-3">
              <Sparkles size={11} className="text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-[11px] text-blue-700 leading-relaxed">{ai_reason}</p>
            </div>
          )}

          <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
            <span className="text-[11px] text-gray-400">
              {is_verified ? '✅ VicRoads verified' : 'Unclaimed listing'}
            </span>
            <span className="text-xs font-semibold text-[#1A3CFF] group-hover:underline">
              View profile →
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
