import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/clients/supabase-server'

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const { data, error } = await supabaseServer
    .from('instructors')
    .select('id, first_name, last_name, suburb, state, is_claimed, is_verified, slug')
    .eq('id', id)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Instructor not found' }, { status: 404 })
  }

  return NextResponse.json({ instructor: data })
}
