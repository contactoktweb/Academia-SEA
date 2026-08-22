import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { stripe, isStripeConfigured } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Falla en credenciales de Stripe. Configura STRIPE_SECRET_KEY y NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY." },
      { status: 503 }
    );
  }

  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { paymentId, installmentNumber, amount, conceptName, courseName } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Monto de pago inválido" }, { status: 400 });
    }

    const studentProfile = await db.studentProfile.findUnique({
      where: { userId: session.user.id },
      include: { user: true },
    });

    if (!studentProfile) {
      return NextResponse.json({ error: "Perfil de estudiante no encontrado" }, { status: 404 });
    }

    let targetPaymentId = paymentId;

    // Si no existe un paymentId previo, crear el registro de pago pendiente
    if (!targetPaymentId) {
      const newPayment = await db.payment.create({
        data: {
          studentId: studentProfile.id,
          amount: parseFloat(String(amount)),
          dueDate: body.dueDate ? new Date(body.dueDate) : new Date(),
          status: "PENDING",
          method: "ONLINE",
          sede: studentProfile.sede || "SEAAUTLAN",
          notes: `Pago en línea para mensualidad ${installmentNumber || ""}: ${conceptName || "Colegiatura"}`,
        },
      });
      targetPaymentId = newPayment.id;
    }

    const origin = req.headers.get("origin") || process.env.NEXTAUTH_URL || "http://localhost:3000";

    const lineItemTitle = `Academia SEA - Mensualidad ${installmentNumber ? `${installmentNumber}` : ""} ${courseName ? `(${courseName})` : ""}`.trim();
    const lineItemDescription = conceptName || "Pago de colegiatura mensual del curso de inglés";

    // Crear sesión de Stripe Checkout
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "mxn",
            product_data: {
              name: lineItemTitle,
              description: lineItemDescription,
            },
            unit_amount: Math.round(parseFloat(String(amount)) * 100), // en centavos
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: studentProfile.user.email || undefined,
      metadata: {
        paymentId: targetPaymentId,
        studentProfileId: studentProfile.id,
        userId: session.user.id,
        installmentNumber: String(installmentNumber || 1),
      },
      success_url: `${origin}/pago-confirmado?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pago-confirmado?payment_status=cancelled`,
    });

    return NextResponse.json({ success: true, url: checkoutSession.url });
  } catch (error: any) {
    console.error("Error creating stripe checkout session:", error);
    return NextResponse.json(
      { error: error.message || "Error al procesar el pago con Stripe" },
      { status: 500 }
    );
  }
}
