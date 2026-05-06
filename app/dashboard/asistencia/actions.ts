"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function recordAttendance(data: {
  studentId: string;
  date: string;
  status: string;
  courseAssignmentId?: string;
  notes?: string;
}) {
  try {
    const date = new Date(data.date);
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
        },
      });
    } else {
      attendance = await db.attendance.create({
        data: {
          studentId: data.studentId,
          date: date,
          status: data.status,
          courseAssignmentId: data.courseAssignmentId,
          notes: data.notes,
        },
      });
    }

    revalidatePath("/dashboard/asistencia");
    return { success: true, data: attendance };
  } catch (error) {
    console.error("Error recording attendance:", error);
    return { success: false, error: "Error al registrar la asistencia" };
  }
}

export async function deleteAttendance(id: string) {
  try {
    await db.attendance.delete({
      where: { id },
    });

    revalidatePath("/dashboard/asistencia");
    return { success: true };
  } catch (error) {
    console.error("Error deleting attendance:", error);
    return { success: false, error: "Error al eliminar el registro" };
  }
}

export async function getStudentsForAttendance() {
  try {
    const students = await db.user.findMany({
      where: { role: "STUDENT", isActive: true },
      select: { id: String, name: true, studentProfile: { select: { id: true } } },
    });
    return { success: true, data: students };
  } catch (error) {
    return { success: false, error: "Error al cargar alumnos" };
  }
}
