"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { createClient } from "@/utils/supabase/server";
import { auth } from "@/lib/auth";

import { reportErrorToSanity } from "@/lib/logger";

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
  contractUrl?: string;
  sede: string;
}) {
  try {
    const session = await auth();
    const fallbackSede = (session?.user as any)?.sede || "SEAAUTLAN";
    const sede = (data.sede && data.sede.trim() !== "" ? data.sede : fallbackSede) as any;
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const student = await db.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        phone: data.phone,
        role: "STUDENT",
        sede,
        studentProfile: {
          create: {
            sede,
            birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
            gender: data.gender,
            address: data.address,
            city: data.city,
            state: data.state,
            emergencyContact: data.emergencyContact,
            emergencyPhone: data.emergencyPhone,
            contractUrl: data.contractUrl,
          },
        },
      },
      include: {
        studentProfile: true,
      },
    });

    revalidatePath("/dashboard/alumnos");
    return { success: true, data: JSON.parse(JSON.stringify(student)) };
  } catch (error: any) {
    console.error("Error creating student:", error);
    await reportErrorToSanity({
      title: "Error al Crear Alumno",
      location: "app/dashboard/alumnos/actions.ts -> createStudent",
      error,
      severity: error?.code === "P2002" ? "WARNING" : "ERROR",
      userEmail: data.email,
      context: { inputEmail: data.email, sede: data.sede, name: data.name },
    });

    if (error?.code === "P2002") {
      return { success: false, error: "El correo electrónico ya está registrado con otro alumno o usuario." };
    }
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
    contractUrl?: string;
    sede?: string;
    isActive?: boolean;
  }
) {
  try {
    const student = await db.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        ...(data.sede ? { sede: data.sede as any } : {}),
        ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
        studentProfile: data.gender || data.address || data.city || data.state || data.contractUrl || data.sede ? {
          update: {
            gender: data.gender,
            address: data.address,
            city: data.city,
            state: data.state,
            ...(data.contractUrl ? { contractUrl: data.contractUrl } : {}),
            ...(data.sede ? { sede: data.sede as any } : {}),
          },
        } : undefined,
      },
      include: {
        studentProfile: true,
      },
    });

    revalidatePath("/dashboard/alumnos");
    return { success: true, data: JSON.parse(JSON.stringify(student)) };
  } catch (error) {
    console.error("Error updating student:", error);
    return { success: false, error: "Error al actualizar el alumno" };
  }
}

export async function deleteStudent(userId: string) {
  try {
    await db.user.update({
      where: { id: userId },
      data: { deletedAt: new Date() }
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

    return { success: true, data: JSON.parse(JSON.stringify(student)) };
  } catch (error) {
    console.error("Error fetching student details:", error);
    return { success: false, error: "Error al obtener detalles del alumno" };
  }
}

export async function enrollStudentInCourse(
  studentId: string,
  courseId: string,
  groupId: string,
  cycleId: string,
  paymentConfig?: {
    monthlyConcept?: string;
    paymentDate?: number;
    monthlyValue?: number;
    totalInstallments?: number;
    isScholarship?: boolean;
    scholarshipDiscount?: number;
  }
) {
  try {
    const student = await db.user.findUnique({ where: { id: studentId } });
    const sede = student?.sede || "SEAAUTLAN";

    // 1. Resolve targetCycleId: if missing or empty, find active cycle or create a fallback
    let targetCycleId: string | undefined = cycleId && cycleId.trim() !== "" ? cycleId : undefined;
    if (!targetCycleId) {
      const activeCycle = await db.schoolCycle.findFirst({
        where: { isActive: true, sede },
      }) || await db.schoolCycle.findFirst({
        where: { isActive: true },
      }) || await db.schoolCycle.findFirst({
        orderBy: { startDate: "desc" }
      });
      
      if (activeCycle) {
        targetCycleId = activeCycle.id;
      } else {
        const newCycle = await db.schoolCycle.create({
          data: {
            name: "Ciclo Escolar Actual",
            startDate: new Date(),
            endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            sede,
            isActive: true,
          }
        });
        targetCycleId = newCycle.id;
      }
    }

    // 2. Resolve targetGroupId: pass undefined if empty string
    const targetGroupId = groupId && groupId.trim() !== "" ? groupId : undefined;

    const enrollment = await db.studentEnrollment.create({
      data: {
        studentId,
        courseId,
        groupId: targetGroupId,
        cycleId: targetCycleId,
        sede,
        status: "ACTIVE",
        ...(paymentConfig ? {
          monthlyConcept: paymentConfig.monthlyConcept,
          paymentDate: paymentConfig.paymentDate,
          monthlyValue: paymentConfig.monthlyValue,
          totalInstallments: paymentConfig.totalInstallments,
          isScholarship: paymentConfig.isScholarship,
          scholarshipDiscount: paymentConfig.scholarshipDiscount,
        } : {})
      },
    });

    revalidatePath("/dashboard/alumnos");
    return { success: true, data: JSON.parse(JSON.stringify(enrollment)) };
  } catch (error) {
    console.error("Error enrolling student:", error);
    return { success: false, error: "Error al inscribir el alumno" };
  }
}

export async function getCoursesForEnrollment() {
  try {
    const courses = await db.course.findMany({
      where: { isActive: true },
      select: { id: true, name: true, level: true },
      orderBy: { name: "asc" }
    });
    return { success: true, data: courses };
  } catch (error) {
    console.error("Error fetching courses:", error);
    return { success: false, error: "Error al obtener cursos" };
  }
}

export async function getGroupsForEnrollment() {
  try {
    const groups = await db.group.findMany({
      where: { isActive: true },
      select: { id: true, name: true, level: true },
      orderBy: { name: "asc" }
    });
    return { success: true, data: groups };
  } catch (error) {
    console.error("Error fetching groups:", error);
    return { success: false, error: "Error al obtener grupos" };
  }
}

export async function uploadContract(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) return { success: false, error: "No se proporcionó archivo" };
    
    // We expect the user to have supabase connected
    const supabase = createClient();
    const fileName = `contracts/${Date.now()}-${file.name.replace(/\\s+/g, "_")}`;
    
    // Suponemos que existe un bucket llamado "documents"
    const { data, error } = await supabase.storage.from("documents").upload(fileName, file);
    
    if (error) {
      console.error("Supabase upload error:", error);
      return { success: false, error: "Error al subir a Storage" };
    }
    
    const { data: publicData } = supabase.storage.from("documents").getPublicUrl(fileName);
    return { success: true, url: publicData.publicUrl };
  } catch (error) {
    console.error("Error uploading contract:", error);
    return { success: false, error: "Error interno al subir el contrato" };
  }
}

export async function updateUserActiveSede(newSede: string) {
  try {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "ADMIN") {
      return { success: false, error: "No autorizado" };
    }

    await db.user.update({
      where: { id: session.user.id },
      data: { sede: newSede as any },
    });

    revalidatePath("/dashboard", "layout");
    return { success: true };
  } catch (error) {
    console.error("Error updating active sede:", error);
    return { success: false, error: "Error al cambiar de sede" };
  }
}
