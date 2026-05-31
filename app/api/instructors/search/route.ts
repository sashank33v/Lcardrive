import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/clients/supabase-server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const suburb       = searchParams.get('suburb')       || ''
    const transmission = searchParams.get('transmission') || ''
    const max_price    = searchParams.get('max_price')    ? Number(searchParams.get('max_price')) : null
    const anxiety      = searchParams.get('anxiety')      === 'true'
    const intl         = searchParams.get('intl')         === 'true'
    const sort         = searchParams.get('sort')         || 'relevance'

    let query = supabaseServer
      .from('instructors')
      .select('id, slug, first_name, last_name, suburb, state, hourly_rate, average_rating, review_count, transmission, is_verified, is_claimed, profile_photo_url, specialises_anxiety, accepts_international, years_experience, profile_completeness', { count: 'exact' })

    if (suburb)       query = query.ilike('suburb', `%${suburb}%`)
    if (transmission) query = query.or(`transmission.eq.${transmission},transmission.eq.both`)
    if (max_price)    query = query.lte('hourly_rate', max_price)
    if (anxiety)      query = query.eq('specialises_anxiety', true)
    if (intl)         query = query.eq('accepts_international', true)

    switch (sort) {
      case 'price_asc': query = query.order('hourly_rate',          { ascending: true,  nullsFirst: false }); break
      case 'rating':    query = query.order('average_rating',       { ascending: false, nullsFirst: false }); break
      case 'newest':    query = query.order('created_at',           { ascending: false }); break
      default:          query = query.order('profile_completeness',  { ascending: false }); break
    }

    query = query.limit(50)

    const { data, count, error } = await query

    if (error) {
      return NextResponse.json({ instructors: [], total: 0, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ instructors: data || [], total: count || 0 })

  } catch (err: any) {
    return NextResponse.json({ instructors: [], total: 0, error: err.message }, { status: 500 })
  }
}
