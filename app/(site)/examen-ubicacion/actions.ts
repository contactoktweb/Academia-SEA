"use server";

import { db } from "@/lib/db";

export async function submitPlacementTest(data: {
  name: string;
  ageCategory: string;
  email?: string;
  phone?: string;
  sede: string;
  score: number;
  totalQuestions: number;
  level: string;
  percentage: number;
}) {
  try {
    const testResult = await db.placementTest.create({
      data: {
        name: data.name,
        ageCategory: data.ageCategory,
        email: data.email,
        phone: data.phone,
        sede: data.sede as any,
        score: data.score,
        totalQuestions: data.totalQuestions,
        level: data.level,
        percentage: data.percentage,
      },
    });

    return { success: true, data: testResult };
  } catch (error) {
    console.error("Error submitting placement test:", error);
    return { success: false, error: "Hubo un problema guardando tu examen. Por favor, intenta de nuevo." };
  }
}
