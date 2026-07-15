"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createCalendarEvent(data: {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  type: string;
}) {
  try {
    const event = await db.calendarEvent.create({
      data: {
        title: data.title,
        description: data.description,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        type: data.type,
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
    await db.calendarEvent.delete({
      where: { id },
    });

    revalidatePath("/dashboard/calendario");
    return { success: true };
  } catch (error) {
    console.error("Error deleting event:", error);
    return { success: false, error: "Error al eliminar evento" };
  }
}
