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
        email: { label: 'Correo o Matrícula', type: 'text' },
        password: { label: 'Contraseña', type: 'password' },
        sede: { label: 'Sede', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password || !credentials?.sede) {
          return null
        }

        const identifier = (credentials.email as string).trim()
        const password = credentials.password as string
        const sede = credentials.sede as string

        // Buscar usuarios coincidentes por email o por studentId (matrícula de hermano)
        const users = await db.user.findMany({
          where: {
            OR: [
              { email: identifier },
              { studentProfile: { studentId: identifier } },
            ],
            isActive: true,
          },
          include: { teacherProfile: true, studentProfile: true },
        })

        if (!users || users.length === 0) {
          return null
        }

        // Encontrar el usuario cuya contraseña sea válida
        let matchingUser = null
        for (const u of users) {
          const isPasswordValid = await bcrypt.compare(password, u.password)
          if (isPasswordValid) {
            matchingUser = u
            break
          }
        }

        if (!matchingUser) {
          return null
        }

        const user = matchingUser

        // Verify Sede: ADMIN can access any sede, otherwise user must belong to the selected sede
        if (user.role !== 'ADMIN' && user.sede !== (sede as any)) {
          throw new Error("AccessDenied")
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
          isApproved: user.isApproved,
        }
      },
    }),
  ],
})