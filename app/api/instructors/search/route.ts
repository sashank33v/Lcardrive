import { NextRequest, NextResponse } from 'next/server'
import { searchInstructors } from '@/lib/repos/instructors.repo'
import { supabaseServer } from '@/lib/clients/supabase-server'

async function geocodeSuburb(suburb: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const { data } = await supabaseServer
      .from('instructors')
      .select('lat, lng, suburb')
      .ilike('suburb', suburb)
      .not('lat', 'is', null)
      .limit(1)
      .single()
    if (data?.lat && data?.lng) return { lat: data.lat, lng: data.lng }
    const apiKey = process.env.NEXT_PUBLIC_LOCATIONIQ_KEY
    if (!apiKey) return null
    const res   = await fetch(
      `https://us1.locationiq.com/v1/search?key=${apiKey}&q=${encodeURIComponent(suburb + ', Victoria, Australia')}&format=json&limit=1`,
      { next: { revalidate: 86400 } }
    )
    const data2 = await res.json()
    if (data2?.[0]?.lat && data2?.[0]?.lon) {
      return { lat: parseFloat(data2[0].lat), lng: parseFloat(data2[0].lon) }
    }
    return null
  } catch {
    return null
  }
}

export async function GET(req: NextRequest) {
  const sp              = req.nextUrl.searchParams
  const suburb          = sp.get('suburb')          ?? undefined
  const transmission    = sp.get('transmission')    ?? undefined
  const maxPriceStr     = sp.get('maxPrice')
  const maxPrice        = maxPriceStr ? Number(maxPriceStr) : undefined
  const anxietyFriendly = sp.get('anxietyFriendly') === '1'
  const international   = sp.get('international')   === '1'
  const radiusStr       = sp.get('radius')
  const radius          = radiusStr ? Number(radiusStr) : 10

  const transmissionFilter = (!transmission || transmission === 'both')
    ? undefined
    : transmission

  let lat: number | undefined
  let lng: number | undefined

  if (suburb) {
    const coords = await geocodeSuburb(suburb)
    if (coords) { lat = coords.lat; lng = coords.lng }
  }

  const result = await searchInstructors({
    suburb,
    transmission: transmissionFilter,
    max_price:    maxPrice,
    anxiety:      anxietyFriendly,
    intl:         international,
    radius:       lat && lng ? radius : undefined,
    lat,
    lng,
  })

  let instructors: any[] = result.data || []

  if (maxPrice && maxPrice > 0) {
    instructors = instructors.filter(i =>
      i.hourly_rate == null || Number(i.hourly_rate) <= maxPrice
    )
  }

  if (suburb) {
    try {
      await supabaseServer
        .from('search_logs')
        .insert({ suburb, results_count: instructors.length })
    } catch {}
  }

  return NextResponse.json({
    instructors,
    total:        instructors.length,
    radius_used:  lat && lng ? radius : null,
  })
}
