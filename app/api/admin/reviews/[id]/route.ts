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

  const { id }     = await params
  const { action } = await req.json()

  if (action === 'approve') {
    await supabaseServer
      .from('reviews')
      .update({ is_approved: true })
      .eq('id', id)
  } else {
    await supabaseServer
      .from('reviews')
      .delete()
      .eq('id', id)
  }

  return NextResponse.json({ success: true })
}
