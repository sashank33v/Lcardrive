import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseServer } from '@/lib/clients/supabase-server'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authObj = await auth()
  const role    = authObj.sessionClaims?.metadata?.role ?? authObj.sessionClaims?.publicMetadata?.role
  if (role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id }                    = await params
  const { action, instructor_id } = await req.json()

  if (action === 'resolve' && instructor_id) {
    await supabaseServer
      .from('instructors')
      .update({ is_verified: false, is_claimed: false })
      .eq('id', instructor_id)
  }

  await supabaseServer
    .from('listing_flags')
    .update({ is_resolved: true, resolved_at: new Date().toISOString() })
    .eq('id', id)

  return NextResponse.json({ success: true })
}
