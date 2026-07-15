import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { authConfig } from './auth.config'

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Correo electrónico', type: 'email' },
        password: { label: 'Contraseña', type: 'password' },
        sede: { label: 'Sede', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password || !credentials?.sede) {
          return null
        }

        const email = credentials.email as string
        const password = credentials.password as string
        const sede = credentials.sede as string

        const user = await db.user.findUnique({
          where: { email },
          include: { teacherProfile: true, studentProfile: true },
        })

        if (!user || !user.isActive) {
          return null
        }

        // Verify Sede: ADMIN can access any sede, otherwise user must belong to the selected sede
        if (user.role !== 'ADMIN' && user.sede !== sede) {
          throw new Error("AccessDenied")
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
          return null
        }

        // Log the login activity
        await db.activityLog.create({
          data: {
            userId: user.id,
            action: 'LOGIN',
            entity: 'User',
            entityId: user.id,
            details: { sede },
          },
        })

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.photoUrl,
          sede: sede,
        }
      },
    }),
  ],
})