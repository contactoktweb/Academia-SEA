"use server";

import { client, writeClient } from "@/sanity/lib/client";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export interface ContactSubmissionItem {
  _id: string;
  _type: "contactSubmission";
  fullName: string;
  email: string;
  phone: string;
  sedeInteres: string;
  subject: string;
  message: string;
  source?: string;
  status: "pendiente" | "en_seguimiento" | "resuelto" | "archivado" | string;
  submittedAt: string;
  notes?: string;
}

export interface LeadSubmissionItem {
  _id: string;
  _type: "leadSubmission";
  firstName?: string;
  lastName?: string;
  fullName: string;
  email: string;
  country?: string;
  state?: string;
  phoneType?: "Celular" | "Fijo" | string;
  phone: string;
  target?: "Para mí" | "Para mi hijo/a" | string;
  ageRange?: string;
  source?: string;
  status: "pendiente" | "en_seguimiento" | "inscrito" | "cancelado" | string;
  submittedAt: string;
  notes?: string;
}

export async function getContactAndLeadSubmissions() {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return { success: false, error: "No autorizado", contacts: [], leads: [] };
    }

    const [contacts, leads] = await Promise.all([
      client.fetch<ContactSubmissionItem[]>(
        `*[_type == "contactSubmission"] | order(submittedAt desc)`
      ),
      client.fetch<LeadSubmissionItem[]>(
        `*[_type == "leadSubmission"] | order(submittedAt desc)`
      ),
    ]);

    return {
      success: true,
      contacts: contacts || [],
      leads: leads || [],
    };
  } catch (error: any) {
    console.error("Error fetching submissions from Sanity:", error);
    return {
      success: false,
      error: "Error al obtener los formularios de contacto y prospectos",
      contacts: [],
      leads: [],
    };
  }
}

export async function updateSubmissionStatus(
  id: string,
  status: string,
  notes?: string
) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return { success: false, error: "No autorizado" };
    }

    const patch = writeClient.patch(id).set({
      status,
      ...(notes !== undefined ? { notes } : {}),
    });

    await patch.commit();
    revalidatePath("/dashboard/contactos");

    return { success: true };
  } catch (error: any) {
    console.error("Error updating submission status in Sanity:", error);
    return { success: false, error: "No se pudo actualizar el estado" };
  }
}

export async function deleteSubmission(id: string) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return { success: false, error: "No autorizado" };
    }

    await writeClient.delete(id);
    revalidatePath("/dashboard/contactos");

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting submission in Sanity:", error);
    return { success: false, error: "No se pudo eliminar el registro" };
  }
}
