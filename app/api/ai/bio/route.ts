import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { supabaseServer } from '@/lib/clients/supabase-server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Rate limit: 5 calls per day
  const { data: usage } = await supabaseServer.rpc('increment_bio_usage', { p_user: userId })
  if (usage?.bio_calls > 5) {
    return NextResponse.json({ error: 'Daily limit of 5 bio generations reached. Try again tomorrow.' }, { status: 429 })
  }

  const { years_experience, licence_types, teaching_style, learner_types, proud_of, specialisations } = await req.json()

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `Write a professional driving instructor bio for an Australian instructor.

Details:
- Years of experience: ${years_experience}
- Licence types taught: ${licence_types?.join(', ')}
- Teaching style: ${teaching_style}
- Types of learners: ${learner_types}
- Proud of: ${proud_of}
- Specialisations: ${specialisations || 'none'}

Write a warm, first-person bio in 3-4 sentences, max 120 words. Plain Australian English. Return ONLY the bio text.`

    const result = await model.generateContent(prompt)
    const bio    = result.response.text().trim()

    return NextResponse.json({ bio })
  } catch (err) {
    console.error('Bio writer error:', err)
    return NextResponse.json({ error: 'Could not generate bio right now. Please write your bio manually.' }, { status: 503 })
  }
}
