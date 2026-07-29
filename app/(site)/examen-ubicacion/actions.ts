"use server";

import { db } from "@/lib/db";
import { client, writeClient } from "@/sanity/lib/client";
import { GLOBAL_CONFIG_QUERY } from "@/sanity/lib/queries";
import { generatePlacementTestEmailHtml } from "@/lib/email-templates/placement-test-notification";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function submitPlacementTest(data: {
  name: string;
  ageCategory: string;
  email?: string;
  phone?: string;
  sede: string;
  score: number;
  totalQuestions: number;
  level: string;
  percentage: number;
  description?: string;
}) {
  try {
    // 1. Guardar en Base de Datos (Prisma / PostgreSQL)
    const testResult = await db.placementTest.create({
      data: {
        name: data.name,
        ageCategory: data.ageCategory,
        email: data.email,
        phone: data.phone,
        sede: data.sede as any,
        score: data.score,
        totalQuestions: data.totalQuestions,
        level: data.level,
        percentage: data.percentage,
      },
    });

    const nowIso = new Date().toISOString();
    const formattedDate = new Date().toLocaleString("es-MX", {
      timeZone: "America/Mexico_City",
      dateStyle: "full",
      timeStyle: "short",
    });

    // 2. Guardar en Sanity CMS (Documento de Submisión)
    try {
      await writeClient.create({
        _type: "placementTestSubmission",
        name: data.name,
        ageCategory: data.ageCategory,
        email: data.email || "",
        phone: data.phone || "",
        sede: data.sede,
        score: data.score,
        totalQuestions: data.totalQuestions,
        percentage: data.percentage,
        level: data.level,
        description: data.description || "",
        submittedAt: nowIso,
        status: "pendiente",
      });
    } catch (sanityErr) {
      console.error("Error guardando submisión en Sanity CMS:", sanityErr);
    }

    // 3. Notificar al Administrador por Correo Electrónico
    try {
      const globalConfig = await client.fetch(GLOBAL_CONFIG_QUERY);
      const recipientEmail =
        globalConfig?.notificationEmail ||
        globalConfig?.emailContacto ||
        process.env.ADMIN_EMAIL ||
        "admin@academiasea.com";

      if (resend && recipientEmail) {
        const htmlContent = generatePlacementTestEmailHtml({
          name: data.name,
          ageCategory: data.ageCategory,
          email: data.email,
          phone: data.phone,
          sede: data.sede,
          score: data.score,
          totalQuestions: data.totalQuestions,
          percentage: data.percentage,
          level: data.level,
          description: data.description || "",
          submittedAt: formattedDate,
        });

        await resend.emails.send({
          from: "Academia SEA <onboarding@resend.dev>",
          to: recipientEmail,
          subject: `📋 Nuevo Examen de Ubicación: ${data.name} (${data.level.split(" ")[0]})`,
          html: htmlContent,
        });
      } else {
        console.warn("Resend o correo de notificación no configurado. Alerta no enviada por email.");
      }
    } catch (emailErr) {
      console.error("Error enviando correo de notificación:", emailErr);
    }

    return { success: true, data: testResult };
  } catch (error) {
    console.error("Error submitting placement test:", error);
    return { success: false, error: "Hubo un problema guardando tu examen. Por favor, intenta de nuevo." };
  }
}
