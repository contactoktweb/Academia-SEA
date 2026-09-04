"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export async function getCoursesForReport() {
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
      // Exclusivamente cursos asignados al profesor
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
      select: {
        id: true,
        name: true,
        level: true,
      },
      orderBy: { name: "asc" },
    });

    return { success: true, data: courses };
  } catch (error) {
    console.error("Error fetching courses for report:", error);
    return { success: false, error: "Error al obtener cursos" };
  }
}

export async function getStudentsForReport(courseId?: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "No autenticado" };
    }

    const userRole = session.user.role;
    const userId = session.user.id;
    const sede = (session.user as any)?.sede || "SEAAUTLAN";

    let enrollmentFilter: any = {};

    if (courseId && courseId !== "all") {
      enrollmentFilter = { courseId: courseId };
    } else if (userRole === "TEACHER") {
      enrollmentFilter = {
        course: {
          assignments: {
            some: {
              teacher: {
                userId: userId,
              },
            },
          },
        },
      };
    }

    let studentWhere: any = {
      isActive: true,
      enrollments: {
        some: enrollmentFilter,
      },
    };

    if (userRole !== "TEACHER") {
      studentWhere.user = {
        sede: sede as any,
        deletedAt: null,
      };
    } else {
      studentWhere.user = {
        deletedAt: null,
      };
    }

    const students = await db.studentProfile.findMany({
      where: studentWhere,
      include: {
        user: true,
        enrollments: {
          where: courseId && courseId !== "all" ? { courseId } : {},
          include: {
            course: true,
            group: true,
          },
        },
      },
      orderBy: { user: { name: "asc" } },
    });

    return {
      success: true,
      data: students.map((s) => {
        const groupInfo = s.enrollments[0]?.group?.name ? ` - ${s.enrollments[0].group.name}` : "";
        const courseInfo = s.enrollments[0]?.course?.name ? ` (${s.enrollments[0].course.name}${groupInfo})` : "";
        return {
          id: s.id,
          name: s.user.name,
          displayName: `${s.user.name}${courseInfo}`,
        };
      }),
    };
  } catch (error) {
    console.error("Error fetching students for report:", error);
    return { success: false, error: "Error al obtener estudiantes" };
  }
}

// Para compatibilidad con otros módulos
export async function getStudentsForSelect() {
  return getStudentsForReport();
}

export async function getCyclesForSelect() {
  try {
    const cycles = await db.schoolCycle.findMany({
      where: { isActive: true },
      orderBy: { startDate: "desc" },
    });

    return {
      success: true,
      data: cycles.map((c) => ({
        id: c.id,
        name: c.name,
        isActive: c.isActive,
      })),
    };
  } catch (error) {
    console.error("Error fetching cycles:", error);
    return { success: false, error: "Error al obtener ciclos" };
  }
}

export async function generateReportCard(data: {
  studentProfileId: string;
  courseId?: string;
  cycleId?: string;
  authorName: string;
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "No autenticado" };
    }

    const userRole = session.user.role;
    const userId = session.user.id;

    // 1. Obtener datos del estudiante
    const student = await db.studentProfile.findUnique({
      where: { id: data.studentProfileId },
      include: { user: true },
    });

    if (!student) throw new Error("Estudiante no encontrado");

    // 2. Determinar los IDs de cursos autorizados
    let targetCourseIds: string[] | undefined = undefined;

    if (userRole === "TEACHER") {
      const assignments = await db.courseAssignment.findMany({
        where: { teacher: { userId } },
        select: { courseId: true },
      });
      const teacherCourseIds = Array.from(new Set(assignments.map((a) => a.courseId)));

      if (data.courseId && data.courseId !== "all") {
        if (!teacherCourseIds.includes(data.courseId)) {
          throw new Error("No tienes autorización para generar boletas de este curso");
        }
        targetCourseIds = [data.courseId];
      } else {
        targetCourseIds = teacherCourseIds;
      }
    } else if (data.courseId && data.courseId !== "all") {
      targetCourseIds = [data.courseId];
    }

    // 3. Obtener calificaciones filtrando estrictamente por el curso correspondiente
    const grades = await db.grade.findMany({
      where: {
        studentId: data.studentProfileId,
        ...(data.cycleId ? { courseAssignment: { cycleId: data.cycleId } } : {}),
        ...(targetCourseIds && targetCourseIds.length > 0
          ? {
              OR: [
                { courseAssignment: { courseId: { in: targetCourseIds } } },
                { exam: { unit: { courseId: { in: targetCourseIds } } } },
              ],
            }
          : {}),
      },
      include: {
        exam: { include: { unit: { include: { course: true } } } },
        courseAssignment: { include: { course: true } },
      },
    });

    // 4. Agregar calificaciones por curso
    const coursesMap = new Map();

    grades.forEach((g) => {
      const courseName =
        g.exam?.unit.course.name || g.courseAssignment?.course.name || "Curso";
      if (!coursesMap.has(courseName)) {
        coursesMap.set(courseName, { grades: [], sum: 0 });
      }
      const c = coursesMap.get(courseName);
      c.grades.push(g.value);
      c.sum += g.value;
    });

    const courseAverages = Array.from(coursesMap.entries()).map(([name, stats]: any) => ({
      name,
      average: (stats.sum / stats.grades.length).toFixed(2),
      gradeCount: stats.grades.length,
    }));

    const generalAverage =
      courseAverages.length > 0
        ? (
            courseAverages.reduce((sum: number, c: any) => sum + parseFloat(c.average), 0) /
            courseAverages.length
          ).toFixed(2)
        : "0.00";

    // Nombre específico del curso para el título e info
    let singleCourseName: string | undefined = undefined;
    if (data.courseId && data.courseId !== "all") {
      const courseRecord = await db.course.findUnique({
        where: { id: data.courseId },
        select: { name: true },
      });
      singleCourseName = courseRecord?.name;
    } else if (targetCourseIds && targetCourseIds.length === 1) {
      const courseRecord = await db.course.findUnique({
        where: { id: targetCourseIds[0] },
        select: { name: true },
      });
      singleCourseName = courseRecord?.name;
    }

    const courseLabel = singleCourseName ? ` (${singleCourseName})` : "";

    // 5. Guardar en la tabla Report
    const reportData = {
      studentName: student.user.name,
      studentId: student.id,
      courseName: singleCourseName,
      courseAverages,
      generalAverage,
      generatedAt: new Date().toISOString(),
    };

    const report = await db.report.create({
      data: {
        type: "REPORT_CARD",
        title: `Boleta de Calificaciones - ${student.user.name}${courseLabel}`,
        cycleId: data.cycleId,
        generatedBy: data.authorName,
        data: reportData,
      },
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
      where: { id: reportId },
    });
    revalidatePath("/dashboard/boletas");
    return { success: true };
  } catch (error) {
    console.error("Error deleting report:", error);
    return { success: false, error: "Error al eliminar la boleta" };
  }
}
