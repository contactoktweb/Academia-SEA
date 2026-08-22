"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getSedeCondition } from "@/lib/multi-tenancy";

export async function getDeletedUsers() {
  try {
    const sedeCondition = await getSedeCondition();
    const users = await db.user.findMany({
      where: {
        ...sedeCondition,
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
        isActive: true,
      },
    });

    await db.studentProfile.updateMany({
      where: { userId },
      data: { isActive: true },
    });

    await db.teacherProfile.updateMany({
      where: { userId },
      data: { isActive: true },
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
    // No se destruye físicamente el registro de la base de datos para permitir recuperación manual
    await db.user.update({
      where: { id: userId },
      data: {
        isActive: false,
        deletedAt: new Date(),
      },
    });

    await db.studentProfile.updateMany({
      where: { userId },
      data: { isActive: false },
    });

    await db.teacherProfile.updateMany({
      where: { userId },
      data: { isActive: false },
    });

    revalidatePath("/dashboard/papelera");
    return { success: true };
  } catch (error) {
    console.error("Error disabling user:", error);
    return { success: false, error: "Error al deshabilitar el usuario" };
  }
}
