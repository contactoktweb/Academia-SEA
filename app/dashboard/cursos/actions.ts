"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createCourse(data: {
  name: string;
  code: string;
  description?: string;
  level: string;
  cycleId?: string;
}) {
  try {
    const course = await db.course.create({
      data,
    });

    revalidatePath("/dashboard/cursos");
    return { success: true, data: course };
  } catch (error) {
    console.error("Error creating course:", error);
    return { success: false, error: "Error al crear el curso" };
  }
}

export async function updateCourse(
  courseId: string,
  data: {
    name?: string;
    code?: string;
    description?: string;
    level?: string;
  }
) {
  try {
    const course = await db.course.update({
      where: { id: courseId },
      data,
    });

    revalidatePath("/dashboard/cursos");
    return { success: true, data: course };
  } catch (error) {
    console.error("Error updating course:", error);
    return { success: false, error: "Error al actualizar el curso" };
  }
}

export async function deleteCourse(courseId: string) {
  try {
    await db.course.delete({
      where: { id: courseId },
    });

    revalidatePath("/dashboard/cursos");
    return { success: true };
  } catch (error) {
    console.error("Error deleting course:", error);
    return { success: false, error: "Error al eliminar el curso" };
  }
}

export async function createCourseAssignment(data: {
  courseId: string;
  teacherId: string;
  groupId?: string;
  cycleId?: string;
}) {
  try {
    const assignment = await db.courseAssignment.create({
      data,
      include: {
        course: true,
        teacher: { include: { user: true } },
        group: true,
      },
    });

    revalidatePath("/dashboard/cursos");
    return { success: true, data: assignment };
  } catch (error) {
    console.error("Error creating assignment:", error);
    return { success: false, error: "Error al asignar el curso" };
  }
}

export async function createUnit(data: {
  courseId: string;
  name: string;
  order: number;
}) {
  try {
    const unit = await db.unit.create({
      data,
    });

    revalidatePath("/dashboard/cursos");
    return { success: true, data: unit };
  } catch (error) {
    console.error("Error creating unit:", error);
    return { success: false, error: "Error al crear la unidad" };
  }
}

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

export async function recordGrade(data: {
  studentId: string;
  examId?: string;
  courseAssignmentId?: string;
  unitId?: string;
  value: number;
  comment?: string;
}) {
  try {
    const grade = await db.grade.create({
      data: {
        studentId: data.studentId,
        examId: data.examId,
        courseAssignmentId: data.courseAssignmentId,
        unitId: data.unitId,
        value: data.value,
        comment: data.comment,
      },
    });

    revalidatePath("/dashboard/calificaciones");
    return { success: true, data: grade };
  } catch (error) {
    console.error("Error recording grade:", error);
    return { success: false, error: "Error al registrar la calificación" };
  }
}

export async function recordAttendance(data: {
  studentId: string;
  date: string;
  status: string;
  courseAssignmentId?: string;
  notes?: string;
}) {
  try {
    const attendance = await db.attendance.create({
      data: {
        studentId: data.studentId,
        date: new Date(data.date),
        status: data.status,
        courseAssignmentId: data.courseAssignmentId,
        notes: data.notes,
      },
    });

    revalidatePath("/dashboard/asistencia");
    return { success: true, data: attendance };
  } catch (error) {
    console.error("Error recording attendance:", error);
    return { success: false, error: "Error al registrar la asistencia" };
  }
}
