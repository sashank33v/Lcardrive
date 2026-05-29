import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseServer } from '@/lib/clients/supabase-server'

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const authObj = await auth()
  const role = authObj.sessionClaims?.metadata?.role
               ?? authObj.sessionClaims?.publicMetadata?.role

  if (role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { error } = await supabaseServer
    .from('instructors')
    .delete()
    .eq('id', params.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
