import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { supabaseServer } from '@/lib/clients/supabase-server'

function templateBio(data: any): string {
  const name          = data.first_name || 'I'
  const suburb        = data.suburb || 'Melbourne'
  const years         = data.years_experience ? `${data.years_experience} years of` : 'years of'
  const transmission  = data.transmission === 'auto'   ? 'automatic'
                      : data.transmission === 'manual' ? 'manual'
                      : 'automatic and manual'
  const anxiety       = data.specialises_anxiety ? ' I specialise in helping anxious learners build confidence at their own pace.' : ''
  const intl          = data.accepts_international ? ' I also welcome international licence holders looking to convert.' : ''

  return `Hi, I'm ${name}! I'm a professional driving instructor based in ${suburb} with ${years} experience teaching ${transmission} vehicle lessons. My teaching style is patient, structured and tailored to each learner's individual needs and goals — whether you're a complete beginner or preparing for your driving test.${anxiety}${intl} I look forward to helping you become a confident, safe driver.`
}

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  // Get instructor profile
  const { data: instructor } = await supabaseServer
    .from('instructors')
    .select('first_name, suburb, state, years_experience, transmission, specialises_anxiety, accepts_international, languages, vehicle_make, vehicle_model, familiar_test_centres')
    .eq('clerk_user_id', userId)
    .maybeSingle()

  if (!instructor) {
    return NextResponse.json(
      { error: 'No instructor profile found. Claim a listing first.' },
      { status: 404 }
    )
  }

  // Try Gemini AI
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const prompt = `Write a professional first-person bio for a driving instructor with these details:
- Name: ${instructor.first_name || 'The instructor'}
- Location: ${instructor.suburb || 'Melbourne'}, ${instructor.state || 'VIC'}, Australia
- Years experience: ${instructor.years_experience || 'several'}
- Transmission: ${instructor.transmission || 'automatic and manual'}
- Specialises in anxiety: ${instructor.specialises_anxiety ? 'Yes' : 'No'}
- Accepts international learners: ${instructor.accepts_international ? 'Yes' : 'No'}
- Languages: ${(instructor.languages || ['English']).join(', ')}
- Vehicle: ${instructor.vehicle_make ? `${instructor.vehicle_make} ${instructor.vehicle_model}` : 'modern vehicle'}
- Familiar test centres: ${(instructor.familiar_test_centres || []).join(', ') || 'local centres'}

Write a warm, professional 3-4 sentence bio in first person. Do NOT use quotation marks. Do NOT include a heading. Just the bio text directly.`

    const result = await model.generateContent(prompt)
    const bio    = result.response.text().trim()
      .replace(/^["']|["']$/g, '')   // remove surrounding quotes
      .replace(/^Bio:\s*/i, '')       // remove "Bio:" prefix if any
      .slice(0, 500)

    if (!bio || bio.length < 20) throw new Error('Bio too short')

    return NextResponse.json({ bio })

  } catch (err) {
    console.error('[AI Bio] Gemini failed, using template:', err)

    // Return a template bio so the user still gets something useful
    const bio = templateBio(instructor)
    return NextResponse.json({
      bio,
      note: 'AI unavailable — we generated a template bio you can customise.'
    })
  }
}
