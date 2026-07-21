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
            <!DOCTYPE html>
            <html lang="es">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Código de Verificación</title>
              <!--[if mso]>
              <noscript>
              <xml>
              <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
              </o:OfficeDocumentSettings>
              </xml>
              </noscript>
              <![endif]-->
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f7f6; -webkit-font-smoothing: antialiased;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f4f7f6" style="padding: 40px 20px;">
                <tr>
                  <td align="center">
                    <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
                      
                      <!-- Header -->
                      <tr>
                        <td bgcolor="#0284c7" align="center" style="padding: 40px 0; background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);">
                          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">Academia SEA</h1>
                          <p style="color: #e0f2fe; margin: 10px 0 0 0; font-size: 15px;">Seguridad de la cuenta</p>
                        </td>
                      </tr>
                      
                      <!-- Body -->
                      <tr>
                        <td align="center" style="padding: 40px 40px;">
                          <h2 style="color: #0f172a; margin: 0 0 20px 0; font-size: 22px; font-weight: 700;">Confirma tu correo electrónico</h2>
                          <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0; text-align: center;">
                            ¡Hola! Estás a un paso de completar tu registro. Usa el siguiente código de seguridad para verificar tu cuenta y acceder a tu panel.
                          </p>
                          
                          <!-- OTP Box -->
                          <div style="background-color: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 24px; margin-bottom: 30px;">
                            <span style="font-family: monospace; font-size: 38px; font-weight: 800; letter-spacing: 8px; color: #0284c7; display: block; text-align: center;">
                              ${code}
                            </span>
                          </div>
                          
                          <p style="color: #64748b; font-size: 14px; line-height: 1.5; margin: 0; text-align: center;">
                            Este código expirará en <strong>15 minutos</strong>.<br>
                            Si no solicitaste este registro, puedes ignorar este correo de forma segura.
                          </p>
                        </td>
                      </tr>
                      
                      <!-- Footer -->
                      <tr>
                        <td align="center" style="padding: 24px 40px; background-color: #f8fafc; border-top: 1px solid #f1f5f9;">
                          <p style="color: #94a3b8; font-size: 12px; line-height: 1.5; margin: 0;">
                            © ${new Date().getFullYear()} Academia SEA. Todos los derechos reservados.<br>
                            Desarrollado por K&T ❤️
                          </p>
                        </td>
                      </tr>
                      
                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>
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
