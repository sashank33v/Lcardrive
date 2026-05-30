import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseServer } from '@/lib/clients/supabase-server'
import sharp from 'sharp'

const MAX_SIZE = 2 * 1024 * 1024 // 2MB
const ALLOWED  = ['image/jpeg', 'image/png', 'image/webp']

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const formData = await req.formData()
    const file     = formData.get('photo') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate MIME type (server-side, not just extension)
    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json({ error: 'Only JPEG, PNG, or WebP images allowed' }, { status: 400 })
    }

    // Validate size
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'Image must be under 2MB' }, { status: 400 })
    }

    // Get the instructor record
    const { data: instructor } = await supabaseServer
      .from('instructors')
      .select('id')
      .eq('clerk_user_id', userId)
      .single()

    if (!instructor) {
      return NextResponse.json({ error: 'No instructor profile found. Claim a listing first.' }, { status: 404 })
    }

    // Resize + compress to 400x400 WebP
    const buffer    = Buffer.from(await file.arrayBuffer())
    const optimised = await sharp(buffer)
      .resize(400, 400, { fit: 'cover', position: 'center' })
      .webp({ quality: 85 })
      .toBuffer()

    // Upload to Supabase Storage
    const fileName = `${instructor.id}-${Date.now()}.webp`
    const { error: uploadError } = await supabaseServer.storage
      .from('instructor-photos')
      .upload(fileName, optimised, {
        contentType: 'image/webp',
        upsert: true,
      })

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseServer.storage
      .from('instructor-photos')
      .getPublicUrl(fileName)

    // Save URL to instructor record
    await supabaseServer
      .from('instructors')
      .update({ profile_photo_url: publicUrl })
      .eq('id', instructor.id)

    return NextResponse.json({ url: publicUrl })

  } catch (err: any) {
    console.error('Photo upload error:', err)
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 })
  }
}
