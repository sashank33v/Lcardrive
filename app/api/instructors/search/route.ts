import { NextRequest, NextResponse } from 'next/server'
import { SearchQuerySchema } from '@/lib/schemas/instructor.schema'
import { searchInstructors } from '@/lib/repos/instructors.repo'
import { supabaseServer } from '@/lib/clients/supabase'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const parsed = SearchQuerySchema.safeParse({
      suburb:       searchParams.get('suburb')       ?? undefined,
      transmission: searchParams.get('transmission') ?? undefined,
      max_price:    searchParams.get('max_price')    ?? undefined,
      anxiety:      searchParams.get('anxiety')      ?? undefined,
      intl:         searchParams.get('intl')         ?? undefined,
      sort:         searchParams.get('sort')         ?? undefined,
      page:         searchParams.get('page')         ?? undefined,
    })

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid query', details: parsed.error.flatten() }, { status: 400 })
    }

    const result = await searchInstructors(parsed.data)

    await supabaseServer.from('search_logs').insert({
      suburb:          parsed.data.suburb,
      filters_applied: parsed.data,
      results_count:   result.total,
    })

    return NextResponse.json(result)
  } catch (err) {
    console.error('Search error:', err)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
