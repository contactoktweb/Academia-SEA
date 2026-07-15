"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createPayment(data: {
  studentId: string;
  cycleId?: string;
  conceptId?: string;
  amount: number;
  dueDate: string;
  method?: string;
  notes?: string;
}) {
  try {
    const rawPayment = await db.payment.create({
      data: {
        studentId: data.studentId,
        cycleId: data.cycleId,
        conceptId: data.conceptId,
        amount: parseFloat(String(data.amount)),
        dueDate: new Date(data.dueDate),
        method: data.method || "CASH",
        status: "PENDING",
        notes: data.notes,
      },
      include: {
        student: true,
        concept: true,
      },
    });

    const payment = {
      ...rawPayment,
      amount: Number(rawPayment.amount),
      amountPaid: rawPayment.amountPaid ? Number(rawPayment.amountPaid) : null,
      concept: rawPayment.concept ? {
        ...rawPayment.concept,
        amount: Number(rawPayment.concept.amount),
      } : null,
    };

    revalidatePath("/dashboard/pagos");
    return { success: true, data: payment };
  } catch (error) {
    console.error("Error creating payment:", error);
    return { success: false, error: "Error al crear el pago" };
  }
}

export async function recordPayment(
  paymentId: string,
  data: {
    amountPaid: number;
    method: string;
    reference?: string;
  }
) {
  try {
    const rawPayment = await db.payment.update({
      where: { id: paymentId },
      data: {
        amountPaid: parseFloat(String(data.amountPaid)),
        method: data.method,
        reference: data.reference,
        paidAt: new Date(),
        status: "PAID",
      },
      include: {
        student: true,
        concept: true,
      },
    });

    const payment = {
      ...rawPayment,
      amount: Number(rawPayment.amount),
      amountPaid: rawPayment.amountPaid ? Number(rawPayment.amountPaid) : null,
      concept: rawPayment.concept ? {
        ...rawPayment.concept,
        amount: Number(rawPayment.concept.amount),
      } : null,
    };

    revalidatePath("/dashboard/pagos");
    return { success: true, data: payment };
  } catch (error) {
    console.error("Error recording payment:", error);
    return { success: false, error: "Error al registrar el pago" };
  }
}

export async function createChargeConcept(data: {
  name: string;
  description?: string;
  amount: number;
  type: string;
  cycleId?: string;
}) {
  try {
    const rawConcept = await db.chargeConcept.create({
      data: {
        name: data.name,
        description: data.description,
        amount: parseFloat(String(data.amount)),
        type: data.type,
        cycleId: data.cycleId,
      },
    });

    const concept = {
      ...rawConcept,
      amount: Number(rawConcept.amount),
    };

    revalidatePath("/dashboard/pagos");
    return { success: true, data: concept };
  } catch (error) {
    console.error("Error creating charge concept:", error);
    return { success: false, error: "Error al crear el concepto de cobro" };
  }
}

export async function createPaymentPlan(data: {
  name: string;
  description?: string;
  cycleId?: string;
  frequency: string;
  installments: number;
  amount: number;
  conceptId?: string;
  startDate?: string;
  endDate?: string;
}) {
  try {
    const rawPlan = await db.paymentPlan.create({
      data: {
        name: data.name,
        description: data.description,
        cycleId: data.cycleId,
        frequency: data.frequency,
        installments: data.installments,
        amount: parseFloat(String(data.amount)),
        conceptId: data.conceptId,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      },
    });

    const plan = {
      ...rawPlan,
      amount: Number(rawPlan.amount),
    };

    revalidatePath("/dashboard/pagos");
    return { success: true, data: plan };
  } catch (error) {
    console.error("Error creating payment plan:", error);
    return { success: false, error: "Error al crear el plan de pago" };
  }
}


export async function createScholarship(data: {
  name: string;
  description?: string;
  type: string;
  value: number;
  cycleId?: string;
}) {
  try {
    const rawScholarship = await db.scholarship.create({
      data: {
        name: data.name,
        description: data.description,
        type: data.type as any,
        value: parseFloat(String(data.value)),
        cycleId: data.cycleId,
      },
    });

    const scholarship = {
      ...rawScholarship,
      value: Number(rawScholarship.value),
    };

    revalidatePath("/dashboard/becas");
    return { success: true, data: scholarship };
  } catch (error) {
    console.error("Error creating scholarship:", error);
    return { success: false, error: "Error al crear la beca" };
  }
}
export async function deletePayment(id: string) {
  try {
    await db.payment.delete({
      where: { id },
    });

    revalidatePath("/dashboard/pagos");
    return { success: true };
  } catch (error) {
    console.error("Error deleting payment:", error);
    return { success: false, error: "Error al eliminar el pago" };
  }
}

export async function getPaymentMetadata() {
  try {
    const students = await db.user.findMany({
      where: { role: "STUDENT", isActive: true },
      select: { id: String, name: true, studentProfile: { select: { id: true } } },
    });
    const concepts = await db.chargeConcept.findMany();
    const serializedConcepts = concepts.map(c => ({
      ...c,
      amount: Number(c.amount)
    }));
    const cycles = await db.schoolCycle.findMany({ where: { isActive: true } });
    return { success: true, data: { students, concepts: serializedConcepts, cycles } };
  } catch (error) {
    return { success: false, error: "Error al cargar metadatos" };
  }
}

export async function getStudentFinancialSummary(studentProfileId: string) {
  try {
    const pendingPayments = await db.payment.findMany({
      where: {
        studentId: studentProfileId,
        status: { in: ["PENDING", "OVERDUE"] },
      },
      include: {
        concept: true,
      },
      orderBy: { dueDate: "asc" },
    });

    const activePlans = await db.studentPaymentPlan.findMany({
      where: {
        studentId: studentProfileId,
        status: "ACTIVE",
      },
      include: {
        plan: true,
        concept: true,
      },
    });

    // Serialize Decimals
    const serializedPending = pendingPayments.map(p => ({
      ...p,
      amount: Number(p.amount),
      amountPaid: p.amountPaid ? Number(p.amountPaid) : 0,
      concept: p.concept ? { ...p.concept, amount: Number(p.concept.amount) } : null,
    }));

    const serializedPlans = activePlans.map(p => ({
      ...p,
      customAmount: p.customAmount ? Number(p.customAmount) : null,
      discount: p.discount ? Number(p.discount) : null,
      plan: { ...p.plan, amount: Number(p.plan.amount) },
      concept: p.concept ? { ...p.concept, amount: Number(p.concept.amount) } : null,
    }));

    return {
      success: true,
      data: {
        pendingPayments: serializedPending,
        activePlans: serializedPlans,
      }
    };
  } catch (error) {
    console.error("Error getting financial summary:", error);
    return { success: false, error: "Error al cargar resumen financiero" };
  }
}
