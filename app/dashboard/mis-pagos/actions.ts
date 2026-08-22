"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { stripe } from "@/lib/stripe";

export interface StudentInstallment {
  installmentNumber: number;
  totalInstallments: number;
  conceptName: string;
  monthName: string;
  dueDate: string; // ISO string
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
}

export async function getStudentPaymentSchedule() {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "No autenticado" };
    }

    const studentProfile = await db.studentProfile.findUnique({
      where: { userId: session.user.id },
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
          include: {
            concept: true,
          },
          orderBy: { dueDate: "asc" },
        },
      },
    });

    if (!studentProfile) {
      return { success: false, error: "No se encontró el perfil de estudiante." };
    }

    const activeEnrollment = studentProfile.enrollments[0];
    const totalInstallments = activeEnrollment?.totalInstallments || 6;
    const baseMonthlyValue = activeEnrollment?.monthlyValue ? Number(activeEnrollment.monthlyValue) : 800;
    const isScholarship = !!activeEnrollment?.isScholarship;
    const scholarshipDiscount = activeEnrollment?.scholarshipDiscount ? Number(activeEnrollment.scholarshipDiscount) : 0;
    const netMonthlyAmount = Math.max(0, baseMonthlyValue - (isScholarship ? scholarshipDiscount : 0));
    const paymentDay = activeEnrollment?.paymentDate || 5;
    const conceptBase = activeEnrollment?.monthlyConcept || "Colegiatura Mensual";
    const startDate = activeEnrollment?.enrolledAt ? new Date(activeEnrollment.enrolledAt) : new Date();

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const existingPayments = studentProfile.payments.map((p) => ({
      ...p,
      amount: Number(p.amount),
      amountPaid: p.amountPaid ? Number(p.amountPaid) : null,
      concept: p.concept ? { ...p.concept, amount: Number(p.concept.amount) } : null,
    }));

    const installments: StudentInstallment[] = [];
    const usedPaymentIds = new Set<string>();

    for (let i = 0; i < totalInstallments; i++) {
      // Calcular fecha de vencimiento para el mes i
      const instDate = new Date(startDate.getFullYear(), startDate.getMonth() + i, paymentDay);
      const instMonth = instDate.getMonth();
      const instYear = instDate.getFullYear();

      const monthName = instDate.toLocaleDateString("es-MX", {
        month: "long",
        year: "numeric",
      });
      const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

      const isCurrent = instMonth === currentMonth && instYear === currentYear;

      // Buscar si ya existe un registro de pago en base de datos para esta mensualidad
      const matchedPayment = existingPayments.find((p) => {
        if (usedPaymentIds.has(p.id)) return false;
        
        // Coincidencia por mes y año de vencimiento
        const pDueDate = new Date(p.dueDate);
        const matchByDate = pDueDate.getMonth() === instMonth && pDueDate.getFullYear() === instYear;
        
        // O coincidencia por nota que indique la mensualidad
        const matchByNote = p.notes?.includes(`mensualidad ${i + 1}`) || p.notes?.includes(`Mensualidad ${i + 1}`);

        return matchByDate || matchByNote;
      });

      if (matchedPayment) {
        usedPaymentIds.add(matchedPayment.id);
        const isPaid = matchedPayment.status === "PAID";
        const isOverdue = !isPaid && instDate < today;

        installments.push({
          installmentNumber: i + 1,
          totalInstallments,
          conceptName: `${conceptBase} (${i + 1}/${totalInstallments})`,
          monthName: capitalizedMonth,
          dueDate: instDate.toISOString(),
          dueDay: paymentDay,
          amount: isPaid ? (matchedPayment.amountPaid || Number(matchedPayment.amount)) : netMonthlyAmount,
          originalAmount: baseMonthlyValue,
          discount: scholarshipDiscount,
          isScholarship,
          status: isPaid ? "PAID" : isOverdue ? "OVERDUE" : isCurrent ? "PENDING" : "UPCOMING",
          isCurrentMonth: isCurrent,
          paidAt: matchedPayment.paidAt ? matchedPayment.paidAt.toISOString() : null,
          paymentId: matchedPayment.id,
          reference: matchedPayment.reference,
          method: matchedPayment.method,
        });
      } else {
        const isOverdue = instDate < today && !isCurrent;
        installments.push({
          installmentNumber: i + 1,
          totalInstallments,
          conceptName: `${conceptBase} (${i + 1}/${totalInstallments})`,
          monthName: capitalizedMonth,
          dueDate: instDate.toISOString(),
          dueDay: paymentDay,
          amount: netMonthlyAmount,
          originalAmount: baseMonthlyValue,
          discount: scholarshipDiscount,
          isScholarship,
          status: isOverdue ? "OVERDUE" : isCurrent ? "PENDING" : "UPCOMING",
          isCurrentMonth: isCurrent,
          paidAt: null,
          paymentId: null,
          reference: null,
          method: null,
        });
      }
    }

    // Calcular resumen financiero
    const totalPaid = installments
      .filter((inst) => inst.status === "PAID")
      .reduce((sum, inst) => sum + inst.amount, 0);

    const totalCourseCost = netMonthlyAmount * totalInstallments;
    const totalPending = Math.max(0, totalCourseCost - totalPaid);
    const paidCount = installments.filter((inst) => inst.status === "PAID").length;
    const pendingCount = totalInstallments - paidCount;

    return {
      success: true,
      data: {
        student: {
          name: studentProfile.user.name,
          email: studentProfile.user.email,
          phone: studentProfile.user.phone,
          sede: studentProfile.sede,
        },
        enrollment: activeEnrollment ? {
          id: activeEnrollment.id,
          courseName: activeEnrollment.course.name,
          level: activeEnrollment.course.level,
          groupName: activeEnrollment.group?.name || "Sin grupo asignado",
          schedule: activeEnrollment.group?.schedule || "Por definir",
          totalInstallments,
          baseMonthlyValue,
          netMonthlyAmount,
          isScholarship,
          scholarshipDiscount,
          paymentDay,
          conceptName: conceptBase,
        } : null,
        installments,
        summary: {
          totalCourseCost,
          totalPaid,
          totalPending,
          paidCount,
          pendingCount,
          totalInstallments,
        },
        allPayments: existingPayments,
      },
    };
  } catch (error) {
    console.error("Error fetching student payment schedule:", error);
    return { success: false, error: "Error al cargar tu plan de pagos." };
  }
}

export async function createOrGetPaymentForInstallment(installment: {
  installmentNumber: number;
  amount: number;
  dueDate: string;
  conceptName: string;
}) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "No autorizado" };
    }

    const studentProfile = await db.studentProfile.findUnique({
      where: { userId: session.user.id },
      include: { enrollments: { where: { status: "ACTIVE" }, include: { course: true } } },
    });

    if (!studentProfile) {
      return { success: false, error: "Perfil de estudiante no encontrado" };
    }

    // 1. Verificar si ya existe un pago pendiente o pagado con esa fecha de vencimiento
    const instDueDate = new Date(installment.dueDate);
    const existing = await db.payment.findFirst({
      where: {
        studentId: studentProfile.id,
        notes: { contains: `mensualidad ${installment.installmentNumber}` },
      },
    });

    if (existing) {
      return { success: true, paymentId: existing.id };
    }

    // 2. Crear nuevo registro de pago PENDING
    const newPayment = await db.payment.create({
      data: {
        studentId: studentProfile.id,
        amount: parseFloat(String(installment.amount)),
        dueDate: instDueDate,
        status: "PENDING",
        method: "ONLINE",
        sede: studentProfile.sede || "SEAAUTLAN",
        notes: `Pago en línea para mensualidad ${installment.installmentNumber}: ${installment.conceptName}`,
      },
    });

    return { success: true, paymentId: newPayment.id };
  } catch (error: any) {
    console.error("Error creating payment record:", error);
    return { success: false, error: error.message || "Error al generar registro de pago" };
  }
}

export async function verifyStripeSessionPayment(sessionId: string) {
  try {
    if (!sessionId) return { success: false };

    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
    if (checkoutSession && checkoutSession.payment_status === "paid") {
      const paymentId = checkoutSession.metadata?.paymentId;
      const amountTotal = checkoutSession.amount_total ? checkoutSession.amount_total / 100 : 0;

      if (paymentId) {
        await db.payment.update({
          where: { id: paymentId },
          data: {
            status: "PAID",
            amountPaid: amountTotal,
            method: "ONLINE",
            reference: (checkoutSession.payment_intent as string) || checkoutSession.id,
            paidAt: new Date(),
          },
        });

        revalidatePath("/dashboard/mis-pagos");
        return { success: true, verified: true };
      }
    }

    return { success: true, verified: false };
  } catch (error) {
    console.error("Error verifying Stripe payment session:", error);
    return { success: false, error: "Error al verificar la sesión de pago." };
  }
}
