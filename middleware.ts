import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { nextUrl } = req

  // Redirect to login if not logged in and trying to access dashboard
  if (!isLoggedIn && nextUrl.pathname.startsWith('/dashboard') && nextUrl.pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', nextUrl))
  }

  // Redirect to dashboard if logged in and trying to access login
  if (isLoggedIn && nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
