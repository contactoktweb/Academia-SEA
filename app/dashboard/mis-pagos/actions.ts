"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { stripe } from "@/lib/stripe";
import { syncAndGenerateMonthlyPayments, SerializedInstallment } from "@/lib/payment-plan-service";

export type StudentInstallment = SerializedInstallment;

export async function getStudentPaymentSchedule() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "No autenticado" };
    }

    const studentProfile = await db.studentProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!studentProfile) {
      return { success: false, error: "No se encontró el perfil de estudiante." };
    }

    return await syncAndGenerateMonthlyPayments(studentProfile.id);
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
