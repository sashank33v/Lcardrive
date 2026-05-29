import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseServer } from '@/lib/clients/supabase-server'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { sessionClaims } = await auth()
  if (sessionClaims?.metadata?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { action } = await req.json()

  await supabaseServer
    .from('reviews')
    .update({ is_approved: action === 'approve' })
    .eq('id', params.id)

  return NextResponse.json({ success: true })
}
