"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function createStudent(data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  birthDate?: string;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
}) {
  try {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const student = await db.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        phone: data.phone,
        role: "STUDENT",
        studentProfile: {
          create: {
            birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
            gender: data.gender,
            address: data.address,
            city: data.city,
            state: data.state,
            emergencyContact: data.emergencyContact,
            emergencyPhone: data.emergencyPhone,
          },
        },
      },
      include: {
        studentProfile: true,
      },
    });

    revalidatePath("/dashboard/alumnos");
    return { success: true, data: student };
  } catch (error) {
    console.error("Error creating student:", error);
    return { success: false, error: "Error al crear el alumno" };
  }
}

export async function updateStudent(
  userId: string,
  data: {
    name?: string;
    email?: string;
    phone?: string;
    gender?: string;
    address?: string;
    city?: string;
    state?: string;
  }
) {
  try {
    const student = await db.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        studentProfile: data.gender || data.address || data.city || data.state ? {
          update: {
            gender: data.gender,
            address: data.address,
            city: data.city,
            state: data.state,
          },
        } : undefined,
      },
      include: {
        studentProfile: true,
      },
    });

    revalidatePath("/dashboard/alumnos");
    return { success: true, data: student };
  } catch (error) {
    console.error("Error updating student:", error);
    return { success: false, error: "Error al actualizar el alumno" };
  }
}

export async function deleteStudent(userId: string) {
  try {
    await db.user.delete({
      where: { id: userId },
    });

    revalidatePath("/dashboard/alumnos");
    return { success: true };
  } catch (error) {
    console.error("Error deleting student:", error);
    return { success: false, error: "Error al eliminar el alumno" };
  }
}

export async function getStudentDetails(userId: string) {
  try {
    const student = await db.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: {
          include: {
            enrollments: {
              include: {
                course: true,
                group: true,
              },
            },
            grades: true,
            attendance: true,
            familyLinks: {
              include: {
                family: true,
              },
            },
            documents: true,
          },
        },
      },
    });

    return { success: true, data: student };
  } catch (error) {
    console.error("Error fetching student details:", error);
    return { success: false, error: "Error al obtener detalles del alumno" };
  }
}

export async function enrollStudentInCourse(
  studentId: string,
  courseId: string,
  groupId: string,
  cycleId: string
) {
  try {
    const enrollment = await db.studentEnrollment.create({
      data: {
        studentId,
        courseId,
        groupId,
        cycleId,
        status: "ACTIVE",
      },
    });

    revalidatePath("/dashboard/alumnos");
    return { success: true, data: enrollment };
  } catch (error) {
    console.error("Error enrolling student:", error);
    return { success: false, error: "Error al inscribir el alumno" };
  }
}
