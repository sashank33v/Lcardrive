import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseServer } from '@/lib/clients/supabase-server'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { data, error } = await supabaseServer
    .from('instructors')
    .select('*')
    .eq('clerk_user_id', userId)
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ instructor: data || null })
}

export async function PATCH(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { data: existing } = await supabaseServer
    .from('instructors')
    .select('id')
    .eq('clerk_user_id', userId)
    .maybeSingle()

  if (!existing) {
    return NextResponse.json(
      { error: 'No instructor profile found. Please claim a listing first.' },
      { status: 404 }
    )
  }

  let body: any
  try { body = await req.json() }
  catch { return NextResponse.json({ error: 'Invalid request body' }, { status: 400 }) }

  const str  = (v: any, max = 200) => typeof v === 'string' ? v.trim().slice(0, max) : null
  const num  = (v: any) => v !== undefined && v !== '' ? Number(v) : null
  const bool = (v: any) => typeof v === 'boolean' ? v : Boolean(v)

  const updates: Record<string, any> = {}

  if (body.first_name            !== undefined) updates.first_name             = str(body.first_name, 50)
  if (body.last_name             !== undefined) updates.last_name              = str(body.last_name, 50)
  if (body.phone                 !== undefined) updates.phone                  = str(body.phone, 20)
  if (body.email                 !== undefined) updates.email                  = str(body.email, 200)?.toLowerCase()
  if (body.bio                   !== undefined) updates.bio                    = str(body.bio, 1000)
  if (body.years_experience      !== undefined) updates.years_experience       = num(body.years_experience)
  if (body.transmission          !== undefined) updates.transmission           = body.transmission
  if (body.hourly_rate           !== undefined) updates.hourly_rate            = num(body.hourly_rate)
  if (body.lesson_duration_mins  !== undefined) updates.lesson_duration_mins   = num(body.lesson_duration_mins)
  if (body.vehicle_make          !== undefined) updates.vehicle_make           = str(body.vehicle_make, 50)
  if (body.vehicle_model         !== undefined) updates.vehicle_model          = str(body.vehicle_model, 50)
  if (body.vehicle_year          !== undefined) updates.vehicle_year           = num(body.vehicle_year)
  if (body.dual_controls         !== undefined) updates.dual_controls          = bool(body.dual_controls)
  if (body.specialises_anxiety   !== undefined) updates.specialises_anxiety    = bool(body.specialises_anxiety)
  if (body.accepts_international !== undefined) updates.accepts_international  = bool(body.accepts_international)
  if (body.languages             !== undefined) updates.languages              = body.languages
  if (body.package_options       !== undefined) updates.package_options        = body.package_options
  if (body.familiar_test_centres !== undefined) updates.familiar_test_centres  = body.familiar_test_centres
  if (body.service_areas         !== undefined) updates.service_areas          = body.service_areas
  if (body.availability_days     !== undefined) updates.availability_days      = body.availability_days
  if (body.availability_slots    !== undefined) updates.availability_slots     = body.availability_slots

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
  }

  const { error: updateError } = await supabaseServer
    .from('instructors')
    .update(updates)
    .eq('clerk_user_id', userId)

  if (updateError) {
    console.error('[Portal PATCH]', updateError)
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  const { data: updated } = await supabaseServer
    .from('instructors')
    .select('*')
    .eq('clerk_user_id', userId)
    .maybeSingle()

  return NextResponse.json({ instructor: updated })
}
