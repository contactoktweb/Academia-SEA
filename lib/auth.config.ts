import type { NextAuthConfig } from 'next-auth'
import { Role } from '@prisma/client'

export const authConfig = {
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
        token.sede = (user as any).sede
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as Role
        session.user.sede = token.sede as string
      }
      return session
    },
  },
  providers: [], // Providers are added in the main auth.ts file
  session: {
    strategy: 'jwt',
  },
} satisfies NextAuthConfig
