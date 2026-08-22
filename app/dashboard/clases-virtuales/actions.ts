'use server'

import { db as prisma } from "@/lib/db"
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
        where: { userId },
        include: {
          payments: true,
          user: true,
        }
      })
      if (!studentProfile) return { error: "Perfil de estudiante no encontrado" }

      const hasPaidAtLeastOne = studentProfile.payments.some((p) => p.status === "PAID");
      const isPaidAndActive = studentProfile.user.isActive && studentProfile.isActive && (hasPaidAtLeastOne || studentProfile.payments.length === 0);

      if (!isPaidAndActive) {
        return { 
          groups: [], 
          isPaymentRequired: true,
          error: "Para acceder a tus clases virtuales en vivo, debes completar el pago de tu inscripción o colegiatura en Mis Pagos." 
        }
      }

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

export async function getGroupStudents(groupId: string) {
  try {
    const enrollments = await prisma.studentEnrollment.findMany({
      where: {
        groupId,
        status: 'ACTIVE'
      },
      include: {
        student: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                photoUrl: true
              }
            }
          }
        }
      }
    })

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    
    const todayEnd = new Date()
    todayEnd.setHours(23, 59, 59, 999)

    // Fetch attendance for these students today
    const studentIds = enrollments.map(e => e.student.id)
    const attendances = await prisma.attendance.findMany({
      where: {
        studentId: { in: studentIds },
        date: {
          gte: todayStart,
          lte: todayEnd
        }
      }
    })

    const students = enrollments.map(e => {
      const attendance = attendances.find(a => a.studentId === e.student.id)
      return {
        profileId: e.student.id,
        userId: e.student.user.id,
        name: e.student.user.name,
        email: e.student.user.email,
        photoUrl: e.student.user.photoUrl,
        attendanceStatus: attendance?.status || null
      }
    })

    return { success: true, students }
  } catch (error) {
    console.error("Error fetching group students:", error)
    return { success: false, error: "Error al cargar alumnos del grupo" }
  }
}

export async function scheduleNextClass(groupId: string, nextClassAt: Date, topic?: string) {
  try {
    const session = await auth()
    if (!session || !session.user || (session.user.role !== 'TEACHER' && session.user.role !== 'ADMIN')) {
      return { success: false, error: "No autorizado" }
    }

    if (session.user.role === 'TEACHER') {
      const teacherProfile = await prisma.teacherProfile.findUnique({
        where: { userId: session.user.id }
      })
      if (!teacherProfile) return { success: false, error: "Perfil de profesor no encontrado" }

      const assignment = await prisma.courseAssignment.findFirst({
        where: { groupId, teacherId: teacherProfile.id }
      })
      if (!assignment) return { success: false, error: "No estás asignado a este grupo" }
    }

    const group = await prisma.group.update({
      where: { id: groupId },
      data: { 
        nextClassAt,
        nextClassTopic: topic || null
      }
    })

    return { success: true, group }
  } catch (error) {
    console.error("Error scheduling next class:", error)
    return { success: false, error: "Error al agendar la próxima clase" }
  }
}
