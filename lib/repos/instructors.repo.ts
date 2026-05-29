import { supabaseServer } from '@/lib/clients/supabase-server'
import type { SearchQuery } from '@/lib/schemas/instructor.schema'

export async function searchInstructors(query: SearchQuery) {
  const PAGE_SIZE = 20
  let q = supabaseServer.from('instructors').select('*', { count: 'exact' })

  if (query.suburb)       q = q.ilike('suburb', `%${query.suburb}%`)
  if (query.transmission) q = q.eq('transmission', query.transmission)
  if (query.max_price)    q = q.lte('hourly_rate', query.max_price)
  if (query.anxiety)      q = q.eq('specialises_anxiety', true)
  if (query.intl)         q = q.eq('accepts_international', true)

  switch (query.sort) {
    case 'price_asc': q = q.order('hourly_rate',          { ascending: true  }); break
    case 'rating':    q = q.order('average_rating',       { ascending: false }); break
    case 'newest':    q = q.order('created_at',           { ascending: false }); break
    default:          q = q.order('profile_completeness', { ascending: false })
  }

  const from = ((query.page ?? 1) - 1) * PAGE_SIZE
  const { data, count, error } = await q.range(from, from + PAGE_SIZE - 1)
  if (error) throw error
  return { instructors: data ?? [], total: count ?? 0 }
}

export async function getInstructorBySlug(slug: string) {
  const { data, error } = await supabaseServer
    .from('instructors').select('*').eq('slug', slug).single()
  if (error) return null
  return data
}

export async function getAllSlugs() {
  const { data } = await supabaseServer
    .from('instructors').select('slug, suburb')
  return data ?? []
}
