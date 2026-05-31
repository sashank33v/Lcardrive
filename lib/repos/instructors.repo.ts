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
}) {
  let query = supabaseServer
    .from('instructors')
    .select('id, slug, first_name, last_name, suburb, state, postcode, hourly_rate, average_rating, review_count, transmission, is_verified, is_claimed, profile_photo_url, specialises_anxiety, accepts_international, years_experience, profile_completeness, languages, availability_days', { count: 'exact' })

  if (params.suburb)       query = query.ilike('suburb', `%${params.suburb}%`)
  if (params.transmission) query = query.or(`transmission.eq.${params.transmission},transmission.eq.both`)
  if (params.max_price)    query = query.lte('hourly_rate', params.max_price)
  if (params.anxiety)      query = query.eq('specialises_anxiety', true)
  if (params.intl)         query = query.eq('accepts_international', true)

  switch (params.sort) {
    case 'price_asc': query = query.order('hourly_rate',         { ascending: true,  nullsFirst: false }); break
    case 'rating':    query = query.order('average_rating',      { ascending: false, nullsFirst: false }); break
    case 'newest':    query = query.order('created_at',          { ascending: false }); break
    default:          query = query.order('profile_completeness', { ascending: false }); break
  }

  query = query.range(params.offset || 0, (params.offset || 0) + (params.limit || 20) - 1)

  return query
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
