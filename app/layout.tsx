import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LCarDrive — Find a Driving Instructor Near You',
  description: 'Find local, verified driving instructors across Melbourne.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider dynamic>
      <html lang="en" suppressHydrationWarning>
        <body className={geist.className} suppressHydrationWarning>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
