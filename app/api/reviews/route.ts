import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/clients/supabase-server'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'
import { sendEmail } from '@/lib/emails/send'
import { reviewConfirmationEmail } from '@/lib/emails/templates'
import { sanitiseText, isValidEmail } from '@/lib/validation'

export async function POST(req: NextRequest) {
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

    // Strict validation
    if (!body.instructor_id || typeof body.instructor_id !== 'string') {
      return NextResponse.json({ error: 'Invalid instructor' }, { status: 400 })
    }
    if (!body.reviewer_name?.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }
    if (!body.reviewer_email?.trim() || !isValidEmail(body.reviewer_email)) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }
    if (!body.rating_overall || body.rating_overall < 1 || body.rating_overall > 5) {
      return NextResponse.json({ error: 'Overall rating must be 1-5' }, { status: 400 })
    }
    if (!body.pass_outcome) {
      return NextResponse.json({ error: 'Please select your test outcome' }, { status: 400 })
    }

    const VALID_OUTCOMES = ['first_attempt', 'multiple', 'still_learning', 'not_tested']
    if (!VALID_OUTCOMES.includes(body.pass_outcome)) {
      return NextResponse.json({ error: 'Invalid pass outcome' }, { status: 400 })
    }

    // Verify instructor exists
    const { data: instructor } = await supabaseServer
      .from('instructors')
      .select('id, first_name')
      .eq('id', body.instructor_id)
      .single()

    if (!instructor) {
      return NextResponse.json({ error: 'Instructor not found' }, { status: 404 })
    }

    const sanitised = {
      instructor_id:        body.instructor_id,
      reviewer_name:        sanitiseText(body.reviewer_name, 100),
      reviewer_email:       body.reviewer_email.trim().toLowerCase().slice(0, 200),
      rating_overall:       Math.min(5, Math.max(1, parseInt(body.rating_overall))),
      rating_patience:      body.rating_patience      ? Math.min(5, Math.max(1, parseInt(body.rating_patience)))      : null,
      rating_communication: body.rating_communication ? Math.min(5, Math.max(1, parseInt(body.rating_communication))) : null,
      rating_value:         body.rating_value         ? Math.min(5, Math.max(1, parseInt(body.rating_value)))         : null,
      rating_punctuality:   body.rating_punctuality   ? Math.min(5, Math.max(1, parseInt(body.rating_punctuality)))   : null,
      pass_outcome:         body.pass_outcome,
      review_text:          body.review_text ? sanitiseText(body.review_text, 1000) : null,
      is_approved:          false,
    }

    const { error } = await supabaseServer.from('reviews').insert(sanitised)
    if (error) return NextResponse.json({ error: 'Failed to save review' }, { status: 500 })

    // Fire-and-forget email
    sendEmail(
      sanitised.reviewer_email,
      reviewConfirmationEmail(sanitised.reviewer_name, instructor.first_name).subject,
      reviewConfirmationEmail(sanitised.reviewer_name, instructor.first_name).html
    ).catch(() => {})

    return NextResponse.json({ success: true })

  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
