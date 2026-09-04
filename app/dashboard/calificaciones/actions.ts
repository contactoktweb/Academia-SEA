"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export type GradeType = "EVALUATION" | "HOMEWORK" | "PARTICIPATION" | "ATTENDANCE" | "PROJECT" | "OTHER";

export const GRADE_TYPE_LABELS: Record<GradeType, string> = {
  EVALUATION: "Evaluación",
  HOMEWORK: "Tarea",
  PARTICIPATION: "Participación",
  ATTENDANCE: "Asistencia",
  PROJECT: "Proyecto",
  OTHER: "Otro",
};

export async function createGrade(data: {
  studentId: string;
  gradeType?: GradeType;
  value?: number;
  examId?: string;
  customConcept?: string;
  comment?: string;
  courseAssignmentId?: string;
  // Campos retrocompatibles
  examScore?: number;
  participationScore?: number;
  attendanceScore?: number;
}) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const userRole = session?.user?.role;

    // 1. Obtener perfil de profesor si aplica
    let teacherProfile = null;
    if (userId) {
      teacherProfile = await db.teacherProfile.findUnique({
        where: { userId },
      });
    }

    // 2. Auto-resolver asignación de curso si no fue provista ("no pida curso")
    let targetAssignmentId = data.courseAssignmentId;

    if (!targetAssignmentId) {
      // Buscar en las inscripciones activas del estudiante correspondientes al profesor
      const enrollment = await db.studentEnrollment.findFirst({
        where: {
          studentId: data.studentId,
          status: "ACTIVE",
          ...(teacherProfile
            ? {
                course: {
                  assignments: {
                    some: { teacherId: teacherProfile.id },
                  },
                },
              }
            : {}),
        },
        include: {
          course: {
            include: {
              assignments: teacherProfile
                ? { where: { teacherId: teacherProfile.id } }
                : true,
            },
          },
        },
      });

      targetAssignmentId = enrollment?.course?.assignments?.[0]?.id;

      // Si no se encuentra por inscripción directa pero hay examen seleccionado
      if (!targetAssignmentId && data.examId && data.examId !== "none") {
        const exam = await db.exam.findUnique({
          where: { id: data.examId },
          include: {
            unit: {
              include: {
                course: {
                  include: {
                    assignments: teacherProfile
                      ? { where: { teacherId: teacherProfile.id } }
                      : true,
                  },
                },
              },
            },
          },
        });
        targetAssignmentId = exam?.unit?.course?.assignments?.[0]?.id;
      }

      // Si aún no se encuentra, obtener la primera asignación del profesor
      if (!targetAssignmentId && teacherProfile) {
        const defaultAssignment = await db.courseAssignment.findFirst({
          where: { teacherId: teacherProfile.id },
        });
        targetAssignmentId = defaultAssignment?.id;
      }
    }

    // 3. Determinar el valor de la nota
    let finalValue: number;
    let type = data.gradeType || (data.examId && data.examId !== "none" ? "EVALUATION" : "OTHER");

    if (data.value !== undefined) {
      finalValue = Number(data.value);
    } else if (data.examScore !== undefined || data.participationScore !== undefined || data.attendanceScore !== undefined) {
      // Cálculo ponderado retrocompatible
      const exam = data.examScore || 0;
      const part = data.participationScore || 0;
      const att = data.attendanceScore || 0;
      finalValue = (exam * 0.70) + (part * 0.20) + (att * 0.10);
    } else {
      finalValue = 0;
    }

    // 4. Preparar comentarios y concepto
    const typeLabel = GRADE_TYPE_LABELS[type] || type;
    let fullComment = data.comment?.trim() || "";
    if (data.customConcept?.trim()) {
      fullComment = `[${typeLabel}: ${data.customConcept.trim()}] ${fullComment}`.trim();
    }

    // 5. Determinar unitId si es examen
    let unitId: string | undefined = undefined;
    const finalExamId = (type === "EVALUATION" && data.examId && data.examId !== "none") ? data.examId : null;

    if (finalExamId) {
      const exam = await db.exam.findUnique({
        where: { id: finalExamId },
        select: { unitId: true },
      });
      unitId = exam?.unitId;

      // Verificar si ya existe una calificación previa para este examen y estudiante
      const existingGrade = await db.grade.findFirst({
        where: {
          studentId: data.studentId,
          examId: finalExamId,
          comment: { not: { startsWith: "[CALIFICACIÓN ANULADA" } },
        },
      });

      if (existingGrade) {
        // Actualizar calificación existente
        const updatedGrade = await db.grade.update({
          where: { id: existingGrade.id },
          data: {
            value: finalValue,
            examScore: finalValue,
            comment: fullComment || existingGrade.comment,
            teacherId: teacherProfile?.id || existingGrade.teacherId,
            courseAssignmentId: targetAssignmentId || existingGrade.courseAssignmentId,
            gradedAt: new Date(),
          },
        });

        revalidatePath("/dashboard/calificaciones");
        return { success: true, data: updatedGrade, updated: true };
      }
    }

    // 6. Crear nueva calificación
    const grade = await db.grade.create({
      data: {
        value: finalValue,
        examScore: (type === "EVALUATION" || type === "HOMEWORK") ? finalValue : (data.examScore || null),
        participationScore: type === "PARTICIPATION" ? finalValue : (data.participationScore || null),
        attendanceScore: type === "ATTENDANCE" ? finalValue : (data.attendanceScore || null),
        comment: fullComment || null,
        studentId: data.studentId,
        examId: finalExamId,
        unitId: unitId || null,
        teacherId: teacherProfile?.id || null,
        courseAssignmentId: targetAssignmentId || null,
      },
    });

    revalidatePath("/dashboard/calificaciones");
    return { success: true, data: grade };
  } catch (error: any) {
    console.error("Error creating grade:", error);
    return { success: false, error: error.message || "Error al registrar la calificación" };
  }
}

export async function updateGrade(
  gradeId: string,
  data: {
    value?: number;
    gradeType?: GradeType;
    customConcept?: string;
    comment?: string;
    studentId?: string;
    examId?: string;
    courseAssignmentId?: string;
    examScore?: number;
    participationScore?: number;
    attendanceScore?: number;
  }
) {
  try {
    const existing = await db.grade.findUnique({ where: { id: gradeId } });
    if (!existing) throw new Error("Calificación no encontrada");

    let finalValue = existing.value;
    if (data.value !== undefined) {
      finalValue = Number(data.value);
    } else if (data.examScore !== undefined || data.participationScore !== undefined || data.attendanceScore !== undefined) {
      const exam = data.examScore !== undefined ? data.examScore : (existing.examScore || 0);
      const part = data.participationScore !== undefined ? data.participationScore : (existing.participationScore || 0);
      const att = data.attendanceScore !== undefined ? data.attendanceScore : (existing.attendanceScore || 0);
      finalValue = (exam * 0.70) + (part * 0.20) + (att * 0.10);
    }

    let fullComment = data.comment !== undefined ? data.comment.trim() : (existing.comment || "");
    if (data.customConcept?.trim()) {
      const typeLabel = data.gradeType ? (GRADE_TYPE_LABELS[data.gradeType] || data.gradeType) : "Nota";
      fullComment = `[${typeLabel}: ${data.customConcept.trim()}] ${fullComment}`.trim();
    }

    const examId = data.examId !== undefined 
      ? (data.examId === "none" ? null : data.examId) 
      : existing.examId;

    const grade = await db.grade.update({
      where: { id: gradeId },
      data: {
        value: finalValue,
        examScore: data.examScore !== undefined ? data.examScore : (data.gradeType === "EVALUATION" ? finalValue : existing.examScore),
        participationScore: data.participationScore !== undefined ? data.participationScore : (data.gradeType === "PARTICIPATION" ? finalValue : existing.participationScore),
        attendanceScore: data.attendanceScore !== undefined ? data.attendanceScore : (data.gradeType === "ATTENDANCE" ? finalValue : existing.attendanceScore),
        comment: fullComment || null,
        studentId: data.studentId || existing.studentId,
        examId: examId,
        courseAssignmentId: data.courseAssignmentId || existing.courseAssignmentId,
        gradedAt: new Date(),
      },
    });

    revalidatePath("/dashboard/calificaciones");
    return { success: true, data: grade };
  } catch (error: any) {
    console.error("Error updating grade:", error);
    return { success: false, error: error.message || "Error al actualizar la calificación" };
  }
}

export async function deleteGrade(gradeId: string) {
  try {
    // Deshabilitación lógica para preservar auditoría
    await db.grade.update({
      where: { id: gradeId },
      data: {
        comment: "[CALIFICACIÓN ANULADA / DESHABILITADA]",
      },
    });

    revalidatePath("/dashboard/calificaciones");
    return { success: true };
  } catch (error) {
    console.error("Error disabling grade:", error);
    return { success: false, error: "Error al deshabilitar la calificación" };
  }
}
