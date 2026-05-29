import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseServer } from '@/lib/clients/supabase-server'

export async function GET() {
  const { sessionClaims } = await auth()
  if (sessionClaims?.metadata?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { data } = await supabaseServer
    .from('claims')
    .select('*, instructors(first_name, last_name, suburb, slug)')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  return NextResponse.json({ claims: data || [] })
}
