import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from 'react-hot-toast'
import './globals.css'

export const viewport: Viewport = {
  width:        'device-width',
  initialScale: 1,
  themeColor:   '#1A3CFF',
}

export const metadata: Metadata = {
  title: {
    default:  'LCarDrive — Find a Driving Instructor',
    template: '%s | LCarDrive',
  },
  description: 'Find local, verified driving instructors across Melbourne. Compare prices, read reviews and contact instructors directly.',
  metadataBase: new URL('https://lcardrive.com.au'),
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider dynamic>
      <html lang="en" suppressHydrationWarning>
        <body className={GeistSans.className} suppressHydrationWarning>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background:   '#1A2444',
                color:        '#fff',
                borderRadius: '12px',
                fontSize:     '14px',
                fontWeight:   '500',
                padding:      '12px 16px',
              },
              success: {
                iconTheme: { primary: '#22C55E', secondary: '#fff' },
              },
              error: {
                iconTheme: { primary: '#EF4444', secondary: '#fff' },
              },
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  )
}
