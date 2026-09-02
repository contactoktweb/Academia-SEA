import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export interface SerializedInstallment {
  installmentNumber: number;
  totalInstallments: number;
  conceptName: string;
  monthName: string;
  billingDate?: string;
  dueDate: string; // ISO string (7 días después de la fecha de generación del mes)
  dueDay: number;
  amount: number;
  originalAmount: number;
  discount: number;
  isScholarship: boolean;
  status: "PAID" | "PENDING" | "OVERDUE" | "UPCOMING";
  isCurrentMonth: boolean;
  paidAt?: string | null;
  paymentId?: string | null;
  reference?: string | null;
  method?: string | null;
  receiptUrl?: string | null;
}

export interface StudentPaymentPlanResult {
  student: {
    id: string;
    studentProfileId: string;
    studentId?: string | null;
    name: string;
    email: string;
    phone?: string | null;
    sede: string;
    photoUrl?: string | null;
  };
  enrollment: {
    id: string;
    courseName: string;
    courseLevel: string;
    level?: string;
    groupName: string;
    groupSchedule: string;
    schedule?: string;
    enrolledAt: string;
    totalInstallments: number;
    baseMonthlyValue: number;
    netMonthlyAmount: number;
    isScholarship: boolean;
    scholarshipDiscount: number;
    paymentDay: number;
    conceptName: string;
  } | null;
  installments: SerializedInstallment[];
  summary: {
    totalCourseCost: number;
    totalPaid: number;
    totalPending: number;
    paidCount: number;
    pendingCount: number;
    totalInstallments: number;
    progressPercentage: number;
  };
  allPayments: any[];
}

/**
 * Genera y sincroniza automáticamente las mensualidades de un alumno
 * mes a mes desde su fecha de inscripción (enrolledAt).
 */
export async function syncAndGenerateMonthlyPayments(
  studentProfileId: string
): Promise<{ success: boolean; data?: StudentPaymentPlanResult; error?: string }> {
  try {
    const studentProfile = await db.studentProfile.findUnique({
      where: { id: studentProfileId },
      include: {
        user: true,
        enrollments: {
          where: { status: "ACTIVE" },
          include: {
            course: true,
            group: true,
            cycle: true,
          },
          orderBy: { enrolledAt: "desc" },
        },
        payments: {
          where: { status: { not: "CANCELLED" } },
          include: {
            concept: true,
          },
          orderBy: { dueDate: "asc" },
        },
      },
    });

    if (!studentProfile) {
      return { success: false, error: "Perfil de estudiante no encontrado." };
    }

    const activeEnrollment = studentProfile.enrollments[0];
    const sede = studentProfile.sede || studentProfile.user.sede || "SEAAUTLAN";

    // Si no tiene inscripción activa, retornamos solo los pagos existentes si los hay
    if (!activeEnrollment) {
      const existingPayments = studentProfile.payments.map((p) => ({
        ...p,
        amount: Number(p.amount),
        amountPaid: p.amountPaid ? Number(p.amountPaid) : null,
        concept: p.concept ? { ...p.concept, amount: Number(p.concept.amount) } : null,
      }));

      const totalPaid = existingPayments
        .filter((p) => p.status === "PAID")
        .reduce((sum, p) => sum + (p.amountPaid || p.amount), 0);
      const totalPending = existingPayments
        .filter((p) => ["PENDING", "OVERDUE"].includes(p.status))
        .reduce((sum, p) => sum + p.amount, 0);

      return {
        success: true,
        data: {
          student: {
            id: studentProfile.user.id,
            studentProfileId: studentProfile.id,
            studentId: studentProfile.studentId,
            name: studentProfile.user.name,
            email: studentProfile.user.email,
            phone: studentProfile.user.phone,
            sede: studentProfile.sede,
            photoUrl: studentProfile.user.photoUrl,
          },
          enrollment: null,
          installments: [],
          summary: {
            totalCourseCost: totalPaid + totalPending,
            totalPaid,
            totalPending,
            paidCount: existingPayments.filter((p) => p.status === "PAID").length,
            pendingCount: existingPayments.filter((p) => ["PENDING", "OVERDUE"].includes(p.status)).length,
            totalInstallments: existingPayments.length,
            progressPercentage: totalPaid + totalPending > 0 ? Math.round((totalPaid / (totalPaid + totalPending)) * 100) : 0,
          },
          allPayments: existingPayments,
        },
      };
    }

    // Concepto de colegiatura base
    let tuitionConcept = await db.chargeConcept.findFirst({
      where: {
        sede: sede as any,
        isActive: true,
        type: "TUITION",
      },
    });

    if (!tuitionConcept) {
      tuitionConcept = await db.chargeConcept.findFirst({
        where: { isActive: true, type: "TUITION" },
      });
    }

    const totalInstallments = activeEnrollment.totalInstallments && activeEnrollment.totalInstallments > 0
      ? activeEnrollment.totalInstallments
      : 6;

    const baseMonthlyValue = activeEnrollment.monthlyValue && Number(activeEnrollment.monthlyValue) > 0
      ? Number(activeEnrollment.monthlyValue)
      : Number(tuitionConcept?.amount || 800);

    const isScholarship = !!activeEnrollment.isScholarship;
    const scholarshipDiscount = activeEnrollment.scholarshipDiscount
      ? Number(activeEnrollment.scholarshipDiscount)
      : 0;

    const netMonthlyAmount = Math.max(0, baseMonthlyValue - (isScholarship ? scholarshipDiscount : 0));
    const paymentDay = activeEnrollment.paymentDate && activeEnrollment.paymentDate >= 1 && activeEnrollment.paymentDate <= 31
      ? activeEnrollment.paymentDate
      : 5;

    const conceptBase = activeEnrollment.monthlyConcept?.trim() || tuitionConcept?.name || "Colegiatura Mensual";
    const startDate = activeEnrollment.enrolledAt ? new Date(activeEnrollment.enrolledAt) : new Date(studentProfile.createdAt);

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Obtener pagos existentes
    let existingPayments = studentProfile.payments;
    const installments: SerializedInstallment[] = [];
    const usedPaymentIds = new Set<string>();

    // Generar/revisar cada una de las mensualidades mes a mes desde la fecha de inscripción
    for (let i = 0; i < totalInstallments; i++) {
      // Calcular año y mes de la cuota i
      const targetMonthIndex = startDate.getMonth() + i;
      const targetYear = startDate.getFullYear() + Math.floor(targetMonthIndex / 12);
      const targetMonth = targetMonthIndex % 12;

      // Limitar el día al máximo de días que tiene el mes (ej. Febrero 28)
      const daysInTargetMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
      const targetDay = Math.min(paymentDay, daysInTargetMonth);

      // Fecha base de corte/generación del mes i
      const billingDate = new Date(Date.UTC(targetYear, targetMonth, targetDay, 12, 0, 0));

      // Fecha de vencimiento: se otorgan 7 días desde la fecha de corte/generación para pagar
      const dueDate = new Date(Date.UTC(targetYear, targetMonth, targetDay + 7, 12, 0, 0));

      const monthName = new Date(targetYear, targetMonth, 1).toLocaleDateString("es-MX", {
        month: "long",
        year: "numeric",
      });
      const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
      const isCurrent = targetMonth === currentMonth && targetYear === currentYear;

      // Buscar si ya existe un registro de pago para este mes o cuota
      let matchedPayment = existingPayments.find((p) => {
        if (usedPaymentIds.has(p.id)) return false;

        const pDate = new Date(p.dueDate);
        const matchByDate =
          (pDate.getUTCFullYear() === targetYear && pDate.getUTCMonth() === targetMonth) ||
          (pDate.getUTCFullYear() === dueDate.getUTCFullYear() && pDate.getUTCMonth() === dueDate.getUTCMonth() && Math.abs(pDate.getUTCDate() - dueDate.getUTCDate()) <= 2);
        const matchByNote =
          p.notes?.includes(`(${i + 1}/${totalInstallments})`) ||
          p.notes?.includes(`Mensualidad ${i + 1}`) ||
          p.notes?.includes(`mensualidad ${i + 1}`);

        return matchByDate || matchByNote;
      });

      // Si no existe, crearlo automáticamente en base de datos con 7 días de vigencia
      if (!matchedPayment) {
        try {
          const newPayment = await db.payment.create({
            data: {
              studentId: studentProfile.id,
              cycleId: activeEnrollment.cycleId,
              conceptId: tuitionConcept?.id,
              amount: netMonthlyAmount,
              dueDate,
              method: "BANK_TRANSFER",
              status: "PENDING",
              notes: `${conceptBase} (${i + 1}/${totalInstallments}) - ${capitalizedMonth}`,
              sede: sede as any,
            },
            include: { concept: true },
          });

          matchedPayment = newPayment;
          existingPayments.push(newPayment);
        } catch (createErr) {
          console.error(`Error auto-generating installment payment ${i + 1}:`, createErr);
        }
      }

      if (matchedPayment) {
        usedPaymentIds.add(matchedPayment.id);
        const actualDueDate = new Date(matchedPayment.dueDate);
        const isPaid = matchedPayment.status === "PAID";
        const isOverdue = !isPaid && actualDueDate < today;

        installments.push({
          installmentNumber: i + 1,
          totalInstallments,
          conceptName: `${conceptBase} (${i + 1}/${totalInstallments})`,
          monthName: capitalizedMonth,
          billingDate: billingDate.toISOString(),
          dueDate: actualDueDate.toISOString(),
          dueDay: actualDueDate.getUTCDate(),
          amount: isPaid ? (Number(matchedPayment.amountPaid) || Number(matchedPayment.amount)) : netMonthlyAmount,
          originalAmount: baseMonthlyValue,
          discount: scholarshipDiscount,
          isScholarship,
          status: isPaid ? "PAID" : isOverdue ? "OVERDUE" : isCurrent ? "PENDING" : "UPCOMING",
          isCurrentMonth: isCurrent,
          paidAt: matchedPayment.paidAt ? matchedPayment.paidAt.toISOString() : null,
          paymentId: matchedPayment.id,
          reference: matchedPayment.reference,
          method: matchedPayment.method,
          receiptUrl: matchedPayment.receiptUrl,
        });
      }
    }

    // Totales y resumen financiero
    const totalPaid = installments
      .filter((inst) => inst.status === "PAID")
      .reduce((sum, inst) => sum + inst.amount, 0);

    const totalCourseCost = netMonthlyAmount * totalInstallments;
    const totalPending = Math.max(0, totalCourseCost - totalPaid);
    const paidCount = installments.filter((inst) => inst.status === "PAID").length;
    const pendingCount = totalInstallments - paidCount;
    const progressPercentage = totalCourseCost > 0 ? Math.min(100, Math.round((totalPaid / totalCourseCost) * 100)) : 0;

    const serializedAllPayments = existingPayments.map((p) => ({
      ...p,
      amount: Number(p.amount),
      amountPaid: p.amountPaid ? Number(p.amountPaid) : null,
      concept: p.concept ? { ...p.concept, amount: Number(p.concept.amount) } : null,
    }));

    return {
      success: true,
      data: {
        student: {
          id: studentProfile.user.id,
          studentProfileId: studentProfile.id,
          studentId: studentProfile.studentId,
          name: studentProfile.user.name,
          email: studentProfile.user.email,
          phone: studentProfile.user.phone,
          sede: studentProfile.sede,
          photoUrl: studentProfile.user.photoUrl,
        },
        enrollment: {
          id: activeEnrollment.id,
          courseName: activeEnrollment.course.name,
          courseLevel: activeEnrollment.course.level,
          level: activeEnrollment.course.level,
          groupName: activeEnrollment.group?.name || "Sin grupo asignado",
          groupSchedule: activeEnrollment.group?.schedule || "Por definir",
          schedule: activeEnrollment.group?.schedule || "Por definir",
          enrolledAt: activeEnrollment.enrolledAt.toISOString(),
          totalInstallments,
          baseMonthlyValue,
          netMonthlyAmount,
          isScholarship,
          scholarshipDiscount,
          paymentDay,
          conceptName: conceptBase,
        },
        installments,
        summary: {
          totalCourseCost,
          totalPaid,
          totalPending,
          paidCount,
          pendingCount,
          totalInstallments,
          progressPercentage,
        },
        allPayments: serializedAllPayments,
      },
    };
  } catch (error) {
    console.error("Error in syncAndGenerateMonthlyPayments:", error);
    return { success: false, error: "Error al sincronizar el plan de pagos del alumno." };
  }
}

/**
 * Actualiza la configuración del plan de pagos de una inscripción
 * y sincroniza las cuotas pendientes automáticamente.
 */
export async function updateStudentPlanConfig(
  studentProfileId: string,
  config: {
    monthlyValue?: number;
    paymentDate?: number;
    totalInstallments?: number;
    isScholarship?: boolean;
    scholarshipDiscount?: number;
    monthlyConcept?: string;
  }
) {
  try {
    const studentProfile = await db.studentProfile.findUnique({
      where: { id: studentProfileId },
      include: {
        enrollments: {
          where: { status: "ACTIVE" },
          orderBy: { enrolledAt: "desc" },
        },
      },
    });

    if (!studentProfile || studentProfile.enrollments.length === 0) {
      return { success: false, error: "No se encontró una inscripción activa para este alumno." };
    }

    const activeEnrollment = studentProfile.enrollments[0];

    // Actualizar inscripción
    await db.studentEnrollment.update({
      where: { id: activeEnrollment.id },
      data: {
        ...(config.monthlyValue !== undefined ? { monthlyValue: config.monthlyValue } : {}),
        ...(config.paymentDate !== undefined ? { paymentDate: config.paymentDate } : {}),
        ...(config.totalInstallments !== undefined ? { totalInstallments: config.totalInstallments } : {}),
        ...(config.isScholarship !== undefined ? { isScholarship: config.isScholarship } : {}),
        ...(config.scholarshipDiscount !== undefined ? { scholarshipDiscount: config.scholarshipDiscount } : {}),
        ...(config.monthlyConcept !== undefined ? { monthlyConcept: config.monthlyConcept } : {}),
      },
    });

    // Recalcular y sincronizar pagos
    const syncRes = await syncAndGenerateMonthlyPayments(studentProfileId);

    try {
      revalidatePath("/dashboard/alumnos");
      revalidatePath("/dashboard/pagos");
      revalidatePath("/dashboard/estados-cuenta");
      revalidatePath("/dashboard/mis-pagos");
    } catch {}

    return syncRes;
  } catch (error) {
    console.error("Error updating student plan config:", error);
    return { success: false, error: "Error al actualizar la configuración del plan." };
  }
}
