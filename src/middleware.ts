import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_ROUTES = ['/login', '/register']

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('accessToken')?.value

  // Log for debugging (remove in production)
  console.log('[Middleware]', {
    pathname,
    hasToken: !!token,
    isPublicRoute: PUBLIC_ROUTES.some(route => pathname.startsWith(route))
  })

  // Check if route is public (no auth required)
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route))

  // If user has token and tries to access auth pages, redirect to home
  if (isPublicRoute && token) {
    console.log('[Middleware] Redirecting authenticated user from', pathname, 'to /')
    return NextResponse.redirect(new URL('/', request.url))
  }

  // // If user doesn't have token and tries to access protected routes, redirect to login
  // if (!isPublicRoute && !token) {
  //   console.log('[Middleware] Redirecting unauthenticated user from', pathname, 'to /login')
  //   const loginUrl = new URL('/login', request.url)
  //   loginUrl.searchParams.set('from', pathname)
  //   return NextResponse.redirect(loginUrl)
  // }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ]
}