import Link from 'next/link'
import { MapPin, Star, CheckCircle, Brain, Globe } from 'lucide-react'
import Image from 'next/image'

interface InstructorCardProps {
  id: string
  slug: string
  first_name: string
  last_name: string
  suburb: string
  hourly_rate: number | null
  average_rating: number | null
  review_count: number
  transmission: string | null
  is_verified: boolean
  is_claimed: boolean
  profile_photo_url: string | null
  specialises_anxiety: boolean
  accepts_international: boolean
  distance_km?: number
}

export function InstructorCard({
  slug, first_name, last_name, suburb,
  hourly_rate, average_rating, review_count,
  transmission, is_verified, profile_photo_url,
  specialises_anxiety, accepts_international,
  distance_km
}: InstructorCardProps) {

  const initials = `${first_name[0]}${last_name[0]}`.toUpperCase()
  const displayName = `${first_name} ${last_name[0]}.`
  const suburbSlug = suburb.toLowerCase().replace(/\s+/g, '-')

  return (
    <Link href={`/instructors/${suburbSlug}/${slug}`}>
      <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-transparent hover:border-blue-100">

        <div className="flex gap-3">
          {/* Photo */}
          <div className="flex-shrink-0 relative">
            {profile_photo_url ? (
              <Image
                src={profile_photo_url}
                alt={displayName}
                width={72}
                height={72}
                className="w-18 h-18 rounded-xl object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-[#1A3CFF] flex items-center justify-center">
                <span className="text-white font-bold text-lg">{initials}</span>
              </div>
            )}
            {/* Rating badge */}
            {average_rating && (
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full px-1.5 py-0.5 flex items-center gap-0.5 shadow-sm border border-gray-100">
                <Star size={10} className="text-yellow-400 fill-yellow-400" />
                <span className="text-xs font-bold text-gray-800">{average_rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-gray-900 text-base truncate">{displayName}</h3>
              {hourly_rate && (
                <span className="text-base font-bold text-gray-900 flex-shrink-0">
                  ${hourly_rate}<span className="text-xs text-gray-400 font-normal">/hr</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 text-gray-500 text-xs mt-0.5 mb-2">
              <MapPin size={11} />
              <span>{suburb}{distance_km ? ` (${distance_km.toFixed(1)}km)` : ''}</span>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-1.5">
              {transmission && (
                <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full font-medium uppercase">
                  {transmission}
                </span>
              )}
              {is_verified && (
                <span className="text-xs px-2 py-0.5 bg-green-50 text-green-700 rounded-full font-medium flex items-center gap-1">
                  <CheckCircle size={10} />Verified
                </span>
              )}
              {specialises_anxiety && (
                <span className="text-xs px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full font-medium flex items-center gap-1">
                  <Brain size={10} />Anxiety-friendly
                </span>
              )}
              {accepts_international && (
                <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full font-medium flex items-center gap-1">
                  <Globe size={10} />Intl. licence
                </span>
              )}
            </div>

            {/* Review count */}
            {review_count > 0 && (
              <p className="text-xs text-gray-400 mt-1.5">
                {review_count} review{review_count !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
