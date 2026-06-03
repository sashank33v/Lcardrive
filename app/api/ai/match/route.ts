import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { supabaseServer } from '@/lib/clients/supabase-server'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

// Robust fallback — always returns instructors even if suburb yields nothing
async function getFallback(suburb: string, budget: number, transmission: string) {
  const base = supabaseServer
    .from('instructors')
    .select('*')
    .order('is_verified',    { ascending: false })
    .order('average_rating', { ascending: false })
    .limit(3)

  // Try suburb + budget filter
  let query = base
  if (suburb)  query = (query as any).ilike('suburb', `%${suburb}%`)
  if (budget)  query = (query as any).lte('hourly_rate', budget)
  if (transmission && transmission !== 'both' && transmission !== 'either')
    query = (query as any).eq('transmission', transmission)

  const { data } = await query

  // Fallback 1: suburb + no other filters
  if (!data || data.length === 0) {
    const { data: d2 } = await supabaseServer
      .from('instructors')
      .select('*')
      .ilike('suburb', suburb ? `%${suburb}%` : '%Footscray%')
      .order('is_verified', { ascending: false })
      .limit(3)
    if (d2 && d2.length > 0) {
      return d2.map(i => ({ ...i, ai_reason: `Top-rated instructor in ${i.suburb} — great match for your learning style.` }))
    }
  }

  // Fallback 2: no filters at all — just top verified instructors
  if (!data || data.length === 0) {
    const { data: d3 } = await supabaseServer
      .from('instructors')
      .select('*')
      .eq('is_verified', true)
      .order('average_rating', { ascending: false })
      .limit(3)
    return (d3 || []).map(i => ({ ...i, ai_reason: `Highly rated verified instructor in ${i.suburb} — excellent for your needs.` }))
  }

  return data.map(i => ({
    ...i,
    ai_reason: `Strong match in ${i.suburb || suburb} for your preferences and budget.`,
  }))
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  const rl = await checkRateLimit(`ai_match:${ip}`, 10, 60)
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Too many requests. Try again in an hour.' }, { status: 429 })
  }

  let body: any
  try { body = await req.json() }
  catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }) }

  const { transmission = '', experience = '', preference = '', suburb = '', budget = 150 } = body

  // Try Gemini AI
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    // Fetch candidates from DB
    let candidateQuery = supabaseServer
      .from('instructors')
      .select('id,first_name,last_name,suburb,hourly_rate,transmission,specialises_anxiety,years_experience,average_rating,is_verified')
      .order('is_verified', { ascending: false })
      .limit(20)

    if (suburb)     candidateQuery = (candidateQuery as any).ilike('suburb', `%${suburb}%`)
    if (budget > 0) candidateQuery = (candidateQuery as any).lte('hourly_rate', budget)

    const { data: candidates } = await candidateQuery

    // If no candidates at all, go straight to fallback
    if (!candidates || candidates.length === 0) {
      const fallback = await getFallback(suburb, budget, transmission)
      return NextResponse.json({ instructors: fallback })
    }

    const prompt = `You are a driving instructor matching assistant for Melbourne, Australia.

Learner preferences:
- Transmission: ${transmission || 'any'}
- Experience: ${experience || 'beginner'}
- Teaching style: ${preference || 'no preference'}
- Suburb: ${suburb || 'Melbourne'}
- Max budget: $${budget}/hr

Available instructors:
${JSON.stringify(candidates.map(c => ({
  id: c.id,
  name:         `${c.first_name} ${c.last_name}`,
  suburb:       c.suburb,
  price:        c.hourly_rate,
  transmission: c.transmission,
  anxiety:      c.specialises_anxiety,
  years:        c.years_experience,
  rating:       c.average_rating,
  verified:     c.is_verified,
})), null, 0).slice(0, 3000)}

Return ONLY a raw JSON array (no markdown, no backticks) of the 3 best matching instructor IDs with a short personalised reason (max 15 words). Example:
[{"id":"abc-123","reason":"Patient verified instructor perfect for anxious beginners near you"},{"id":"def-456","reason":"Excellent manual instructor with 10 years experience in your area"}]`

    const aiResult = await model.generateContent(prompt)
    const text     = aiResult.response.text().trim()

    // Strip markdown backticks if present
    const clean = text.replace(/```json|```/g, '').trim()

    // Extract JSON array
    const jsonMatch = clean.match(/\[[\s\S]*\]/)
    if (!jsonMatch) throw new Error('No JSON array in AI response')

    const picks: Array<{ id: string; reason: string }> = JSON.parse(jsonMatch[0])
    if (!Array.isArray(picks) || picks.length === 0) throw new Error('Empty picks array')

    // Fetch full instructor data for picked IDs
    const { data: fullData } = await supabaseServer
      .from('instructors')
      .select('*')
      .in('id', picks.map(p => p.id))

    const enriched = picks
      .map(p => {
        const inst = fullData?.find(i => i.id === p.id)
        return inst ? { ...inst, ai_reason: p.reason } : null
      })
      .filter(Boolean)

    if (enriched.length === 0) throw new Error('No instructors found after enrichment')

    // Log usage (fire and forget)
     try {
         await supabaseServer.from('ai_usage')
         .insert({ feature: 'match', tokens_used: text.length })
     } catch {}

    return NextResponse.json({ instructors: enriched })

  } catch (err) {
    console.error('[AI Match] Gemini failed, using fallback:', err)
    const fallback = await getFallback(suburb, budget, transmission)
    return NextResponse.json({ instructors: fallback })
  }
}
