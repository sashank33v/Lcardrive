import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseServer } from '@/lib/clients/supabase-server'
import { sendEmail } from '@/lib/emails/send'
import { claimReceivedEmail } from '@/lib/emails/templates'

// Validates Australian phone number
function isValidAustralianPhone(phone: string): boolean {
  const cleaned = phone.replace(/\s/g, '')
  return /^(\+61|0)[2-9]\d{8}$/.test(cleaned)
}

// Validates ADI format
function isValidADI(adi: string): boolean {
  return adi.trim().length >= 4 && adi.trim().length <= 20
}

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const { instructor_id, adi_registration } = body

    if (!instructor_id) {
      return NextResponse.json({ error: 'Missing instructor ID' }, { status: 400 })
    }
    if (!adi_registration?.trim()) {
      return NextResponse.json({ error: 'ADI registration number is required' }, { status: 400 })
    }
    if (!isValidADI(adi_registration)) {
      return NextResponse.json({ error: 'Invalid ADI registration format' }, { status: 400 })
    }

    // Check not already claimed
    const { data: existing } = await supabaseServer
      .from('instructors')
      .select('is_claimed, first_name, email')
      .eq('id', instructor_id)
      .single()

    if (!existing) {
      return NextResponse.json({ error: 'Instructor not found' }, { status: 404 })
    }
    if (existing.is_claimed) {
      return NextResponse.json({ error: 'This profile has already been claimed' }, { status: 409 })
    }

    // Check user hasn't already submitted a pending claim
    const { data: pendingClaim } = await supabaseServer
      .from('claims')
      .select('id')
      .eq('clerk_user_id', userId)
      .eq('status', 'pending')
      .maybeSingle()

    if (pendingClaim) {
      return NextResponse.json({ error: 'You already have a pending claim. Please wait for it to be reviewed.' }, { status: 409 })
    }

    // Create claim record
    await supabaseServer.from('claims').insert({
      instructor_id,
      clerk_user_id:   userId,
      adi_submitted:   adi_registration.trim().toUpperCase(),
      status:          'pending',
    })

    // Mark as claimed (pending verification)
    await supabaseServer
      .from('instructors')
      .update({ is_claimed: true, clerk_user_id: userId, adi_registration: adi_registration.trim().toUpperCase() })
      .eq('id', instructor_id)

    // Send confirmation email if instructor has email
    if (existing.email) {
      const template = claimReceivedEmail(existing.first_name)
      sendEmail(existing.email, template.subject, template.html)
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to submit claim. Please try again.' }, { status: 500 })
  }
}
