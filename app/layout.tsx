import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LCarDrive — Find a Driving Instructor Near You',
  description: 'Find local, verified driving instructors across Melbourne. Compare prices, read reviews, and contact instructors directly.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={geist.className}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
