"use server";

import { writeClient } from "@/sanity/lib/client";
import { z } from "zod";
import { Resend } from "resend";
import { generateLeadConfirmationEmailHtml } from "@/lib/email-templates/lead-confirmation";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const leadSchema = z.object({
  firstName: z.string().min(2, "El nombre es obligatorio"),
  lastName: z.string().min(2, "El apellido es obligatorio"),
  email: z.string().email("Correo electrónico inválido"),
  country: z.string().min(1, "Selecciona tu país"),
  state: z.string().optional(),
  phoneType: z.enum(["Celular", "Fijo"]),
  phone: z.string().min(6, "Ingresa un número de teléfono válido"),
  target: z.enum(["Para mí", "Para mi hijo/a"]),
  ageRange: z.string().min(1, "Selecciona tu rango de edad"),
});

export type LeadFormInput = z.infer<typeof leadSchema>;

export async function submitHeroLead(data: LeadFormInput) {
  try {
    const validated = leadSchema.parse(data);
    const fullName = `${validated.firstName.trim()} ${validated.lastName.trim()}`;
    const nowIso = new Date().toISOString();
    const formattedDate = new Date().toLocaleString("es-MX", {
      timeZone: "America/Mexico_City",
      dateStyle: "full",
      timeStyle: "short",
    });

    const createdDoc = await writeClient.create({
      _type: "leadSubmission",
      firstName: validated.firstName.trim(),
      lastName: validated.lastName.trim(),
      fullName,
      email: validated.email.trim().toLowerCase(),
      country: validated.country,
      state: validated.state?.trim() || "",
      phoneType: validated.phoneType,
      phone: validated.phone.trim(),
      target: validated.target,
      ageRange: validated.ageRange,
      source: "Hero Principal Web",
      status: "pendiente",
      submittedAt: nowIso,
      notes: "Lead capturado desde el formulario Hero de la página principal.",
    });

    // Enviar correo de confirmación al prospecto
    try {
      if (resend && validated.email) {
        const html = generateLeadConfirmationEmailHtml({
          fullName,
          email: validated.email.trim().toLowerCase(),
          phone: validated.phone.trim(),
          target: validated.target,
          ageRange: validated.ageRange,
          country: validated.country,
          submittedAt: formattedDate,
        });

        await resend.emails.send({
          from: "Academia SEA <onboarding@resend.dev>",
          to: validated.email.trim().toLowerCase(),
          subject: `¡Bienvenido a Academia SEA! Muy pronto nos pondremos en contacto contigo`,
          html,
        });
      }
    } catch (emailErr) {
      console.error("Error enviando correo de confirmación de lead al usuario:", emailErr);
    }

    return {
      success: true,
      leadId: createdDoc._id,
      data: {
        fullName,
        country: validated.country,
        target: validated.target,
        ageRange: validated.ageRange,
      },
    };
  } catch (error: any) {
    console.error("Error guardando lead en Sanity:", error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || "Datos inválidos en el formulario",
      };
    }
    return {
      success: false,
      error: "No se pudo procesar tu solicitud. Por favor intenta de nuevo.",
    };
  }
}
