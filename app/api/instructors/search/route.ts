import { supabaseServer } from '@/lib/clients/supabase-server'

export async function searchInstructors(params: {
  suburb?:       string
  transmission?: string
  max_price?:    number
  anxiety?:      boolean
  intl?:         boolean
  sort?:         string
  limit?:        number
  offset?:       number
  radius?:       number   // km radius for geographic search
  lat?:          number   // latitude of searched suburb
  lng?:          number   // longitude of searched suburb
}) {
  // ── If we have lat/lng + radius, use geographic ordering ──
  if (params.lat && params.lng && params.radius) {
    return searchByRadius(params)
  }

  // ── Fallback: text-based suburb search ──
  let query = supabaseServer
    .from('instructors')
    .select(
      'id, slug, first_name, last_name, suburb, state, postcode, hourly_rate, average_rating, review_count, transmission, is_verified, is_claimed, profile_photo_url, specialises_anxiety, accepts_international, years_experience, profile_completeness, languages, availability_days',
      { count: 'exact' }
    )

  if (params.suburb)       query = query.ilike('suburb', `%${params.suburb}%`)
  if (params.transmission) query = query.or(`transmission.eq.${params.transmission},transmission.eq.both`)
  if (params.max_price)    query = query.lte('hourly_rate', params.max_price)
  if (params.anxiety)      query = query.eq('specialises_anxiety', true)
  if (params.intl)         query = query.eq('accepts_international', true)

  switch (params.sort) {
    case 'price_asc': query = query.order('hourly_rate',          { ascending: true,  nullsFirst: false }); break
    case 'rating':    query = query.order('average_rating',       { ascending: false, nullsFirst: false }); break
    case 'newest':    query = query.order('created_at',           { ascending: false }); break
    default:          query = query.order('profile_completeness',  { ascending: false }); break
  }

  query = query.range(params.offset || 0, (params.offset || 0) + (params.limit || 20) - 1)
  return query
}

// ── Geographic radius search with exact-suburb-first ordering ──
async function searchByRadius(params: {
  suburb?:       string
  transmission?: string
  max_price?:    number
  anxiety?:      boolean
  intl?:         boolean
  limit?:        number
  offset?:       number
  radius?:       number
  lat?:          number
  lng?:          number
}) {
  const radiusMeters = (params.radius || 10) * 1000
  const lat          = params.lat!
  const lng          = params.lng!

  // Earth radius in meters for distance calculation
  // Using Supabase RPC with earthdistance or manual haversine via SQL
  let query = supabaseServer
    .from('instructors')
    .select(
      'id, slug, first_name, last_name, suburb, state, postcode, hourly_rate, average_rating, review_count, transmission, is_verified, is_claimed, profile_photo_url, specialises_anxiety, accepts_international, years_experience, profile_completeness, languages, availability_days, lat, lng',
      { count: 'exact' }
    )
    .not('lat', 'is', null)
    .not('lng', 'is', null)

  if (params.transmission) query = query.or(`transmission.eq.${params.transmission},transmission.eq.both`)
  if (params.max_price)    query = query.lte('hourly_rate', params.max_price)
  if (params.anxiety)      query = query.eq('specialises_anxiety', true)
  if (params.intl)         query = query.eq('accepts_international', true)

  const { data, error, count } = await query.limit(200)

  if (error || !data) return { data: [], count: 0, error }

  // ── Calculate distance and filter by radius ──
  const withDistance = data
    .map(i => {
      const dlat  = ((i.lat  - lat)  * Math.PI) / 180
      const dlng  = ((i.lng  - lng) * Math.PI) / 180
      const a     =
        Math.sin(dlat / 2) * Math.sin(dlat / 2) +
        Math.cos((lat * Math.PI) / 180) *
          Math.cos((i.lat * Math.PI) / 180) *
          Math.sin(dlng / 2) * Math.sin(dlng / 2)
      const c            = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      const distanceKm   = 6371 * c
      const isExactMatch = i.suburb?.toLowerCase() === params.suburb?.toLowerCase()
      return { ...i, distance_km: Math.round(distanceKm * 10) / 10, is_exact_match: isExactMatch }
    })
    .filter(i => i.distance_km <= (params.radius || 10))

  // ── Sort: exact suburb first, then by distance ascending ──
  withDistance.sort((a, b) => {
    if (a.is_exact_match && !b.is_exact_match) return -1
    if (!a.is_exact_match && b.is_exact_match) return 1
    return a.distance_km - b.distance_km
  })

  const offset     = params.offset || 0
  const limit      = params.limit  || 20
  const paginated  = withDistance.slice(offset, offset + limit)

  return { data: paginated, count: withDistance.length, error: null }
}

export async function getInstructorBySlug(slug: string) {
  const { data } = await supabaseServer
    .from('instructors')
    .select('*')
    .eq('slug', slug)
    .single()
  return data
}

export async function getAllSlugs() {
  const { data } = await supabaseServer
    .from('instructors')
    .select('slug, suburb')
    .not('slug', 'is', null)
  return (data || []).map(i => ({
    slug:   i.slug as string,
    suburb: i.suburb.toLowerCase().replace(/\s+/g, '-'),
  }))
}
