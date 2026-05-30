import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { supabaseServer } from '@/lib/clients/supabase-server'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

async function getInstructors(suburb: string, transmission: string, maxRate: number) {
  let query = supabaseServer
    .from('instructors')
    .select('id, first_name, last_name, suburb, state, hourly_rate, transmission, specialises_anxiety, accepts_international, average_rating, review_count, years_experience, slug, is_verified, is_claimed, profile_photo_url, profile_completeness')
    .order('profile_completeness', { ascending: false })
    .limit(20)

  if (suburb)       query = query.ilike('suburb', `%${suburb}%`)
  if (transmission && transmission !== 'any') query = query.eq('transmission', transmission)
  if (maxRate && maxRate < 150) query = query.lte('hourly_rate', maxRate)

  const { data, error } = await query
  if (error) console.error('DB error:', error)
  return data || []
}

export async function POST(req: NextRequest) {
  // Parse body ONCE at the top
  let body: any = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ matches: [], fallback: true })
  }

  const {
    suburb         = '',
    transmission   = 'auto',
    special_needs  = [],
    available_days = [],
    max_hourly_rate = 150,
  } = body

  // Rate limit: 10 AI match requests per hour per IP
  const ip    = getClientIp(req as any)
  const limit = await checkRateLimit(`ai-match:${ip}`, 10, 60)

  if (!limit.allowed) {
    // Rate limited — skip AI, return top 3 from DB directly
    const instructors = await getInstructors(suburb, transmission, max_hourly_rate)
    if (instructors.length === 0) return NextResponse.json({ matches: [], fallback: true })
    const top3 = instructors.slice(0, 3).map(i => ({
      ...i,
      ai_reason: `Top rated instructor in ${i.suburb}.`
    }))
    return NextResponse.json({ matches: top3, fallback: false })
  }

  // Step 1: Always fetch instructors from DB first
  const instructors = await getInstructors(suburb, transmission, max_hourly_rate)

  console.log(`Found ${instructors.length} instructors for suburb: ${suburb}`)

  if (instructors.length === 0) {
    return NextResponse.json({ matches: [], fallback: true })
  }

  // Step 2: Try Gemini AI matching
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const sanitised = instructors.slice(0, 20).map(i => ({
      id:                    i.id,
      first_name:            i.first_name,
      suburb:                i.suburb,
      hourly_rate:           i.hourly_rate,
      transmission:          i.transmission,
      specialises_anxiety:   i.specialises_anxiety,
      accepts_international: i.accepts_international,
      average_rating:        i.average_rating,
      years_experience:      i.years_experience,
    }))

    const prompt = `You are a driving instructor matching assistant for Australia.

Learner preferences:
- Suburb: ${suburb || 'any'}
- Transmission: ${transmission || 'any'}
- Special needs: ${special_needs.join(', ') || 'none'}
- Available days: ${available_days.join(', ') || 'flexible'}
- Max hourly rate: $${max_hourly_rate}/hr

Available instructors (JSON):
${JSON.stringify(sanitised)}

Pick the top 3 best matches. Return ONLY this JSON (no other text):
{"matches":[{"id":"<id>","reason":"<max 15 words>"},{"id":"<id>","reason":"<max 15 words>"},{"id":"<id>","reason":"<max 15 words>"}]}`

    const result  = await model.generateContent(prompt)
    const text    = result.response.text().trim()
    const clean   = text.replace(/```json|```/g, '').trim()
    const parsed  = JSON.parse(clean)

    const enriched = (parsed.matches || [])
      .map((m: any) => {
        const inst = instructors.find(i => i.id === m.id)
        return inst ? { ...inst, ai_reason: m.reason } : null
      })
      .filter(Boolean)

    if (enriched.length > 0) {
      console.log(`AI matched ${enriched.length} instructors`)
      return NextResponse.json({ matches: enriched, fallback: false })
    }

    throw new Error('No valid AI matches')

  } catch (err) {
    console.error('AI failed, using top 3 fallback:', err)

    // Step 3: Always return top 3 from DB if AI fails
    const top3 = instructors.slice(0, 3).map(i => ({
      ...i,
      ai_reason: `Highly rated instructor in ${i.suburb} with ${i.years_experience || 'several'} years experience.`
    }))

    return NextResponse.json({ matches: top3, fallback: false })
  }
}
