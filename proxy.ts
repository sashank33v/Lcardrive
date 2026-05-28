import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPortalRoute = createRouteMatcher(['/portal(.*)', '/api/portal(.*)'])
const isAdminRoute  = createRouteMatcher(['/admin(.*)',  '/api/admin(.*)'])

export default clerkMiddleware(async (auth, req) => {
  if (isPortalRoute(req)) {
    await auth.protect()
  }

  if (isAdminRoute(req)) {
    await auth.protect()
    const { sessionClaims } = await auth()
    if (sessionClaims?.metadata?.role !== 'admin') {
      return new NextResponse(null, { status: 404 })
    }
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
