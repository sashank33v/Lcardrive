import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseServer } from '@/lib/clients/supabase-server'

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { instructor_id, adi_registration } = await req.json()
  if (!instructor_id || !adi_registration) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  // Check not already claimed
  const { data: existing } = await supabaseServer
    .from('instructors').select('is_claimed').eq('id', instructor_id).single()

  if (existing?.is_claimed) {
    return NextResponse.json({ error: 'Already claimed' }, { status: 409 })
  }

  // Create claim record
  await supabaseServer.from('claims').insert({
    instructor_id, clerk_user_id: userId, adi_submitted: adi_registration, status: 'pending'
  })

  // Mark instructor as claimed (pending verification)
  await supabaseServer.from('instructors')
    .update({ is_claimed: true, clerk_user_id: userId, adi_registration })
    .eq('id', instructor_id)

  return NextResponse.json({ success: true })
}
