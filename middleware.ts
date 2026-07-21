import NextAuth from 'next-auth'
import { authConfig } from '@/lib/auth.config'
import { NextResponse } from 'next/server'

const { auth } = NextAuth(authConfig)

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

  // Restrict unapproved users
  const isApproved = req.auth?.user?.isApproved;
  if (
    isLoggedIn && 
    isApproved === false && 
    nextUrl.pathname.startsWith('/dashboard') && 
    !nextUrl.pathname.startsWith('/dashboard/configuracion')
  ) {
    return NextResponse.redirect(new URL('/dashboard/configuracion', nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
