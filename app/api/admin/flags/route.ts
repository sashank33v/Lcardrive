import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseServer } from '@/lib/clients/supabase-server'

export async function GET() {
  const authObj = await auth()
  const role    = authObj.sessionClaims?.metadata?.role ?? authObj.sessionClaims?.publicMetadata?.role
  if (role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { data } = await supabaseServer
    .from('listing_flags')
    .select('*, instructor:instructors(id, first_name, last_name, suburb, slug)')
    .eq('is_resolved', false)
    .order('created_at', { ascending: false })

  return NextResponse.json({ flags: data || [] })
}
