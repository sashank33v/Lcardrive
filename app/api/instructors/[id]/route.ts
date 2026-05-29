import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/clients/supabase-server'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const { data } = await supabaseServer
    .from('instructors')
    .select('id, first_name, last_name, suburb, state, is_claimed, is_verified, slug')
    .eq('id', params.id)
    .single()

  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ instructor: data })
}
