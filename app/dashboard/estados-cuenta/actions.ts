"use server";

import { db } from "@/lib/db";
import { getSedeCondition } from "@/lib/multi-tenancy";

export async function getStudentAccountStatement(studentProfileId: string) {
  try {
    const sedeCondition = await getSedeCondition();

    // Verify student belongs to this sede (security check)
    const student = await db.studentProfile.findUnique({
      where: { id: studentProfileId, ...sedeCondition },
      include: {
        user: true,
        enrollments: {
          where: { status: "ACTIVE" },
          include: { course: true, group: true }
        }
      }
    });

    if (!student) {
      return { success: false, error: "Estudiante no encontrado en esta sede." };
    }

    // Fetch all payments for this student
    const allPayments = await db.payment.findMany({
      where: {
        studentId: studentProfileId,
        ...sedeCondition,
        status: { not: "CANCELLED" },
      },
      include: { concept: true, cycle: true },
      orderBy: { dueDate: "asc" }
    });

    const activePlans = await db.studentPaymentPlan.findMany({
      where: { studentId: studentProfileId, status: "ACTIVE", ...sedeCondition },
      include: { plan: true, concept: true }
    });

    // Categorize payments
    const pendingPayments = allPayments.filter(p => ["PENDING", "OVERDUE"].includes(p.status));
    const paidPayments = allPayments.filter(p => p.status === "PAID").sort((a, b) => new Date(b.paidAt || 0).getTime() - new Date(a.paidAt || 0).getTime());

    // Calculate totals
    const totalPaid = paidPayments.reduce((sum, p) => sum + Number(p.amountPaid || 0), 0);
    const totalDebt = pendingPayments.reduce((sum, p) => sum + Number(p.amount), 0);
    
    // Serialize to plain JS objects (Decimal workaround)
    const serializePayment = (p: any) => ({
      ...p,
      amount: Number(p.amount),
      amountPaid: p.amountPaid ? Number(p.amountPaid) : null,
      concept: p.concept ? { ...p.concept, amount: Number(p.concept.amount) } : null,
    });

    const serializePlan = (p: any) => ({
      ...p,
      customAmount: p.customAmount ? Number(p.customAmount) : null,
      discount: p.discount ? Number(p.discount) : null,
      plan: { ...p.plan, amount: Number(p.plan.amount) },
      concept: p.concept ? { ...p.concept, amount: Number(p.concept.amount) } : null,
    });

    return {
      success: true,
      data: {
        student: {
          name: student.user.name,
          email: student.user.email,
          phone: student.user.phone,
          enrollment: student.enrollments[0] || null,
        },
        pendingPayments: pendingPayments.map(serializePayment),
        paidPayments: paidPayments.map(serializePayment),
        activePlans: activePlans.map(serializePlan),
        summary: {
          totalPaid,
          totalDebt
        }
      }
    };
  } catch (error) {
    console.error("Error fetching account statement:", error);
    return { success: false, error: "Error al cargar el estado de cuenta" };
  }
}
