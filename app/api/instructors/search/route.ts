import { NextRequest, NextResponse } from 'next/server'
import { searchInstructors } from '@/lib/repos/instructors.repo'
import { supabaseServer } from '@/lib/clients/supabase-server'

export async function GET(req: NextRequest) {
  const sp              = req.nextUrl.searchParams
  const suburb          = sp.get('suburb')          || undefined
  const transmission    = sp.get('transmission')    || undefined
  const maxPriceStr     = sp.get('maxPrice')
  const maxPrice        = maxPriceStr ? Number(maxPriceStr) : undefined
  const anxietyFriendly = sp.get('anxietyFriendly') === '1'
  const international   = sp.get('international')   === '1'

  // Don't filter by transmission when 'both' is selected — show all
  const transmissionFilter = (!transmission || transmission === 'both')
    ? undefined
    : transmission

  const result = await searchInstructors({
    suburb,
    transmission: transmissionFilter,
    maxPrice,
    anxietyFriendly,
    international,
  })

  let instructors: any[] = result.data || []

  // Defensive client-side maxPrice filter in case DB query doesn't apply it
  if (maxPrice && maxPrice > 0) {
    instructors = instructors.filter(i =>
      i.hourly_rate == null || Number(i.hourly_rate) <= maxPrice
    )
  }

  // Log search
  if (suburb) {
    supabaseServer
      .from('search_logs')
      .insert({ suburb, results_count: instructors.length })
      .then(() => {})
      .catch(() => {})
  }

  return NextResponse.json({
    instructors,
    total: instructors.length,
  })
}
