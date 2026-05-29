import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseServer } from '@/lib/clients/supabase-server'
import { parse } from 'csv-parse/sync'
import melbourneSuburbs from '@/data/melbourne-suburbs.json'

function createSlug(firstName: string, lastName: string, suburb: string): string {
  return `${firstName}-${lastName[0]}-${suburb}`
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

function getCoords(suburb: string): { lat: number; lng: number } | null {
  const match = (melbourneSuburbs as any[]).find(
    s => s.suburb.toLowerCase() === suburb.toLowerCase()
  )
  return match ? { lat: match.lat, lng: match.lng } : null
}

export async function POST(req: NextRequest) {
  const authObj = await auth()
  const role = authObj.sessionClaims?.metadata?.role
               ?? authObj.sessionClaims?.publicMetadata?.role

  if (role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const formData = await req.formData()
    const file     = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const text    = await file.text()
    const records = parse(text, {
      columns:           true,
      skip_empty_lines:  true,
      trim:              true,
    })

    let imported = 0
    const errors: string[] = []
    const skippedRows: string[] = []

    for (const [i, row] of (records as any[]).entries()) {
      const rowNum = i + 2

      try {
        // Validate required fields
        if (!row.first_name?.trim()) {
          errors.push(`Row ${rowNum}: Missing first_name`)
          continue
        }
        if (!row.last_name?.trim()) {
          errors.push(`Row ${rowNum}: Missing last_name`)
          continue
        }
        if (!row.suburb?.trim()) {
          errors.push(`Row ${rowNum}: Missing suburb`)
          continue
        }

        // Check for duplicate
        const { data: existing } = await supabaseServer
          .from('instructors')
          .select('id')
          .eq('first_name', row.first_name.trim())
          .eq('last_name', row.last_name.trim())
          .eq('suburb', row.suburb.trim())
          .maybeSingle()

        if (existing) {
          skippedRows.push(`Row ${rowNum}: ${row.first_name} ${row.last_name} in ${row.suburb} already exists`)
          continue
        }

        // Get coordinates from static data
        const coords = getCoords(row.suburb.trim())

        // Build slug
        const baseSlug = createSlug(row.first_name.trim(), row.last_name.trim(), row.suburb.trim())

        // Ensure unique slug
        let slug = baseSlug
        let counter = 1
        while (true) {
          const { data: slugExists } = await supabaseServer
            .from('instructors').select('id').eq('slug', slug).maybeSingle()
          if (!slugExists) break
          slug = `${baseSlug}-${counter++}`
        }

        // Parse licence types
        const licenceTypes = row.licence_types
          ? row.licence_types.split(',').map((s: string) => s.trim()).filter(Boolean)
          : ['car']

        // Validate transmission
        const validTransmissions = ['auto', 'manual', 'both']
        const transmission = validTransmissions.includes(row.transmission?.toLowerCase())
          ? row.transmission.toLowerCase()
          : null

        // Insert the instructor
        const { error: insertError } = await supabaseServer
          .from('instructors')
          .insert({
            slug,
            first_name:       row.first_name.trim(),
            last_name:        row.last_name.trim(),
            suburb:           row.suburb.trim(),
            postcode:         row.postcode?.trim() || null,
            state:            row.state?.trim() || 'VIC',
            phone:            row.phone?.trim() || null,
            email:            row.email?.trim() || null,
            adi_registration: row.adi_registration?.trim() || null,
            licence_types:    licenceTypes,
            transmission,
            hourly_rate:      row.hourly_rate ? parseFloat(row.hourly_rate) : null,
            lat:              coords?.lat || null,
            lng:              coords?.lng || null,
            is_claimed:       false,
            is_verified:      false,
          })

        if (insertError) {
          errors.push(`Row ${rowNum}: ${insertError.message}`)
          continue
        }

        imported++

      } catch (err: any) {
        errors.push(`Row ${rowNum}: ${err.message}`)
      }
    }

    return NextResponse.json({
      imported,
      skipped:  skippedRows.length,
      errors:   [...skippedRows, ...errors],
    })

  } catch (err: any) {
    return NextResponse.json({ error: `Failed to parse CSV: ${err.message}` }, { status: 500 })
  }
}
