"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createExam(data: {
  unitId: string;
  title: string;
  type?: string;
  maxScore?: number;
  weight?: number;
  examDate?: string;
  dueDate?: string;
}) {
  try {
    const exam = await db.exam.create({
      data: {
        ...data,
        examDate: data.examDate ? new Date(data.examDate) : undefined,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      },
    });

    revalidatePath("/dashboard/evaluaciones");
    return { success: true, data: exam };
  } catch (error) {
    console.error("Error creating exam:", error);
    return { success: false, error: "Error al crear el examen" };
  }
}

export async function updateExam(
  examId: string,
  data: {
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
    const exam = await db.exam.update({
      where: { id: examId },
      data: {
        ...data,
        examDate: data.examDate ? new Date(data.examDate) : undefined,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      },
    });

    revalidatePath("/dashboard/evaluaciones");
    return { success: true, data: exam };
  } catch (error) {
    console.error("Error updating exam:", error);
    return { success: false, error: "Error al actualizar el examen" };
  }
}

export async function deleteExam(examId: string) {
  try {
    await db.exam.delete({
      where: { id: examId },
    });

    revalidatePath("/dashboard/evaluaciones");
    return { success: true };
  } catch (error) {
    console.error("Error deleting exam:", error);
    return { success: false, error: "Error al eliminar el examen" };
  }
}

export async function getCoursesWithUnits() {
  try {
    const courses = await db.course.findMany({
      where: { isActive: true },
      include: { units: true },
      orderBy: { name: 'asc' }
    });
    return { success: true, data: courses };
  } catch (error) {
    console.error("Error fetching courses:", error);
    return { success: false, error: "Error al obtener cursos" };
  }
}
