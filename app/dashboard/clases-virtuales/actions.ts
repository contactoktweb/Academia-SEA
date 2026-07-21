'use server'

import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { Role } from "@prisma/client"

export async function getVirtualClasses() {
  const session = await auth()
  
  if (!session || !session.user) {
    return { error: "No autorizado" }
  }

  const userId = session.user.id
  const role = session.user.role as Role

  try {
    if (role === Role.ADMIN) {
      // Admin sees all virtual groups
      const groups = await prisma.group.findMany({
        where: {
          modality: 'VIRTUAL',
          isActive: true
        },
        include: {
          assignments: {
            include: {
              course: true,
              teacher: {
                include: { user: true }
              }
            }
          }
        }
      })
      return { groups }
    }

    if (role === Role.TEACHER) {
      const teacherProfile = await prisma.teacherProfile.findUnique({
        where: { userId }
      })
      if (!teacherProfile) return { error: "Perfil de profesor no encontrado" }

      const groups = await prisma.group.findMany({
        where: {
          modality: 'VIRTUAL',
          isActive: true,
          assignments: {
            some: {
              teacherId: teacherProfile.id
            }
          }
        },
        include: {
          assignments: {
            where: {
              teacherId: teacherProfile.id
            },
            include: {
              course: true
            }
          }
        }
      })
      return { groups }
    }

    if (role === Role.STUDENT) {
      const studentProfile = await prisma.studentProfile.findUnique({
        where: { userId }
      })
      if (!studentProfile) return { error: "Perfil de estudiante no encontrado" }

      const groups = await prisma.group.findMany({
        where: {
          modality: 'VIRTUAL',
          isActive: true,
          enrollments: {
            some: {
              studentId: studentProfile.id,
              status: 'ACTIVE'
            }
          }
        },
        include: {
          assignments: {
            include: {
              course: true,
              teacher: {
                include: { user: true }
              }
            }
          }
        }
      })
      return { groups }
    }

    return { groups: [] }
  } catch (error) {
    console.error("Error fetching virtual classes:", error)
    return { error: "Error al cargar las clases virtuales" }
  }
}
