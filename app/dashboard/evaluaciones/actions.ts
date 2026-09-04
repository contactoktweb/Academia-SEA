"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createExam(data: {
  courseId: string;
  unitName: string;
  unitId?: string;
  title: string;
  type?: string;
  maxScore?: number;
  weight?: number;
  examDate?: string;
  dueDate?: string;
}) {
  try {
    let targetUnitId = data.unitId;

    // Si se provee nombre de unidad y curso, buscarla o crearla automáticamente
    if (data.courseId && data.unitName) {
      const trimmedName = data.unitName.trim();
      let unit = await db.unit.findFirst({
        where: {
          courseId: data.courseId,
          name: { equals: trimmedName, mode: "insensitive" },
        },
      });

      if (!unit) {
        const highestOrder = await db.unit.findFirst({
          where: { courseId: data.courseId },
          orderBy: { order: "desc" },
        });

        unit = await db.unit.create({
          data: {
            courseId: data.courseId,
            name: trimmedName,
            order: (highestOrder?.order || 0) + 1,
          },
        });
      }
      targetUnitId = unit.id;
    }

    if (!targetUnitId) {
      return { success: false, error: "Debes ingresar una unidad válida" };
    }

    const exam = await db.exam.create({
      data: {
        unitId: targetUnitId,
        title: data.title.trim(),
        type: data.type || "EXAM",
        maxScore: data.maxScore !== undefined ? data.maxScore : 100,
        weight: data.weight !== undefined ? data.weight : 1,
        examDate: data.examDate ? new Date(data.examDate) : new Date(),
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      },
    });

    revalidatePath("/dashboard/evaluaciones");
    return { success: true, data: exam };
  } catch (error: any) {
    console.error("Error creating exam:", error);
    return { success: false, error: error.message || "Error al crear el examen" };
  }
}

export async function updateExam(
  examId: string,
  data: {
    courseId?: string;
    unitName?: string;
    unitId?: string;
    title?: string;
    type?: string;
    maxScore?: number;
    weight?: number;
    examDate?: string;
    dueDate?: string;
  }
) {
  try {
    let targetUnitId = data.unitId;

    if (data.courseId && data.unitName) {
      const trimmedName = data.unitName.trim();
      let unit = await db.unit.findFirst({
        where: {
          courseId: data.courseId,
          name: { equals: trimmedName, mode: "insensitive" },
        },
      });

      if (!unit) {
        const highestOrder = await db.unit.findFirst({
          where: { courseId: data.courseId },
          orderBy: { order: "desc" },
        });

        unit = await db.unit.create({
          data: {
            courseId: data.courseId,
            name: trimmedName,
            order: (highestOrder?.order || 0) + 1,
          },
        });
      }
      targetUnitId = unit.id;
    }

    const updatePayload: any = {
      ...(data.title ? { title: data.title.trim() } : {}),
      ...(data.type ? { type: data.type } : {}),
      ...(targetUnitId ? { unitId: targetUnitId } : {}),
      ...(data.maxScore !== undefined ? { maxScore: data.maxScore } : {}),
      ...(data.weight !== undefined ? { weight: data.weight } : {}),
      ...(data.examDate ? { examDate: new Date(data.examDate) } : {}),
      ...(data.dueDate ? { dueDate: new Date(data.dueDate) } : {}),
    };

    const exam = await db.exam.update({
      where: { id: examId },
      data: updatePayload,
    });

    revalidatePath("/dashboard/evaluaciones");
    return { success: true, data: exam };
  } catch (error: any) {
    console.error("Error updating exam:", error);
    return { success: false, error: error.message || "Error al actualizar el examen" };
  }
}

export async function deleteExam(examId: string) {
  try {
    await db.exam.update({
      where: { id: examId },
      data: { isActive: false },
    });

    revalidatePath("/dashboard/evaluaciones");
    return { success: true };
  } catch (error) {
    console.error("Error disabling exam:", error);
    return { success: false, error: "Error al deshabilitar el examen" };
  }
}

export async function getCoursesWithUnits() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "No autenticado" };
    }

    const userRole = session.user.role;
    const userId = session.user.id;
    const sede = (session.user as any)?.sede || "SEAAUTLAN";

    let whereCondition: any = { isActive: true };

    if (userRole === "TEACHER") {
      // Exclusivamente cursos asignados al profesor actual
      whereCondition = {
        isActive: true,
        assignments: {
          some: {
            teacher: {
              userId: userId,
            },
          },
        },
      };
    } else if (userRole === "ADMIN") {
      whereCondition = {
        isActive: true,
        sede: sede,
      };
    }

    const courses = await db.course.findMany({
      where: whereCondition,
      include: { units: { orderBy: { order: "asc" } } },
      orderBy: { name: "asc" },
    });

    return { success: true, data: courses };
  } catch (error) {
    console.error("Error fetching courses:", error);
    return { success: false, error: "Error al obtener cursos" };
  }
}
