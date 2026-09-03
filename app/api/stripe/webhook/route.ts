import { NextRequest, NextResponse } from "next/server";
import { stripe, isStripeConfigured } from "@/lib/stripe";
import { db } from "@/lib/db";
import { syncAndGenerateMonthlyPayments } from "@/lib/payment-plan-service";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Falla en credenciales de Stripe. Configura STRIPE_WEBHOOK_SECRET y STRIPE_SECRET_KEY." },
      { status: 503 }
    );
  }

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (webhookSecret && signature && !webhookSecret.includes("tu_webhook_secret")) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      // Fallback para entornos de desarrollo / testing
      event = JSON.parse(body) as Stripe.Event;
    }
  } catch (err: any) {
    console.error(`⚠️ Webhook signature verification failed:`, err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Manejar evento de pago exitoso
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const paymentId = session.metadata?.paymentId;
    const amountTotal = session.amount_total ? session.amount_total / 100 : 0;

    if (paymentId) {
      try {
        const isAssisted = session.metadata?.isAssisted === "true";
        const tag = isAssisted ? "[ASISTIDO_STRIPE]" : "[PORTAL_ALUMNO]";
        
        const existing = await db.payment.findUnique({ 
          where: { id: paymentId },
          include: { concept: true },
        });
        const existingNotes = existing?.notes || "";
        const updatedNotes = existingNotes.includes(tag) 
          ? existingNotes 
          : `${tag} ${existingNotes}`.trim();

        await db.payment.update({
          where: { id: paymentId },
          data: {
            status: "PAID",
            amountPaid: amountTotal,
            method: "ONLINE",
            reference: (session.payment_intent as string) || session.id,
            paidAt: new Date(),
            notes: updatedNotes,
          },
        });

        if (existing?.studentId) {
          const isEnrollment =
            existing.concept?.type === "ENROLLMENT" ||
            existing.concept?.name?.toLowerCase().includes("inscripci") ||
            existing.notes?.toLowerCase().includes("inscripci");

          if (isEnrollment) {
            await db.studentEnrollment.updateMany({
              where: { studentId: existing.studentId, status: "ACTIVE" },
              data: { isPlanActive: true, planActivatedAt: new Date() },
            });
            await syncAndGenerateMonthlyPayments(existing.studentId, { forceActivate: true });
          } else {
            await syncAndGenerateMonthlyPayments(existing.studentId);
          }
        }
        console.log(`✅ Pago ${paymentId} actualizado a PAID (${isAssisted ? 'Asistido' : 'Portal Alumno'}) por Stripe Webhook`);
      } catch (dbError) {
        console.error("Error actualizando pago en base de datos:", dbError);
      }
    }
  }

  return NextResponse.json({ received: true });
}
