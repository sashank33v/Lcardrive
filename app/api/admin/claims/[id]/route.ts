import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseServer } from '@/lib/clients/supabase-server'
import { sendEmail } from '@/lib/emails/send'
import { claimApprovedEmail, claimRejectedEmail } from '@/lib/emails/templates'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authObj = await auth()
  const role    = authObj.sessionClaims?.metadata?.role ?? authObj.sessionClaims?.publicMetadata?.role
  if (role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { action, instructor_id, reason } = await req.json()

  // Get instructor details for email
  const { data: instructor } = await supabaseServer
    .from('instructors')
    .select('first_name, email')
    .eq('id', instructor_id)
    .single()

  if (action === 'approve') {
    await supabaseServer
      .from('instructors')
      .update({ is_verified: true })
      .eq('id', instructor_id)

    await supabaseServer
      .from('claims')
      .update({ status: 'approved', reviewed_at: new Date().toISOString() })
      .eq('id', params.id)

    // Send approval email
    if (instructor?.email) {
      const template = claimApprovedEmail(instructor.first_name)
      sendEmail(instructor.email, template.subject, template.html)
    }

  } else {
    await supabaseServer
      .from('instructors')
      .update({ is_claimed: false, clerk_user_id: null })
      .eq('id', instructor_id)

    await supabaseServer
      .from('claims')
      .update({ status: 'rejected', reviewed_at: new Date().toISOString() })
      .eq('id', params.id)

    // Send rejection email
    if (instructor?.email) {
      const template = claimRejectedEmail(instructor.first_name, reason)
      sendEmail(instructor.email, template.subject, template.html)
    }
  }

  return NextResponse.json({ success: true })
}
