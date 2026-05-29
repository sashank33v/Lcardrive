import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseServer } from '@/lib/clients/supabase-server'

export async function GET() {
  const { sessionClaims } = await auth()
  if (sessionClaims?.metadata?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { data } = await supabaseServer
    .from('instructors')
    .select('id, first_name, last_name, suburb, state, is_claimed, is_verified, profile_completeness, slug, created_at')
    .order('created_at', { ascending: false })

  return NextResponse.json({ instructors: data || [] })
}
