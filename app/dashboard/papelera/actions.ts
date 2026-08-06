"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getDeletedUsers() {
  try {
    const users = await db.user.findMany({
      where: {
        deletedAt: {
          not: null,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        sede: true,
        deletedAt: true,
      },
      orderBy: {
        deletedAt: "desc",
      },
    });

    return { success: true, data: users };
  } catch (error) {
    console.error("Error fetching deleted users:", error);
    return { success: false, error: "Error al cargar la papelera" };
  }
}

export async function restoreUser(userId: string) {
  try {
    await db.user.update({
      where: { id: userId },
      data: {
        deletedAt: null,
      },
    });

    revalidatePath("/dashboard/papelera");
    revalidatePath("/dashboard/alumnos");
    revalidatePath("/dashboard/profesores");
    return { success: true };
  } catch (error) {
    console.error("Error restoring user:", error);
    return { success: false, error: "Error al restaurar el usuario" };
  }
}

export async function hardDeleteUser(userId: string) {
  try {
    await db.user.delete({
      where: { id: userId },
    });

    revalidatePath("/dashboard/papelera");
    return { success: true };
  } catch (error) {
    console.error("Error permanently deleting user:", error);
    return { success: false, error: "Error al eliminar definitivamente el usuario" };
  }
}
