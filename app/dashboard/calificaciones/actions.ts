"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createGrade(data: {
  examScore?: number;
  participationScore?: number;
  attendanceScore?: number;
  comment?: string;
  studentId: string;
  examId?: string;
  courseAssignmentId: string;
}) {
  try {
    const exam = data.examScore || 0;
    const part = data.participationScore || 0;
    const att = data.attendanceScore || 0;
    const finalValue = (exam * 0.70) + (part * 0.20) + (att * 0.10);

    const grade = await db.grade.create({
      data: {
        value: finalValue,
        examScore: data.examScore,
        participationScore: data.participationScore,
        attendanceScore: data.attendanceScore,
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
    examScore?: number;
    participationScore?: number;
    attendanceScore?: number;
    comment?: string;
    studentId?: string;
    examId?: string;
    courseAssignmentId?: string;
  }
) {
  try {
    // If we only update some scores, we need to fetch the existing ones to recalculate the final value
    const existing = await db.grade.findUnique({ where: { id: gradeId } });
    const exam = data.examScore !== undefined ? data.examScore : (existing?.examScore || 0);
    const part = data.participationScore !== undefined ? data.participationScore : (existing?.participationScore || 0);
    const att = data.attendanceScore !== undefined ? data.attendanceScore : (existing?.attendanceScore || 0);
    const finalValue = (exam * 0.70) + (part * 0.20) + (att * 0.10);

    const grade = await db.grade.update({
      where: { id: gradeId },
      data: {
        value: finalValue,
        examScore: data.examScore,
        participationScore: data.participationScore,
        attendanceScore: data.attendanceScore,
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
