"use server";

import { writeClient } from "@/sanity/lib/client";
import { z } from "zod";

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
