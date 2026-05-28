import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/clients/supabase'
import { ReviewSubmitSchema } from '@/lib/schemas/instructor.schema'

export async function POST(req: NextRequest) {
  try {
    const body   = await req.json()
    const parsed = ReviewSubmitSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 })

    const { error } = await supabaseServer.from('reviews').insert({
      ...parsed.data,
      is_approved: false,
    })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
