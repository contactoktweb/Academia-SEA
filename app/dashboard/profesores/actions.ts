"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";

export async function createTeacher(data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  specialty?: string;
  employeeId?: string;
  salary?: number;
  sede?: string;
}) {
  try {
    const session = await auth();
    const adminSede = (session?.user as any)?.sede;
    const sede = (adminSede || data.sede || "SEAAUTLAN") as any;
    const cleanEmail = data.email.trim().toLowerCase();
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const generatedEmployeeId = data.employeeId || `SEA-DOC-${Math.floor(1000 + Math.random() * 9000)}`;

    const rawTeacher = await db.user.create({
      data: {
        email: cleanEmail,
        password: hashedPassword,
        name: data.name.trim(),
        phone: data.phone,
        role: "TEACHER",
        sede,
        teacherProfile: {
          create: {
            sede,
            employeeId: generatedEmployeeId,
            specialty: data.specialty,
            salary: data.salary ? parseFloat(String(data.salary)) : undefined,
          },
        },
      },
      include: {
        teacherProfile: {
          include: {
            courses: true,
          },
        },
      },
    });

    revalidatePath("/dashboard/profesores");
    return { success: true, data: JSON.parse(JSON.stringify(rawTeacher)) };
  } catch (error) {
    console.error("Error creating teacher:", error);
    return { success: false, error: "Error al crear el profesor" };
  }
}

export async function updateTeacher(
  userId: string,
  data: {
    name?: string;
    email?: string;
    phone?: string;
    specialty?: string;
    salary?: number;
    sede?: string;
    isActive?: boolean;
    isApproved?: boolean;
  }
) {
  try {
    const rawTeacher = await db.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        ...(data.sede ? { sede: data.sede as any } : {}),
        ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
        ...(data.isApproved !== undefined ? { isApproved: data.isApproved } : {}),
        teacherProfile: data.specialty || data.salary || data.sede ? {
          update: {
            specialty: data.specialty,
            salary: data.salary ? parseFloat(String(data.salary)) : undefined,
            ...(data.sede ? { sede: data.sede as any } : {}),
          },
        } : undefined,
      },
      include: {
        teacherProfile: {
          include: {
            courses: true,
          },
        },
      },
    });

    revalidatePath("/dashboard/profesores");
    return { success: true, data: JSON.parse(JSON.stringify(rawTeacher)) };
  } catch (error) {
    console.error("Error updating teacher:", error);
    return { success: false, error: "Error al actualizar el profesor" };
  }
}

export async function deleteTeacher(userId: string) {
  try {
    await db.user.update({
      where: { id: userId },
      data: { 
        deletedAt: new Date(),
        isActive: false,
      }
    });

    await db.teacherProfile.updateMany({
      where: { userId },
      data: { isActive: false },
    });

    revalidatePath("/dashboard/profesores");
    return { success: true };
  } catch (error) {
    console.error("Error deleting teacher:", error);
    return { success: false, error: "Error al eliminar el profesor" };
  }
}

export async function getTeacherDetails(userId: string) {
  try {
    const rawTeacher = await db.user.findUnique({
      where: { id: userId },
      include: {
        teacherProfile: {
          include: {
            courses: {
              include: {
                course: true,
                group: true,
              },
            },
            grades: true,
            attendances: true,
          },
        },
      },
    });

    if (!rawTeacher) return { success: false, error: "Profesor no encontrado" };

    return { success: true, data: JSON.parse(JSON.stringify(rawTeacher)) };
  } catch (error) {
    console.error("Error fetching teacher details:", error);
    return { success: false, error: "Error al obtener detalles del profesor" };
  }
}

