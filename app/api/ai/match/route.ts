import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { supabaseServer } from '@/lib/clients/supabase-server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: NextRequest) {
  try {
    const { suburb, transmission, special_needs, available_days, max_hourly_rate } = await req.json()

    // Fetch top 20 instructors from DB — never trust client data
    let query = supabaseServer.from('instructors').select('id, first_name, last_name, suburb, hourly_rate, transmission, specialises_anxiety, accepts_international, average_rating, review_count, years_experience, familiar_test_centres, languages').limit(20)

    if (suburb)       query = query.ilike('suburb', `%${suburb}%`)
    if (transmission && transmission !== 'any') query = query.eq('transmission', transmission)
    if (max_hourly_rate) query = query.lte('hourly_rate', max_hourly_rate)

    const { data: instructors } = await query

    if (!instructors || instructors.length === 0) {
      return NextResponse.json({ matches: [], fallback: true })
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `You are a driving instructor matching assistant for Australia.

Learner preferences:
- Suburb: ${suburb}
- Transmission: ${transmission}
- Special needs: ${special_needs?.join(', ') || 'none'}
- Available days: ${available_days?.join(', ') || 'flexible'}
- Max hourly rate: $${max_hourly_rate}/hr

Available instructors:
${JSON.stringify(instructors, null, 2)}

Return the top 3 best-matched instructor IDs with a short reason (max 20 words each).
Respond ONLY with valid JSON: {"matches": [{"id": "...", "reason": "..."}]}`

    const result = await model.generateContent(prompt)
    const text   = result.response.text().trim()

    // Clean and parse response
    const clean   = text.replace(/```json|```/g, '').trim()
    const parsed  = JSON.parse(clean)

    return NextResponse.json(parsed)
  } catch (err) {
    console.error('AI match error:', err)
    return NextResponse.json({ matches: [], fallback: true })
  }
}
