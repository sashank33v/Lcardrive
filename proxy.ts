import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPortalRoute = createRouteMatcher(['/portal(.*)', '/api/portal(.*)'])
const isAdminRoute  = createRouteMatcher(['/admin(.*)',  '/api/admin(.*)'])

export default clerkMiddleware((auth, req) => {
  // Portal: any logged-in user
  if (isPortalRoute(req)) {
    auth().protect()
  }

  // Admin: must have admin role
  if (isAdminRoute(req)) {
    auth().protect()
    const { sessionClaims } = auth()
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
