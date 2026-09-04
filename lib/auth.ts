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

        // Si es profesor y aún no está aprobado, verificar si ya tiene cursos asignados para activarlo automáticamente
        let isApproved = user.isApproved;
        if (user.role === 'TEACHER' && !isApproved && user.teacherProfile?.id) {
          const coursesCount = await db.courseAssignment.count({
            where: { teacherId: user.teacherProfile.id },
          });
          if (coursesCount > 0) {
            await db.user.update({
              where: { id: user.id },
              data: { isApproved: true, isActive: true },
            });
            isApproved = true;
          }
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.photoUrl,
          sede: sede,
          isApproved,
        }
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, trigger, session }) {
      token = await authConfig.callbacks.jwt({ token, user, trigger, session });

      // Si es profesor y aún no está aprobado en el token, verificar si ya tiene cursos asignados
      if (token?.id && token?.role === 'TEACHER' && !token?.isApproved) {
        try {
          const teacherUser = await db.user.findUnique({
            where: { id: token.id as string },
            include: {
              teacherProfile: {
                include: {
                  courses: { take: 1 },
                },
              },
            },
          });

          if (teacherUser?.isApproved || (teacherUser?.teacherProfile?.courses?.length || 0) > 0) {
            if (!teacherUser?.isApproved) {
              await db.user.update({
                where: { id: teacherUser!.id },
                data: { isApproved: true, isActive: true },
              });
            }
            token.isApproved = true;
          }
        } catch (err) {
          console.error("Error auto-activating teacher in jwt callback:", err);
        }
      }

      return token;
    },
    async session({ session, token }: any) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as any;
        session.user.sede = token.sede as string;
        session.user.isApproved = Boolean(token.isApproved);
      }
      return session;
    },
  },
})