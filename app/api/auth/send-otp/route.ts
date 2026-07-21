import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "El correo es requerido." }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Este correo ya está registrado." }, { status: 400 });
    }

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Upsert verification code (replace if exists for this email)
    await db.verificationCode.deleteMany({
      where: { email },
    });

    await db.verificationCode.create({
      data: {
        email,
        code,
        expiresAt,
      },
    });

    // Send email using Resend
    if (resend) {
      try {
        await resend.emails.send({
          from: "Academia SEA <onboarding@resend.dev>", // Testing domain or verified domain
          to: email,
          subject: "Código de Verificación - Academia SEA",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px;">
              <h2 style="color: #0f172a; margin-top: 0;">Verifica tu correo electrónico</h2>
              <p style="color: #475569; font-size: 16px;">
                Ingresa el siguiente código de 6 dígitos en la pantalla de registro para verificar tu cuenta en Academia SEA:
              </p>
              <div style="background-color: #f1f5f9; padding: 16px; border-radius: 8px; text-align: center; margin: 24px 0;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #0284c7;">${code}</span>
              </div>
              <p style="color: #64748b; font-size: 14px;">
                Este código expira en 15 minutos. Si no solicitaste este código, puedes ignorar este correo.
              </p>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error("Error sending email with Resend:", emailErr);
      }
    } else {
      console.warn("RESEND_API_KEY is not set. OTP code is:", code);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error in /api/auth/send-otp:", err);
    return NextResponse.json({ error: "Error al enviar el código de verificación." }, { status: 500 });
  }
}
