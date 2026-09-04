"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export async function recordAttendance(data: {
  studentId: string;
  date: string;
  status: string;
  courseAssignmentId?: string;
  notes?: string;
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "No autenticado" };
    }

    // Regla de negocio: solo se suben inasistencias o retardos (no asistencias)
    if (data.status === "PRESENT") {
      return { success: false, error: "Solo se registran inasistencias o retardos. La asistencia es automática." };
    }

    const date = new Date(data.date);

    // Obtener teacherId si el usuario conectado es profesor
    let teacherId: string | undefined = undefined;
    if (session.user.role === "TEACHER") {
      const teacherProfile = await db.teacherProfile.findUnique({
        where: { userId: session.user.id },
      });
      if (teacherProfile) {
        teacherId = teacherProfile.id;
      }
    }

    const existing = await db.attendance.findFirst({
      where: {
        studentId: data.studentId,
        date: date,
        courseAssignmentId: data.courseAssignmentId || null,
      },
    });

    let attendance;
    if (existing) {
      attendance = await db.attendance.update({
        where: { id: existing.id },
        data: {
          status: data.status,
          notes: data.notes,
          ...(teacherId ? { teacherId } : {}),
        },
      });
    } else {
      attendance = await db.attendance.create({
        data: {
          studentId: data.studentId,
          date: date,
          status: data.status,
          courseAssignmentId: data.courseAssignmentId,
          teacherId: teacherId,
          notes: data.notes,
        },
      });
    }

    revalidatePath("/dashboard/asistencia");
    return { success: true, data: attendance };
  } catch (error: any) {
    console.error("Error recording attendance:", error);
    return { success: false, error: error.message || "Error al registrar la inasistencia" };
  }
}

export async function deleteAttendance(id: string) {
  try {
    // Al eliminar la inasistencia, el alumno vuelve a su estado normal de asistencia
    await db.attendance.delete({
      where: { id },
    });

    revalidatePath("/dashboard/asistencia");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting attendance:", error);
    return { success: false, error: error.message || "Error al eliminar la inasistencia" };
  }
}

export async function getStudentsForAttendance() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "No autenticado" };
    }

    const userRole = session.user.role;
    const userId = session.user.id;
    const sede = (session.user as any)?.sede || "SEAAUTLAN";

    let students;
    if (userRole === "TEACHER") {
      // Estudiantes en cursos donde el profesor está asignado
      students = await db.user.findMany({
        where: {
          role: "STUDENT",
          isActive: true,
          deletedAt: null,
          studentProfile: {
            enrollments: {
              some: {
                course: {
                  assignments: {
                    some: {
                      teacher: {
                        userId: userId,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        select: {
          id: true,
          name: true,
          studentProfile: {
            select: {
              id: true,
              enrollments: {
                select: {
                  course: { select: { name: true } },
                  group: { select: { name: true } },
                },
              },
            },
          },
        },
        orderBy: { name: "asc" },
      });
    } else {
      // Administrador: estudiantes de su sede
      students = await db.user.findMany({
        where: {
          role: "STUDENT",
          isActive: true,
          sede: sede as any,
          deletedAt: null,
        },
        select: {
          id: true,
          name: true,
          studentProfile: {
            select: {
              id: true,
              enrollments: {
                select: {
                  course: { select: { name: true } },
                  group: { select: { name: true } },
                },
              },
            },
          },
        },
        orderBy: { name: "asc" },
      });
    }

    return { success: true, data: students };
  } catch (error) {
    console.error("Error fetching students for attendance:", error);
    return { success: false, error: "Error al cargar alumnos" };
  }
}
