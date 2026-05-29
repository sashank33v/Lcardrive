import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseServer } from '@/lib/clients/supabase-server'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { sessionClaims } = await auth()
  if (sessionClaims?.metadata?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { action, instructor_id } = await req.json()

  if (action === 'approve') {
    await supabaseServer.from('instructors').update({ is_verified: true }).eq('id', instructor_id)
    await supabaseServer.from('claims').update({ status: 'approved', reviewed_at: new Date().toISOString() }).eq('id', params.id)
  } else {
    await supabaseServer.from('instructors').update({ is_claimed: false, clerk_user_id: null }).eq('id', instructor_id)
    await supabaseServer.from('claims').update({ status: 'rejected', reviewed_at: new Date().toISOString() }).eq('id', params.id)
  }

  return NextResponse.json({ success: true })
}
