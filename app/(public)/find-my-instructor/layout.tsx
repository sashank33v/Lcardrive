import type { Metadata } from 'next'

export const metadata: Metadata = {
  title:       'AI Instructor Match — Find Your Perfect Driving Instructor | LCarDrive',
  description: 'Answer 5 quick questions and our AI will match you with the perfect driving instructor for your learning style, suburb and budget.',
  openGraph: {
    title:       'AI Instructor Match | LCarDrive',
    description: 'Answer 5 questions and get AI-matched with your perfect driving instructor.',
    url:         'https://lcardrive.com.au/find-my-instructor',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
