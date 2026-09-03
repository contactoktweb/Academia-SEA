"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { getSedeCondition } from "@/lib/multi-tenancy";
import { stripe, isStripeConfigured } from "@/lib/stripe";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { syncAndGenerateMonthlyPayments } from "@/lib/payment-plan-service";

export async function createPayment(data: {
  studentId: string;
  cycleId?: string;
  conceptId?: string;
  amount: number;
  dueDate: string;
  method?: string;
  notes?: string;
  status?: "PENDING" | "PAID" | string;
  paidAt?: string;
  reference?: string;
  receiptUrl?: string;
}) {
  try {
    const concept = data.conceptId
      ? await db.chargeConcept.findUnique({ where: { id: data.conceptId } })
      : null;

    const isEnrollment =
      concept?.type === "ENROLLMENT" ||
      concept?.name?.toLowerCase().includes("inscripci") ||
      data.notes?.toLowerCase().includes("inscripci");

    const isTuition =
      concept?.type === "TUITION" ||
      concept?.name?.toLowerCase().includes("mensualidad") ||
      concept?.name?.toLowerCase().includes("colegiatura") ||
      data.notes?.toLowerCase().includes("mensualidad") ||
      data.notes?.toLowerCase().includes("colegiatura");

    // Si es un cobro de mensualidad y se está registrando pagado, descontar la cuota pendiente más antigua
    if (isTuition) {
      const existingPendingTuition = await db.payment.findFirst({
        where: {
          studentId: data.studentId,
          status: "PENDING",
          OR: [
            { conceptId: data.conceptId },
            { concept: { type: "TUITION" } },
            { notes: { contains: "Colegiatura" } },
            { notes: { contains: "Mensualidad" } },
          ],
        },
        orderBy: { dueDate: "asc" },
      });

      if (existingPendingTuition && data.status === "PAID") {
        const autoRef = `REC-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}${String(new Date().getDate()).padStart(2, "0")}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        const updated = await db.payment.update({
          where: { id: existingPendingTuition.id },
          data: {
            amountPaid: parseFloat(String(data.amount)),
            status: "PAID",
            method: (data.method as any) || "BANK_TRANSFER",
            paidAt: data.paidAt ? new Date(data.paidAt) : new Date(),
            reference: data.reference || autoRef,
            receiptUrl: data.receiptUrl || null,
            notes: data.notes ? `${existingPendingTuition.notes || ""} | ${data.notes}`.trim() : existingPendingTuition.notes,
          },
          include: {
            student: { include: { user: true } },
            concept: true,
          },
        });

        await syncAndGenerateMonthlyPayments(data.studentId);
        revalidatePath("/dashboard/pagos");
        revalidatePath("/dashboard/mis-pagos");
        revalidatePath("/dashboard/estados-cuenta");
        revalidatePath("/dashboard/alumnos");

        return {
          success: true,
          data: {
            ...updated,
            amount: Number(updated.amount),
            amountPaid: Number(updated.amountPaid),
            concept: updated.concept ? { ...updated.concept, amount: Number(updated.concept.amount) } : null,
          },
          message: "Mensualidad descontada y registrada como pagada con éxito.",
        };
      }
    }

    const rawPayment = await db.payment.create({
      data: {
        studentId: data.studentId,
        cycleId: data.cycleId,
        conceptId: data.conceptId,
        amount: parseFloat(String(data.amount)),
        dueDate: new Date(data.dueDate),
        method: (data.method as any) || "CASH",
        status: (data.status as any) || "PENDING",
        amountPaid: data.status === "PAID" ? parseFloat(String(data.amount)) : null,
        paidAt: data.status === "PAID" ? (data.paidAt ? new Date(data.paidAt) : new Date()) : null,
        reference: data.reference || null,
        receiptUrl: data.receiptUrl || null,
        notes: data.notes,
        sede: ((await auth())?.user as any)?.sede || "SEAAUTLAN",
      },
      include: {
        student: { include: { user: true } },
        concept: true,
      },
    });

    // Si es cobro/pago de inscripción, habilitar el plan de mensualidades del alumno
    if (isEnrollment) {
      await db.studentEnrollment.updateMany({
        where: { studentId: data.studentId, status: "ACTIVE" },
        data: { isPlanActive: true, planActivatedAt: new Date() },
      });
      await syncAndGenerateMonthlyPayments(data.studentId, { forceActivate: true });
    } else if (isTuition) {
      await syncAndGenerateMonthlyPayments(data.studentId);
    }

    const rawConcept = (rawPayment as any).concept;
    const payment = {
      ...rawPayment,
      amount: Number(rawPayment.amount),
      amountPaid: rawPayment.amountPaid ? Number(rawPayment.amountPaid) : null,
      concept: rawConcept
        ? {
            ...rawConcept,
            amount: Number(rawConcept.amount),
          }
        : null,
    };

    revalidatePath("/dashboard/pagos");
    revalidatePath("/dashboard/mis-pagos");
    revalidatePath("/dashboard/estados-cuenta");
    revalidatePath("/dashboard/alumnos");

    return {
      success: true,
      data: payment,
      message: isEnrollment
        ? "Cobro de inscripción registrado. El plan de cuotas de mensualidades ha sido habilitado para el alumno."
        : undefined,
    };
  } catch (error) {
    console.error("Error creating payment:", error);
    return { success: false, error: "Error al crear el pago" };
  }
}

export async function updatePayment(
  paymentId: string,
  data: {
    conceptId?: string;
    amount?: number;
    dueDate?: string;
    notes?: string;
  }
) {
  try {
    const existing = await db.payment.findUnique({ where: { id: paymentId } });
    if (!existing) {
      return { success: false, error: "Pago no encontrado" };
    }

    const updateData: any = {};
    if (data.conceptId !== undefined) updateData.conceptId = data.conceptId || null;
    if (data.amount !== undefined && !isNaN(data.amount)) updateData.amount = parseFloat(String(data.amount));
    if (data.dueDate) updateData.dueDate = new Date(data.dueDate);
    if (data.notes !== undefined) updateData.notes = data.notes;

    const rawPayment = await db.payment.update({
      where: { id: paymentId },
      data: updateData,
      include: {
        student: { include: { user: true } },
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
    revalidatePath("/dashboard/mis-pagos");
    revalidatePath("/dashboard/estados-cuenta");
    return { success: true, data: payment };
  } catch (error) {
    console.error("Error updating payment:", error);
    return { success: false, error: "Error al actualizar el cobro" };
  }
}

export async function updatePaymentDueDate(paymentId: string, newDueDate: string) {
  try {
    if (!newDueDate) {
      return { success: false, error: "Fecha de vencimiento requerida" };
    }

    const updated = await db.payment.update({
      where: { id: paymentId },
      data: {
        dueDate: new Date(newDueDate),
      },
    });

    revalidatePath("/dashboard/pagos");
    revalidatePath("/dashboard/mis-pagos");
    revalidatePath("/dashboard/estados-cuenta");
    revalidatePath("/dashboard/alumnos");

    return { success: true, data: updated };
  } catch (error) {
    console.error("Error updating payment due date:", error);
    return { success: false, error: "Error al actualizar la fecha de vencimiento" };
  }
}

export async function recordPayment(
  paymentId: string,
  data: {
    amountPaid: number;
    method: string;
    reference?: string;
    receiptUrl?: string;
    paidAt?: string | Date;
    notes?: string;
  }
) {
  try {
    const existing = await db.payment.findUnique({ where: { id: paymentId } });
    if (!existing) {
      return { success: false, error: "Pago no encontrado" };
    }

    // Si no se proporcionó número de referencia, asignar uno automático
    const autoRef = `REC-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}${String(new Date().getDate()).padStart(2, "0")}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const finalReference = data.reference?.trim() || autoRef;

    // Asegurar que el monto registrado sea exactamente el del cobro si no fue especificado o fue alterado
    const finalAmountPaid = data.amountPaid && data.amountPaid > 0 
      ? parseFloat(String(data.amountPaid)) 
      : Number(existing.amount);

    // Fecha de pago proporcionada (validar y asignar timestamp)
    let finalPaidAt = new Date();
    if (data.paidAt) {
      const parsedDate = new Date(data.paidAt);
      if (!isNaN(parsedDate.getTime())) {
        const now = new Date();
        if (typeof data.paidAt === "string" && data.paidAt.length === 10) {
          const [y, m, d] = data.paidAt.split("-").map(Number);
          finalPaidAt = new Date(y, m - 1, d, now.getHours(), now.getMinutes(), now.getSeconds());
        } else {
          finalPaidAt = parsedDate;
        }
      }
    }

    const rawPayment = await db.payment.update({
      where: { id: paymentId },
      data: {
        amountPaid: finalAmountPaid,
        method: (data.method as any) || "BANK_TRANSFER",
        reference: finalReference,
        receiptUrl: data.receiptUrl || existing.receiptUrl || null,
        paidAt: finalPaidAt,
        status: "PAID",
        notes: data.notes || existing.notes,
      },
      include: {
        student: { include: { user: true } },
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

    // Regla de negocio: Si el pago liquidado es de Inscripción, habilitar el plan de cuotas del alumno
    const concept = existing.conceptId
      ? await db.chargeConcept.findUnique({ where: { id: existing.conceptId } })
      : null;

    const isEnrollment =
      concept?.type === "ENROLLMENT" ||
      concept?.name?.toLowerCase().includes("inscripci") ||
      existing.notes?.toLowerCase().includes("inscripci");

    if (isEnrollment) {
      await db.studentEnrollment.updateMany({
        where: { studentId: existing.studentId, status: "ACTIVE" },
        data: { isPlanActive: true, planActivatedAt: new Date() },
      });
      await syncAndGenerateMonthlyPayments(existing.studentId, { forceActivate: true });
    } else {
      // Recalcular el plan para que descuente la cuota pagada
      await syncAndGenerateMonthlyPayments(existing.studentId);
    }

    revalidatePath("/dashboard/pagos");
    revalidatePath("/dashboard/mis-pagos");
    revalidatePath("/dashboard/estados-cuenta");
    revalidatePath("/dashboard/alumnos");
    revalidatePath("/dashboard/metricas");
    return { success: true, data: payment };
  } catch (error) {
    console.error("Error recording payment:", error);
    return { success: false, error: "Error al registrar el pago" };
  }
}

export async function uploadPaymentReceipt(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, error: "No se seleccionó ningún archivo de comprobante" };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Determinar el MIME type exacto del archivo
    let mimeType = file.type;
    if (!mimeType || mimeType === "application/octet-stream") {
      const ext = path.extname(file.name).toLowerCase();
      if (ext === ".pdf") mimeType = "application/pdf";
      else if (ext === ".png") mimeType = "image/png";
      else if (ext === ".webp") mimeType = "image/webp";
      else if (ext === ".gif") mimeType = "image/gif";
      else mimeType = "image/jpeg";
    }

    // Convertir a Data URI en Base64 para almacenarlo directamente en la base de datos (PostgreSQL/Supabase)
    const base64 = buffer.toString("base64");
    const dataUrl = `data:${mimeType};base64,${base64}`;

    return { success: true, url: dataUrl };
  } catch (error) {
    console.error("Error processing payment receipt for database:", error);
    return { success: false, error: "Error al procesar el comprobante para la base de datos" };
  }
}

export async function generateAssistedPaymentLink(paymentId: string) {
  if (!isStripeConfigured()) {
    return { success: false, error: "⚠️ Falla en credenciales de Stripe. Configura STRIPE_SECRET_KEY y NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY en las variables de entorno." };
  }

  try {
    const payment = await db.payment.findUnique({
      where: { id: paymentId },
      include: {
        student: {
          include: {
            user: true,
            enrollments: { where: { status: "ACTIVE" }, include: { course: true } },
          },
        },
        concept: true,
      },
    });

    if (!payment) {
      return { success: false, error: "Registro de pago no encontrado" };
    }

    const studentName = payment.student.user.name;
    const studentPhone = payment.student.user.phone || payment.student.emergencyPhone || "";
    const studentEmail = payment.student.user.email;
    const conceptName = payment.concept?.name || payment.notes || "Colegiatura de Curso";
    const courseName = payment.student.enrollments[0]?.course?.name || "Curso de Inglés";
    const amount = Number(payment.amount);

    const origin = process.env.NEXTAUTH_URL || "http://localhost:3000";

    // Crear sesión de Stripe Checkout
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "mxn",
            product_data: {
              name: `Academia SEA - ${conceptName} (${courseName})`,
              description: `Pago asistido para el alumno: ${studentName}`,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: studentEmail || undefined,
      metadata: {
        paymentId: payment.id,
        studentProfileId: payment.studentId,
        userId: payment.student.userId,
        isAssisted: "true",
      },
      success_url: `${origin}/pago-confirmado?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pago-confirmado?payment_status=cancelled`,
    });

    // Formatear mensaje para WhatsApp
    let cleanPhone = studentPhone.replace(/\D/g, "");
    if (cleanPhone.length === 10) {
      cleanPhone = `52${cleanPhone}`;
    }

    const messageText = `Hola ${studentName}, te compartimos tu enlace de pago seguro para tu colegiatura en Academia SEA por un monto de $${amount.toFixed(2)} MXN (${conceptName}):\n\n${checkoutSession.url}\n\nUna vez realizado, tu pago quedará acreditado automáticamente en el sistema. ¡Gracias!`;
    const whatsappUrl = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`
      : `https://wa.me/?text=${encodeURIComponent(messageText)}`;

    return {
      success: true,
      data: {
        paymentId: payment.id,
        paymentUrl: checkoutSession.url,
        whatsappUrl,
        studentName,
        studentPhone: cleanPhone,
        amount,
        conceptName,
      },
    };
  } catch (error: any) {
    console.error("Error generating assisted payment link:", error);
    return { success: false, error: error.message || "Error al generar enlace de pago en Stripe" };
  }
}

export async function revertPayment(paymentId: string, reason: string) {
  try {
    if (!reason || !reason.trim()) {
      return { success: false, error: "El motivo de la reversión es obligatorio." };
    }

    const existing = await db.payment.findUnique({ where: { id: paymentId } });
    if (!existing) {
      return { success: false, error: "Pago no encontrado" };
    }

    const today = new Date();
    const isOverdue = new Date(existing.dueDate) < today;
    const newStatus = isOverdue ? "OVERDUE" : "PENDING";

    const updatedNotes = existing.notes
      ? `${existing.notes} | [Revertido el ${today.toLocaleDateString("es-MX")}: ${reason.trim()}]`
      : `[Revertido el ${today.toLocaleDateString("es-MX")}: ${reason.trim()}]`;

    await db.payment.update({
      where: { id: paymentId },
      data: {
        status: newStatus as any,
        amountPaid: null,
        paidAt: null,
        receiptUrl: null,
        reference: null,
        notes: updatedNotes,
      },
    });

    revalidatePath("/dashboard/pagos");
    revalidatePath("/dashboard/mis-pagos");
    revalidatePath("/dashboard/estados-cuenta");
    revalidatePath("/dashboard/metricas");
    return { success: true };
  } catch (error) {
    console.error("Error reverting payment:", error);
    return { success: false, error: "Error al revertir el pago" };
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
        sede: ((await auth())?.user as any)?.sede || "SEAAUTLAN",
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
        sede: ((await auth())?.user as any)?.sede || "SEAAUTLAN",
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
        sede: ((await auth())?.user as any)?.sede || "SEAAUTLAN",
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
    const existing = await db.payment.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, error: "Pago no encontrado" };
    }

    if (existing.status === "PAID") {
      return {
        success: false,
        error: "Un pago ya cobrado/pagado no se puede eliminar directamente. Debe revertirlo primero a pendiente con su respectivo motivo.",
      };
    }

    // Deshabilitación/Cancelación lógica sin pérdida de registro contable
    await db.payment.update({
      where: { id },
      data: {
        status: "CANCELLED",
      },
    });

    revalidatePath("/dashboard/pagos");
    revalidatePath("/dashboard/mis-pagos");
    revalidatePath("/dashboard/estados-cuenta");
    revalidatePath("/dashboard/metricas");
    return { success: true };
  } catch (error) {
    console.error("Error disabling payment:", error);
    return { success: false, error: "Error al deshabilitar el pago" };
  }
}

export async function getPaymentMetadata() {
  try {
    const sedeCondition = await getSedeCondition();
    const students = await db.user.findMany({
      where: { 
        role: "STUDENT", 
        isActive: true, 
        deletedAt: null,
        ...sedeCondition 
      },
      select: { id: true, name: true, phone: true, studentProfile: { select: { id: true } } },
    });

    let concepts = await db.chargeConcept.findMany({ where: { isActive: true, ...sedeCondition } });
    
    // Si no existen conceptos para esta sede, creamos automáticamente los conceptos base
    if (concepts.length === 0) {
      const activeSede = ((await auth())?.user as any)?.sede || "SEAAUTLAN";
      const defaultConceptsData = [
        { name: "Colegiatura Mensual", amount: 800.0, type: "TUITION", description: "Mensualidad de curso regular de inglés", sede: activeSede },
        { name: "Inscripción Ciclo Escolar", amount: 500.0, type: "ENROLLMENT", description: "Inscripción a ciclo formativo", sede: activeSede },
        { name: "Materiales y Libros", amount: 650.0, type: "BOOKS", description: "Libros y recursos didácticos", sede: activeSede },
        { name: "Examen de Certificación / TOEFL", amount: 1200.0, type: "EXAM_FEE", description: "Derecho a examen oficial de certificación", sede: activeSede },
        { name: "Examen de Ubicación", amount: 250.0, type: "EXAM_FEE", description: "Evaluación diagnóstica inicial", sede: activeSede },
      ];
      await db.chargeConcept.createMany({ data: defaultConceptsData });
      concepts = await db.chargeConcept.findMany({ where: { isActive: true, ...sedeCondition } });
    }

    const serializedConcepts = concepts.map((c) => ({
      ...c,
      amount: Number(c.amount),
    }));
    const cycles = await db.schoolCycle.findMany({ where: { isActive: true, ...sedeCondition } });
    return { success: true, data: { students, concepts: serializedConcepts, cycles } };
  } catch (error) {
    return { success: false, error: "Error al cargar metadatos" };
  }
}

export async function generateAssistedTotalPaymentLink(studentProfileId: string) {
  if (!isStripeConfigured()) {
    return { success: false, error: "⚠️ Falla en credenciales de Stripe. Configura STRIPE_SECRET_KEY y NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY en las variables de entorno." };
  }

  try {
    const student = await db.studentProfile.findUnique({
      where: { id: studentProfileId },
      include: {
        user: true,
        enrollments: { where: { status: "ACTIVE" }, include: { course: true } },
      },
    });

    if (!student) {
      return { success: false, error: "Estudiante no encontrado" };
    }

    const pendingPayments = await db.payment.findMany({
      where: {
        studentId: studentProfileId,
        status: { in: ["PENDING", "OVERDUE"] },
      },
      include: { concept: true },
      orderBy: { dueDate: "asc" },
    });

    const totalDebt = pendingPayments.reduce((acc, p) => acc + (Number(p.amount) - Number(p.amountPaid || 0)), 0);
    const amount = totalDebt > 0 ? totalDebt : 800;

    const studentName = student.user.name;
    const studentPhone = student.user.phone || student.emergencyPhone || "";
    const studentEmail = student.user.email;
    const courseName = student.enrollments[0]?.course?.name || "Curso de Inglés";
    const conceptName = totalDebt > 0 
      ? `Saldo Pendiente (${pendingPayments.length} pago${pendingPayments.length > 1 ? "s" : ""})` 
      : "Colegiatura de Curso";

    const origin = process.env.NEXTAUTH_URL || "http://localhost:3000";

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "mxn",
            product_data: {
              name: `Academia SEA - ${conceptName} (${courseName})`,
              description: `Pago asistido para el alumno: ${studentName}`,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: studentEmail || undefined,
      metadata: {
        studentProfileId: student.id,
        userId: student.userId,
        isAssisted: "true",
        paymentId: pendingPayments[0]?.id || "",
      },
      success_url: `${origin}/pago-confirmado?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pago-confirmado?payment_status=cancelled`,
    });

    let cleanPhone = studentPhone.replace(/\D/g, "");
    if (cleanPhone.length === 10) {
      cleanPhone = `52${cleanPhone}`;
    }

    const messageText = `Hola ${studentName}, te compartimos tu enlace de pago seguro en Academia SEA por un monto de $${amount.toFixed(2)} MXN (${conceptName}):\n\n${checkoutSession.url}\n\nUna vez realizado, tu pago quedará acreditado automáticamente en el sistema. ¡Gracias!`;
    const whatsappUrl = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`
      : `https://wa.me/?text=${encodeURIComponent(messageText)}`;

    return {
      success: true,
      data: {
        paymentUrl: checkoutSession.url,
        whatsappUrl,
        studentName,
        studentPhone: cleanPhone,
        amount,
        conceptName,
      },
    };
  } catch (error: any) {
    console.error("Error generating assisted total payment link:", error);
    return { success: false, error: error.message || "Error al generar enlace de pago en Stripe" };
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

    const serializedPending = pendingPayments.map((p) => ({
      ...p,
      amount: Number(p.amount),
      amountPaid: p.amountPaid ? Number(p.amountPaid) : 0,
      concept: p.concept ? { ...p.concept, amount: Number(p.concept.amount) } : null,
    }));

    const serializedPlans = activePlans.map((p) => ({
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
      },
    };
  } catch (error) {
    console.error("Error getting financial summary:", error);
    return { success: false, error: "Error al cargar resumen financiero" };
  }
}

export async function generatePendingEnrollmentPayments() {
  try {
    const students = await db.studentProfile.findMany({
      where: {
        isActive: true,
        user: { isActive: true, deletedAt: null },
        enrollments: { some: { status: "ACTIVE" } },
      },
      select: { id: true },
    });

    let syncCount = 0;
    for (const s of students) {
      const res = await syncAndGenerateMonthlyPayments(s.id);
      if (res.success) {
        syncCount++;
      }
    }

    try {
      revalidatePath("/dashboard/pagos");
      revalidatePath("/dashboard/estados-cuenta");
      revalidatePath("/dashboard/alumnos");
      revalidatePath("/dashboard/mis-pagos");
    } catch {}

    return { success: true, count: syncCount, totalStudents: students.length };
  } catch (error) {
    console.error("Error generating pending enrollment payments:", error);
    return { success: false, error: "Error al sincronizar cuotas pendientes de mensualidad" };
  }
}

export async function getPaginatedPaymentsAction(params: {
  page?: number;
  pageSize?: number;
  search?: string;
  concept?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}) {
  try {
    const sedeCondition = await getSedeCondition();
    const page = Math.max(1, Number(params.page) || 1);
    const pageSize = Math.max(1, Math.min(100, Number(params.pageSize) || 10));

    const where: any = {
      ...sedeCondition,
      status: { not: "CANCELLED" },
    };

    // 1. Filtro por Estado
    if (params.status && params.status !== "ALL") {
      where.status = params.status;
    }

    // 2. Filtro por Concepto
    if (params.concept && params.concept !== "ALL") {
      const c = params.concept.trim();
      where.AND = [
        ...(where.AND || []),
        {
          OR: [
            { conceptId: c },
            { concept: { name: { contains: c, mode: "insensitive" } } },
            { notes: { contains: c, mode: "insensitive" } },
          ],
        },
      ];
    }

    // 3. Filtro por Buscador (Alumno, Email, Folio/Referencia, Notas, Concepto)
    if (params.search && params.search.trim()) {
      const q = params.search.trim();
      where.AND = [
        ...(where.AND || []),
        {
          OR: [
            { student: { user: { name: { contains: q, mode: "insensitive" } } } },
            { student: { user: { email: { contains: q, mode: "insensitive" } } } },
            { reference: { contains: q, mode: "insensitive" } },
            { notes: { contains: q, mode: "insensitive" } },
            { concept: { name: { contains: q, mode: "insensitive" } } },
          ],
        },
      ];
    }

    // 4. Filtro por Fecha o Rango de Fechas
    if (params.startDate || params.endDate) {
      const dateConditions: any[] = [];
      if (params.startDate) {
        const start = new Date(`${params.startDate}T00:00:00.000Z`);
        dateConditions.push({
          OR: [
            { paidAt: { gte: start } },
            { AND: [{ paidAt: null }, { dueDate: { gte: start } }] },
            { AND: [{ paidAt: null }, { dueDate: null }, { createdAt: { gte: start } }] },
          ],
        });
      }
      if (params.endDate) {
        const end = new Date(`${params.endDate}T23:59:59.999Z`);
        dateConditions.push({
          OR: [
            { paidAt: { lte: end } },
            { AND: [{ paidAt: null }, { dueDate: { lte: end } }] },
            { AND: [{ paidAt: null }, { dueDate: null }, { createdAt: { lte: end } }] },
          ],
        });
      }
      if (dateConditions.length > 0) {
        where.AND = [...(where.AND || []), ...dateConditions];
      }
    }

    const [totalCount, rawPayments] = await Promise.all([
      db.payment.count({ where }),
      db.payment.findMany({
        where,
        include: {
          student: { include: { user: true } },
          concept: true,
          cycle: true,
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    const payments = rawPayments.map((p) => ({
      ...p,
      amount: Number(p.amount),
      amountPaid: p.amountPaid ? Number(p.amountPaid) : null,
      concept: p.concept
        ? {
            ...p.concept,
            amount: Number(p.concept.amount),
          }
        : null,
    }));

    return {
      success: true,
      data: {
        payments,
        totalCount,
        page,
        pageSize,
        totalPages: Math.max(1, Math.ceil(totalCount / pageSize)),
      },
    };
  } catch (error) {
    console.error("Error fetching paginated payments:", error);
    return { success: false, error: "Error al cargar pagos paginados" };
  }
}

