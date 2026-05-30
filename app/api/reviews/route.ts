import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/clients/supabase-server'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'
import { sendEmail } from '@/lib/emails/send'
import { reviewConfirmationEmail } from '@/lib/emails/templates'

export async function POST(req: NextRequest) {
  // Rate limit: 3 reviews per IP per 24 hours
  const ip    = getClientIp(req)
  const limit = await checkRateLimit(`review:${ip}`, 3, 1440)

  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Too many reviews submitted. Please try again tomorrow.' },
      { status: 429 }
    )
  }

  try {
    const body = await req.json()

    // Validate required fields
    if (!body.instructor_id)  return NextResponse.json({ error: 'Missing instructor' }, { status: 400 })
    if (!body.reviewer_name?.trim()) return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    if (!body.reviewer_email?.trim()) return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    if (!body.rating_overall) return NextResponse.json({ error: 'Overall rating is required' }, { status: 400 })
    if (!body.pass_outcome)   return NextResponse.json({ error: 'Please select your test outcome' }, { status: 400 })

    // Sanitise text
    const sanitised = {
      instructor_id:        body.instructor_id,
      reviewer_name:        body.reviewer_name.trim().slice(0, 100),
      reviewer_email:       body.reviewer_email.trim().toLowerCase().slice(0, 200),
      rating_overall:       Math.min(5, Math.max(1, parseInt(body.rating_overall))),
      rating_patience:      body.rating_patience ? Math.min(5, Math.max(1, parseInt(body.rating_patience))) : null,
      rating_communication: body.rating_communication ? Math.min(5, Math.max(1, parseInt(body.rating_communication))) : null,
      rating_value:         body.rating_value ? Math.min(5, Math.max(1, parseInt(body.rating_value))) : null,
      rating_punctuality:   body.rating_punctuality ? Math.min(5, Math.max(1, parseInt(body.rating_punctuality))) : null,
      pass_outcome:         body.pass_outcome,
      review_text:          body.review_text?.trim().slice(0, 1000) || null,
      is_approved:          false,
    }

    // Get instructor name for email
    const { data: instructor } = await supabaseServer
      .from('instructors')
      .select('first_name')
      .eq('id', body.instructor_id)
      .single()

    const { error } = await supabaseServer.from('reviews').insert(sanitised)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Send confirmation email (don't await — fire and forget)
    const instructorName = instructor?.first_name || 'this instructor'
    sendEmail(
      sanitised.reviewer_email,
      reviewConfirmationEmail(sanitised.reviewer_name, instructorName).subject,
      reviewConfirmationEmail(sanitised.reviewer_name, instructorName).html
    )

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 })
  }
}
