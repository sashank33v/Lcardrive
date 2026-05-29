import { MetadataRoute } from 'next'
import { supabaseServer } from '@/lib/clients/supabase-server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: instructors } = await supabaseServer
    .from('instructors')
    .select('slug, suburb, updated_at')

  const profiles = (instructors || []).map(i => ({
    url: `https://lcardrive.com.au/instructors/${i.suburb.toLowerCase().replace(/\s+/g, '-')}/${i.slug}`,
    lastModified: i.updated_at,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const suburbs = [...new Set((instructors || []).map(i =>
    i.suburb.toLowerCase().replace(/\s+/g, '-')
  ))]

  const suburbPages = suburbs.map(s => ({
    url: `https://lcardrive.com.au/search?suburb=${s}`,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [
    { url: 'https://lcardrive.com.au', priority: 1.0 },
    { url: 'https://lcardrive.com.au/search', priority: 0.9 },
    { url: 'https://lcardrive.com.au/find-my-instructor', priority: 0.7 },
    ...suburbPages,
    ...profiles,
  ]
}
