import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      errorMessage,
      errorStack,
      errorDigest,
      pathname,
      userId,
      userEmail,
      userName,
      userRole,
      userAgent,
      timestamp,
    } = body;

    // Persist to ActivityLog
    if (userId) {
      await db.activityLog.create({
        data: {
          userId,
          action: "FRONTEND_ERROR",
          entity: "dashboard",
          entityId: pathname ?? null,
          details: {
            errorMessage,
            errorStack,
            errorDigest,
            pathname,
            userAgent,
            timestamp,
          },
          ipAddress: req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown",
        },
      });
    }

    // Send email to admin
    if (process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL) {
      try {
        await resend?.emails.send({
          from: "Academia SEA <no-reply@kytcode.lat>",
          to: process.env.ADMIN_EMAIL,
          subject: `⚠️ Error en el Dashboard – ${pathname ?? "Ruta desconocida"}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
              <div style="background: #ef4444; color: white; padding: 16px 24px; border-radius: 8px 8px 0 0;">
                <h2 style="margin: 0; font-size: 18px;">⚠️ Error de Aplicación Detectado</h2>
                <p style="margin: 4px 0 0; opacity: 0.85; font-size: 13px;">${new Date(timestamp).toLocaleString("es-MX")}</p>
              </div>
              <div style="border: 1px solid #fecaca; border-top: none; border-radius: 0 0 8px 8px; padding: 24px;">
                <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #374151; width: 130px;">Usuario</td>
                    <td style="padding: 8px 0; color: #1f2937;">${userName ?? "Desconocido"} (${userEmail ?? "sin correo"})</td>
                  </tr>
                  <tr style="background: #f9fafb;">
                    <td style="padding: 8px; font-weight: bold; color: #374151;">Rol</td>
                    <td style="padding: 8px; color: #1f2937;">${userRole ?? "—"}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #374151;">Ruta</td>
                    <td style="padding: 8px 0; color: #1f2937;"><code>${pathname ?? "—"}</code></td>
                  </tr>
                  <tr style="background: #f9fafb;">
                    <td style="padding: 8px; font-weight: bold; color: #374151;">Digest</td>
                    <td style="padding: 8px; color: #1f2937;"><code>${errorDigest ?? "—"}</code></td>
                  </tr>
                </table>
                <div style="margin-top: 20px;">
                  <p style="font-weight: bold; color: #374151; margin-bottom: 8px;">Mensaje de error:</p>
                  <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 12px 16px; border-radius: 4px; font-family: monospace; font-size: 13px; color: #991b1b;">
                    ${errorMessage ?? "Sin mensaje"}
                  </div>
                </div>
                ${errorStack ? `
                <div style="margin-top: 16px;">
                  <p style="font-weight: bold; color: #374151; margin-bottom: 8px;">Stack trace:</p>
                  <pre style="background: #111827; color: #d1fae5; padding: 16px; border-radius: 8px; font-size: 11px; overflow-x: auto; white-space: pre-wrap;">${errorStack.substring(0, 2000)}</pre>
                </div>` : ""}
                <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">
                  Agente: ${userAgent ?? "—"}
                </p>
              </div>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error("Failed to send error email:", emailErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error in /api/log-error:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
