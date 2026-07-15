"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getSystemConfig() {
  try {
    const cycles = await db.schoolCycle.findMany({ orderBy: { startDate: "desc" } });
    
    const rawConcepts = await db.chargeConcept.findMany({ 
      orderBy: { createdAt: "desc" }, 
      include: { cycle: true } 
    });
    const concepts = rawConcepts.map(c => ({
      ...c,
      amount: Number(c.amount)
    }));

    const rawPlans = await db.paymentPlan.findMany({ 
      orderBy: { createdAt: "desc" }, 
      include: { concept: true, cycle: true } 
    });
    const plans = rawPlans.map(p => ({
      ...p,
      amount: Number(p.amount),
      concept: p.concept ? {
        ...p.concept,
        amount: Number(p.concept.amount)
      } : null
    }));

    return { success: true, data: { cycles, concepts, plans } };
  } catch (error) {
    console.error("Error loading config:", error);
    return { success: false, error: "Error al cargar configuración" };
  }
}

export async function createSchoolCycle(data: { name: string; startDate: string; endDate: string }) {
  try {
    await db.schoolCycle.create({
      data: {
        name: data.name,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        isActive: true,
      }
    });
    revalidatePath("/dashboard/configuracion");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Error al crear ciclo escolar" };
  }
}

export async function toggleCycleStatus(id: string, isActive: boolean) {
  try {
    await db.schoolCycle.update({ where: { id }, data: { isActive } });
    revalidatePath("/dashboard/configuracion");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Error al actualizar estado del ciclo" };
  }
}

export async function deleteSchoolCycle(id: string) {
  try {
    await db.schoolCycle.delete({ where: { id } });
    revalidatePath("/dashboard/configuracion");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Error al eliminar (puede tener registros asociados)" };
  }
}

export async function deleteChargeConcept(id: string) {
  try {
    await db.chargeConcept.delete({ where: { id } });
    revalidatePath("/dashboard/configuracion");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Error al eliminar concepto" };
  }
}

export async function deletePaymentPlan(id: string) {
  try {
    await db.paymentPlan.delete({ where: { id } });
    revalidatePath("/dashboard/configuracion");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Error al eliminar plan" };
  }
}
