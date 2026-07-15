"use server";
import { db } from "@/lib/db";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";

// Cache the config data for 30 seconds — these tables are rarely written to.
// The cache tag "system-config" is busted by any mutating action below.
const getCachedSystemConfig = unstable_cache(
  async () => {
    const [cycles, rawConcepts, rawPlans] = await Promise.all([
      db.schoolCycle.findMany({ orderBy: { startDate: "desc" } }),
      db.chargeConcept.findMany({
        orderBy: { createdAt: "desc" },
        include: { cycle: true },
      }),
      db.paymentPlan.findMany({
        orderBy: { createdAt: "desc" },
        include: { concept: true, cycle: true },
      }),
    ]);

    const concepts = rawConcepts.map((c) => ({
      ...c,
      amount: Number(c.amount),
    }));

    const plans = rawPlans.map((p) => ({
      ...p,
      amount: Number(p.amount),
      concept: p.concept
        ? { ...p.concept, amount: Number(p.concept.amount) }
        : null,
    }));

    return { cycles, concepts, plans };
  },
  ["system-config"],
  { revalidate: 30, tags: ["system-config"] }
);

export async function getSystemConfig() {
  try {
    const data = await getCachedSystemConfig();
    return { success: true, data };
  } catch (error) {
    console.error("Error loading config:", error);
    return { success: false, error: "Error al cargar configuración" };
  }
}

// ─── Helper to bust the cache after any write ───────────────────────────────
function invalidateConfigCache() {
  revalidateTag("system-config");
  revalidatePath("/dashboard/configuracion");
}

export async function createSchoolCycle(data: { name: string; startDate: string; endDate: string }) {
  try {
    await db.schoolCycle.create({
      data: {
        name: data.name,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        isActive: true,
      },
    });
    invalidateConfigCache();
    return { success: true };
  } catch {
    return { success: false, error: "Error al crear ciclo escolar" };
  }
}

export async function toggleCycleStatus(id: string, isActive: boolean) {
  try {
    await db.schoolCycle.update({ where: { id }, data: { isActive } });
    invalidateConfigCache();
    return { success: true };
  } catch {
    return { success: false, error: "Error al actualizar estado del ciclo" };
  }
}

export async function deleteSchoolCycle(id: string) {
  try {
    await db.schoolCycle.delete({ where: { id } });
    invalidateConfigCache();
    return { success: true };
  } catch {
    return { success: false, error: "Error al eliminar (puede tener registros asociados)" };
  }
}

export async function deleteChargeConcept(id: string) {
  try {
    await db.chargeConcept.delete({ where: { id } });
    invalidateConfigCache();
    return { success: true };
  } catch {
    return { success: false, error: "Error al eliminar concepto" };
  }
}

export async function deletePaymentPlan(id: string) {
  try {
    await db.paymentPlan.delete({ where: { id } });
    invalidateConfigCache();
    return { success: true };
  } catch {
    return { success: false, error: "Error al eliminar plan" };
  }
}
