"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export async function createCalendarEvent(data: {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  type: string;
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "No autorizado" };
    }

    // Regla de permisos: el profesor solo tiene vista de lectura; solo el administrador puede crear eventos
    if (session.user.role !== "ADMIN") {
      return { 
        success: false, 
        error: "Solo los administradores tienen autorización para programar eventos en el calendario escolar." 
      };
    }

    const sede = (session?.user as any)?.sede || "SEAAUTLAN";

    const event = await db.calendarEvent.create({
      data: {
        title: data.title,
        description: data.description,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        type: data.type,
        sede: sede as any,
      },
    });

    revalidatePath("/dashboard/calendario");
    return { success: true, data: event };
  } catch (error) {
    console.error("Error creating event:", error);
    return { success: false, error: "Error al crear evento" };
  }
}

export async function deleteCalendarEvent(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return { success: false, error: "Solo los administradores pueden eliminar eventos" };
    }

    const existing = await db.calendarEvent.findUnique({ where: { id } });
    await db.calendarEvent.update({
      where: { id },
      data: {
        title: `[DESHABILITADO] ${existing?.title || ""}`.trim(),
        type: "CANCELLED",
      },
    });

    revalidatePath("/dashboard/calendario");
    return { success: true };
  } catch (error) {
    console.error("Error disabling event:", error);
    return { success: false, error: "Error al deshabilitar evento" };
  }
}
