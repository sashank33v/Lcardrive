import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseServer } from '@/lib/clients/supabase-server'
import { sanitiseText, isValidPhone, isValidEmail, isValidHourlyRate } from '@/lib/validation'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data } = await supabaseServer
    .from('instructors')
    .select('*')
    .eq('clerk_user_id', userId)
    .single()

  return NextResponse.json({ instructor: data || null })
}

export async function PATCH(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()

  // Validate and sanitise fields
  const errors: string[] = []

  if (body.phone && !isValidPhone(body.phone)) {
    errors.push('Invalid Australian phone number (e.g. 0412 345 678)')
  }
  if (body.email && !isValidEmail(body.email)) {
    errors.push('Invalid email address')
  }
  if (body.hourly_rate && !isValidHourlyRate(Number(body.hourly_rate))) {
    errors.push('Hourly rate must be between $30 and $300')
  }

  if (errors.length > 0) {
    return NextResponse.json({ error: errors.join('. ') }, { status: 400 })
  }

  // Sanitise text fields
  const sanitised: any = { ...body }
  if (body.bio)          sanitised.bio          = sanitiseText(body.bio, 500)
  if (body.first_name)   sanitised.first_name   = sanitiseText(body.first_name, 50)
  if (body.last_name)    sanitised.last_name    = sanitiseText(body.last_name, 50)

  // Strip fields that should never be updated via portal
  delete sanitised.id
  delete sanitised.clerk_user_id
  delete sanitised.is_verified
  delete sanitised.is_claimed
  delete sanitised.created_at
  delete sanitised.slug

  const { data, error } = await supabaseServer
    .from('instructors')
    .update(sanitised)
    .eq('clerk_user_id', userId)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ instructor: data })
}
