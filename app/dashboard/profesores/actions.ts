"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function createTeacher(data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  specialty?: string;
  employeeId?: string;
  salary?: number;
}) {
  try {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const rawTeacher = await db.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        phone: data.phone,
        role: "TEACHER",
        teacherProfile: {
          create: {
            employeeId: data.employeeId,
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

    // Serialize for Client
    const teacher = {
      ...rawTeacher,
      teacherProfile: rawTeacher.teacherProfile ? {
        ...rawTeacher.teacherProfile,
        salary: rawTeacher.teacherProfile.salary ? Number(rawTeacher.teacherProfile.salary) : null,
      } : null,
    };

    revalidatePath("/dashboard/profesores");
    return { success: true, data: teacher };
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
  }
) {
  try {
    const rawTeacher = await db.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        teacherProfile: data.specialty || data.salary ? {
          update: {
            specialty: data.specialty,
            salary: data.salary ? parseFloat(String(data.salary)) : undefined,
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

    // Serialize for Client
    const teacher = {
      ...rawTeacher,
      teacherProfile: rawTeacher.teacherProfile ? {
        ...rawTeacher.teacherProfile,
        salary: rawTeacher.teacherProfile.salary ? Number(rawTeacher.teacherProfile.salary) : null,
      } : null,
    };

    revalidatePath("/dashboard/profesores");
    return { success: true, data: teacher };
  } catch (error) {
    console.error("Error updating teacher:", error);
    return { success: false, error: "Error al actualizar el profesor" };
  }
}

export async function deleteTeacher(userId: string) {
  try {
    await db.user.delete({
      where: { id: userId },
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

    // Serialize for Client
    const teacher = {
      ...rawTeacher,
      teacherProfile: rawTeacher.teacherProfile ? {
        ...rawTeacher.teacherProfile,
        salary: rawTeacher.teacherProfile.salary ? Number(rawTeacher.teacherProfile.salary) : null,
      } : null,
    };

    return { success: true, data: teacher };
  } catch (error) {
    console.error("Error fetching teacher details:", error);
    return { success: false, error: "Error al obtener detalles del profesor" };
  }
}

