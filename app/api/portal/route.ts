import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseServer } from '@/lib/clients/supabase-server'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabaseServer
    .from('instructors')
    .select('*')
    .eq('clerk_user_id', userId)
    .single()

  if (error) return NextResponse.json({ instructor: null })
  return NextResponse.json({ instructor: data })
}

export async function PATCH(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()

  // Remove fields that should never be updated by instructor
  delete body.id
  delete body.clerk_user_id
  delete body.is_verified
  delete body.is_claimed
  delete body.created_at

  const { data, error } = await supabaseServer
    .from('instructors')
    .update(body)
    .eq('clerk_user_id', userId)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ instructor: data })
}
