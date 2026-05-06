"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createGrade(data: {
  value: number;
  comment?: string;
  studentId: string;
  examId?: string;
  courseAssignmentId: string;
}) {
  try {
    const grade = await db.grade.create({
      data: {
        value: data.value,
        comment: data.comment,
        studentId: data.studentId,
        examId: data.examId,
        courseAssignmentId: data.courseAssignmentId,
      },
    });

    revalidatePath("/dashboard/calificaciones");
    return { success: true, data: grade };
  } catch (error) {
    console.error("Error creating grade:", error);
    return { success: false, error: "Error al registrar la calificación" };
  }
}

export async function updateGrade(
  gradeId: string,
  data: {
    value?: number;
    comment?: string;
    studentId?: string;
    examId?: string;
    courseAssignmentId?: string;
  }
) {
  try {
    const grade = await db.grade.update({
      where: { id: gradeId },
      data: {
        value: data.value,
        comment: data.comment,
        studentId: data.studentId,
        examId: data.examId,
        courseAssignmentId: data.courseAssignmentId,
      },
    });

    revalidatePath("/dashboard/calificaciones");
    return { success: true, data: grade };
  } catch (error) {
    console.error("Error updating grade:", error);
    return { success: false, error: "Error al actualizar la calificación" };
  }
}

export async function deleteGrade(gradeId: string) {
  try {
    await db.grade.delete({
      where: { id: gradeId },
    });

    revalidatePath("/dashboard/calificaciones");
    return { success: true };
  } catch (error) {
    console.error("Error deleting grade:", error);
    return { success: false, error: "Error al eliminar la calificación" };
  }
}
