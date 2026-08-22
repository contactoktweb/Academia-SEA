"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createFamily(data: {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
}) {
  try {
    const family = await db.family.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        address: data.address,
        notes: data.notes,
      },
    });

    revalidatePath("/dashboard/familias");
    return { success: true, data: family };
  } catch (error) {
    console.error("Error creating family:", error);
    return { success: false, error: "Error al crear la familia" };
  }
}

export async function updateFamily(
  id: string,
  data: {
    name?: string;
    phone?: string;
    email?: string;
    address?: string;
    notes?: string;
  }
) {
  try {
    const family = await db.family.update({
      where: { id },
      data,
    });

    revalidatePath("/dashboard/familias");
    return { success: true, data: family };
  } catch (error) {
    console.error("Error updating family:", error);
    return { success: false, error: "Error al actualizar la familia" };
  }
}

export async function deleteFamily(id: string) {
  try {
    const existing = await db.family.findUnique({ where: { id } });
    await db.family.update({
      where: { id },
      data: {
        notes: `[DESHABILITADA] ${existing?.notes || ""}`.trim(),
      },
    });

    revalidatePath("/dashboard/familias");
    return { success: true };
  } catch (error) {
    console.error("Error disabling family:", error);
    return { success: false, error: "Error al deshabilitar la familia" };
  }
}
