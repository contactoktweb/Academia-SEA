import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function getStudentAcademicAccess(userId?: string) {
  try {
    let targetUserId = userId;
    if (!targetUserId) {
      const session = await auth();
      targetUserId = session?.user?.id;
    }

    if (!targetUserId) {
      return {
        isStudent: false,
        isPaidAndActive: false,
        activeCourses: [],
        approvedCourses: [],
        lockedCourses: [],
        hasApprovedHistory: false,
        hasPendingPayment: false,
      };
    }

    const user = await db.user.findUnique({
      where: { id: targetUserId },
      include: {
        studentProfile: {
          include: {
            enrollments: {
              include: {
                course: {
                  include: {
                    units: {
                      where: { isActive: true },
                      orderBy: { order: "asc" },
                    },
                    assignments: {
                      include: {
                        teacher: { include: { user: true } },
                        group: true,
                      },
                    },
                  },
                },
                group: true,
                cycle: true,
              },
              orderBy: { enrolledAt: "desc" },
            },
            payments: {
              orderBy: { dueDate: "asc" },
            },
            grades: {
              include: {
                unit: true,
                exam: true,
              },
            },
          },
        },
      },
    });

    if (!user || user.role !== "STUDENT" || !user.studentProfile) {
      return {
        isStudent: false,
        isPaidAndActive: true, // Admins y Teachers tienen acceso total
        activeCourses: [],
        approvedCourses: [],
        lockedCourses: [],
        hasApprovedHistory: false,
        hasPendingPayment: false,
      };
    }

    const profile = user.studentProfile;
    const payments = profile.payments;
    const enrollments = profile.enrollments;

    // Verificar pagos:
    // El estudiante está al día si:
    // 1. user.isActive y profile.isActive son true.
    // 2. Tiene al menos un pago en estado 'PAID' (o no tiene ningún pago generado todavía).
    const hasPaidAtLeastOne = payments.some((p) => p.status === "PAID");
    const hasPendingPayments = payments.some((p) => ["PENDING", "OVERDUE"].includes(p.status));

    // Si tiene pagos pendientes y ningún pago pagado, DEBE PAGAR PRIMERO
    const isPaidAndActive = user.isActive && profile.isActive && (hasPaidAtLeastOne || payments.length === 0);

    // Cursos Activos
    const activeEnrollments = enrollments.filter((e) => e.status === "ACTIVE");
    
    // Cursos Aprobados (Alumnos antiguos con historial)
    const approvedEnrollments = enrollments.filter((e) => e.status === "COMPLETED");

    const serializeCourse = (enrollment: any, isPaid: boolean, isApproved: boolean) => ({
      id: enrollment.course.id,
      name: enrollment.course.name,
      code: enrollment.course.code,
      level: enrollment.course.level,
      description: enrollment.course.description,
      schedule: enrollment.group?.schedule || enrollment.course.schedule || "Por definir",
      groupName: enrollment.group?.name || "Sin grupo asignado",
      groupId: enrollment.groupId,
      cycleName: enrollment.cycle?.name || "Ciclo Escolar",
      modality: enrollment.group?.modality || "PRESENCIAL",
      unitsCount: enrollment.course.units.length,
      units: enrollment.course.units,
      teacherName: enrollment.course.assignments[0]?.teacher?.user?.name || "Profesor Titular",
      enrollmentStatus: enrollment.status,
      isPaid,
      isApproved,
    });

    const activeCourses = isPaidAndActive
      ? activeEnrollments.map((e) => serializeCourse(e, true, false))
      : [];

    const lockedCourses = !isPaidAndActive
      ? activeEnrollments.map((e) => serializeCourse(e, false, false))
      : [];

    const approvedCourses = approvedEnrollments.map((e) => serializeCourse(e, true, true));

    return {
      isStudent: true,
      studentName: user.name,
      isPaidAndActive,
      hasApprovedHistory: approvedCourses.length > 0,
      activeCourses,
      lockedCourses,
      approvedCourses,
      hasPendingPayment: !isPaidAndActive && lockedCourses.length > 0,
    };
  } catch (error) {
    console.error("Error getting student academic access:", error);
    return {
      isStudent: false,
      isPaidAndActive: false,
      activeCourses: [],
      approvedCourses: [],
      lockedCourses: [],
      hasApprovedHistory: false,
      hasPendingPayment: false,
    };
  }
}
