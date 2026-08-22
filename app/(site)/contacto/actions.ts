"use server";

import { writeClient } from "@/sanity/lib/client";
import { z } from "zod";

const contactSchema = z.object({
  fullName: z.string().min(2, "El nombre completo es obligatorio"),
  email: z.string().email("Ingresa un correo electrónico válido"),
  phone: z.string().min(6, "Ingresa un número de teléfono o WhatsApp válido"),
  sedeInteres: z.string().min(1, "Selecciona una sede o modalidad"),
  subject: z.string().min(1, "Selecciona el motivo de contacto"),
  message: z.string().min(5, "Escribe tu mensaje o consulta (mínimo 5 caracteres)"),
});

export type ContactFormInput = z.infer<typeof contactSchema>;

export async function submitContactMessage(data: ContactFormInput) {
  try {
    const validated = contactSchema.parse(data);
    const nowIso = new Date().toISOString();

    const createdDoc = await writeClient.create({
      _type: "contactSubmission",
      fullName: validated.fullName.trim(),
      email: validated.email.trim().toLowerCase(),
      phone: validated.phone.trim(),
      sedeInteres: validated.sedeInteres,
      subject: validated.subject,
      message: validated.message.trim(),
      source: "Página de Contacto (/contacto)",
      status: "pendiente",
      submittedAt: nowIso,
      notes: `Mensaje enviado directamente desde el formulario de la página de contacto.`,
    });

    return {
      success: true,
      messageId: createdDoc._id,
      data: {
        fullName: validated.fullName,
        sedeInteres: validated.sedeInteres,
        subject: validated.subject,
      },
    };
  } catch (error: any) {
    console.error("Error guardando mensaje de contacto en Sanity:", error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || "Datos inválidos en el formulario",
      };
    }
    return {
      success: false,
      error: "No se pudo enviar tu mensaje. Por favor intenta nuevamente.",
    };
  }
}
