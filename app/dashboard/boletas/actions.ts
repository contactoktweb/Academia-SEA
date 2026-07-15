"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getStudentsForSelect() {
  try {
    const students = await db.studentProfile.findMany({
      where: { isActive: true },
      include: { user: true },
      orderBy: { user: { name: 'asc' } }
    });
    
    return { 
      success: true, 
      data: students.map(s => ({
        id: s.id,
        name: s.user.name,
      }))
    };
  } catch (error) {
    console.error("Error fetching students:", error);
    return { success: false, error: "Error al obtener estudiantes" };
  }
}

export async function getCyclesForSelect() {
  try {
    const cycles = await db.schoolCycle.findMany({
      orderBy: { startDate: 'desc' }
    });
    
    return { 
      success: true, 
      data: cycles.map(c => ({
        id: c.id,
        name: c.name,
        isActive: c.isActive
      }))
    };
  } catch (error) {
    console.error("Error fetching cycles:", error);
    return { success: false, error: "Error al obtener ciclos" };
  }
}

export async function generateReportCard(data: {
  studentProfileId: string;
  cycleId?: string;
  authorName: string;
}) {
  try {
    // 1. Fetch student data
    const student = await db.studentProfile.findUnique({
      where: { id: data.studentProfileId },
      include: { user: true }
    });

    if (!student) throw new Error("Estudiante no encontrado");

    // 2. Fetch grades for the student (filter by cycle if provided)
    const grades = await db.grade.findMany({
      where: { 
        studentId: data.studentProfileId,
        ...(data.cycleId ? { courseAssignment: { cycleId: data.cycleId } } : {})
      },
      include: {
        exam: { include: { unit: { include: { course: true } } } },
        courseAssignment: { include: { course: true } }
      }
    });

    // 3. Aggregate grades by course
    const coursesMap = new Map();
    
    grades.forEach(g => {
      const courseName = g.exam?.unit.course.name || g.courseAssignment?.course.name || "Curso General";
      if (!coursesMap.has(courseName)) {
        coursesMap.set(courseName, { grades: [], sum: 0 });
      }
      const c = coursesMap.get(courseName);
      c.grades.push(g.value);
      c.sum += g.value;
    });

    const courseAverages = Array.from(coursesMap.entries()).map(([name, stats]) => ({
      name,
      average: (stats.sum / stats.grades.length).toFixed(2),
      gradeCount: stats.grades.length
    }));

    const generalAverage = courseAverages.length > 0 
      ? (courseAverages.reduce((sum, c) => sum + parseFloat(c.average), 0) / courseAverages.length).toFixed(2)
      : "0.00";

    // 4. Save to Report table
    const reportData = {
      studentName: student.user.name,
      studentId: student.id,
      courseAverages,
      generalAverage,
      generatedAt: new Date().toISOString()
    };

    const report = await db.report.create({
      data: {
        type: "REPORT_CARD",
        title: `Boleta de Calificaciones - ${student.user.name}`,
        cycleId: data.cycleId,
        generatedBy: data.authorName,
        data: reportData
      }
    });

    revalidatePath("/dashboard/boletas");
    return { success: true, data: report };
  } catch (error: any) {
    console.error("Error generating report:", error);
    return { success: false, error: error.message || "Error al generar la boleta" };
  }
}

export async function deleteReport(reportId: string) {
  try {
    await db.report.delete({
      where: { id: reportId }
    });
    revalidatePath("/dashboard/boletas");
    return { success: true };
  } catch (error) {
    console.error("Error deleting report:", error);
    return { success: false, error: "Error al eliminar el reporte" };
  }
}
