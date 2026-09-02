"use server";
import { db } from "@/lib/db";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { auth } from "@/lib/auth";
import { getSedeCondition } from "@/lib/multi-tenancy";

// Cache the config data for 30 seconds — these tables are rarely written to.
// We pass the sedeCondition as a string to the cache to maintain separation.
const getCachedSystemConfig = unstable_cache(
  async (sedeConditionStr: string) => {
    const sedeCondition = JSON.parse(sedeConditionStr);
    const [cycles, rawConcepts, rawPlans] = await Promise.all([
      db.schoolCycle.findMany({ where: sedeCondition, orderBy: { startDate: "desc" } }),
      db.chargeConcept.findMany({
        where: sedeCondition,
        orderBy: { createdAt: "desc" },
        include: { cycle: true },
      }),
      db.paymentPlan.findMany({
        where: sedeCondition,
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
  ["system-config-sede"],
  { revalidate: 30, tags: ["system-config"] }
);

export async function getSystemConfig() {
  try {
    const sedeCondition = await getSedeCondition();
    const data = await getCachedSystemConfig(JSON.stringify(sedeCondition));
    return { success: true, data };
  } catch (error) {
    console.error("Error loading config:", error);
    return { success: false, error: "Error al cargar configuración" };
  }
}

// ─── Helper to bust the cache after any write ───────────────────────────────
function invalidateConfigCache() {
  try {
    (revalidateTag as any)("system-config");
  } catch {}
  revalidatePath("/dashboard/configuracion");
}

export async function createSchoolCycle(data: { name: string; startDate: string; endDate: string }) {
  try {
    const session = await auth();
    const sede = (session?.user as any)?.sede || "SEAAUTLAN";

    await db.schoolCycle.create({
      data: {
        name: data.name,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        isActive: true,
        sede: sede as any,
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
    await db.schoolCycle.update({ where: { id }, data: { isActive: false } });
    invalidateConfigCache();
    return { success: true };
  } catch {
    return { success: false, error: "Error al deshabilitar el ciclo" };
  }
}

export async function deleteChargeConcept(id: string) {
  try {
    await db.chargeConcept.update({ where: { id }, data: { isActive: false } });
    invalidateConfigCache();
    return { success: true };
  } catch {
    return { success: false, error: "Error al deshabilitar el concepto" };
  }
}

export async function deletePaymentPlan(id: string) {
  try {
    await db.paymentPlan.update({ where: { id }, data: { isActive: false } });
    invalidateConfigCache();
    return { success: true };
  } catch {
    return { success: false, error: "Error al deshabilitar el plan" };
  }
}
