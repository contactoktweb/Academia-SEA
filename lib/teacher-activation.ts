import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * Activa automáticamente a un profesor (isApproved: true, isActive: true)
 * al asignarle un curso o si ya cuenta con al menos un curso asignado.
 */
export async function activateTeacherProfile(teacherProfileId: string) {
  try {
    if (!teacherProfileId) return { success: false, error: "ID de profesor no provisto" };

    const teacherProfile = await db.teacherProfile.findUnique({
      where: { id: teacherProfileId },
      include: { user: true },
    });

    if (!teacherProfile?.userId) {
      return { success: false, error: "Perfil de profesor o usuario no encontrado" };
    }

    await db.user.update({
      where: { id: teacherProfile.userId },
      data: { isApproved: true, isActive: true },
    });

    await db.teacherProfile.update({
      where: { id: teacherProfileId },
      data: { isActive: true },
    });

    try {
      revalidatePath("/dashboard/profesores");
      revalidatePath("/dashboard/cursos");
      revalidatePath("/dashboard/configuracion");
    } catch {
      // Ignorar si se ejecuta fuera de contexto HTTP
    }

    return { success: true };
  } catch (error) {
    console.error("Error activating teacher profile:", error);
    return { success: false, error: "Error al activar el profesor" };
  }
}

/**
 * Verifica si un usuario con rol TEACHER tiene cursos asignados.
 * Si los tiene y no está aprobado, lo activa en la base de datos automáticamente.
 */
export async function checkAndActivateTeacherByUserId(userId: string): Promise<boolean> {
  try {
    if (!userId) return false;

    const teacher = await db.user.findUnique({
      where: { id: userId },
      include: {
        teacherProfile: {
          include: {
            courses: true,
          },
        },
      },
    });

    if (!teacher || teacher.role !== "TEACHER") {
      return Boolean(teacher?.isApproved);
    }

    const hasCourses = (teacher.teacherProfile?.courses?.length || 0) > 0;
    if (hasCourses) {
      if (!teacher.isApproved || !teacher.isActive) {
        await db.user.update({
          where: { id: userId },
          data: { isApproved: true, isActive: true },
        });
        if (teacher.teacherProfile && !teacher.teacherProfile.isActive) {
          await db.teacherProfile.update({
            where: { id: teacher.teacherProfile.id },
            data: { isActive: true },
          });
        }
      }
      return true;
    }

    return Boolean(teacher.isApproved);
  } catch (error) {
    console.error("Error checking and activating teacher by user ID:", error);
    return false;
  }
}

/**
 * Sincroniza a todos los profesores existentes que tengan cursos asignados
 * para asegurar que tengan isApproved: true e isActive: true.
 */
export async function syncAllTeachersWithAssignedCourses() {
  try {
    const teachersWithCourses = await db.user.findMany({
      where: {
        role: "TEACHER",
        teacherProfile: {
          courses: {
            some: {},
          },
        },
      },
      include: {
        teacherProfile: true,
      },
    });

    for (const t of teachersWithCourses) {
      if (!t.isApproved || !t.isActive) {
        await db.user.update({
          where: { id: t.id },
          data: { isApproved: true, isActive: true },
        });
      }
      if (t.teacherProfile && !t.teacherProfile.isActive) {
        await db.teacherProfile.update({
          where: { id: t.teacherProfile.id },
          data: { isActive: true },
        });
      }
    }

    return { success: true, count: teachersWithCourses.length };
  } catch (error) {
    console.error("Error syncing teachers with assigned courses:", error);
    return { success: false, error };
  }
}
