import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseServer } from '@/lib/clients/supabase-server'

export async function GET() {
  const { sessionClaims } = await auth()
  if (sessionClaims?.metadata?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const [total, pending_claims, pending_reviews, flags] = await Promise.all([
    supabaseServer.from('instructors').select('*', { count: 'exact', head: true }),
    supabaseServer.from('claims').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabaseServer.from('reviews').select('*', { count: 'exact', head: true }).eq('is_approved', false),
    supabaseServer.from('listing_flags').select('*', { count: 'exact', head: true }).eq('is_resolved', false),
  ])

  return NextResponse.json({
    total:           total.count ?? 0,
    pending_claims:  pending_claims.count ?? 0,
    pending_reviews: pending_reviews.count ?? 0,
    flags:           flags.count ?? 0,
  })
}
