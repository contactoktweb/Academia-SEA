"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { createClient } from "@/utils/supabase/server";
import { auth } from "@/lib/auth";
import { reportErrorToSanity } from "@/lib/logger";

export async function checkSiblingEmail(email: string) {
  try {
    if (!email || !email.includes("@")) return { exists: false, siblings: [] };

    const normalizedEmail = email.trim().toLowerCase();
    const existingUsers = await db.user.findMany({
      where: {
        email: normalizedEmail,
        role: "STUDENT",
      },
      include: {
        studentProfile: true,
      },
    });

    if (existingUsers.length > 0) {
      return {
        exists: true,
        count: existingUsers.length,
        siblings: existingUsers.map((u) => ({
          id: u.id,
          name: u.name,
          studentId: u.studentProfile?.studentId || "Sin matrícula",
        })),
      };
    }

    return { exists: false, siblings: [] };
  } catch (error) {
    console.error("Error checking sibling email:", error);
    return { exists: false, siblings: [] };
  }
}

export async function createStudent(data: {
  name: string;
  email: string;
  studentId?: string; // Identificador interno único (Matrícula)
  password?: string;
  phone?: string;
  birthDate?: string;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  contractUrl?: string;
  sede?: string;
}) {
  try {
    const session = await auth();
    const adminSede = (session?.user as any)?.sede;
    const sede = (adminSede || data.sede || "SEAAUTLAN") as any;
    const cleanEmail = data.email.trim().toLowerCase();
    const rawPassword = data.password && data.password.trim() !== "" ? data.password : "123456";
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    // Generar o sanitizar studentId (Matrícula interna)
    const sedePrefix = String(sede).replace("SEA", "").substring(0, 3).toUpperCase() || "GEN";
    const generatedId = `SEA-${sedePrefix}-${new Date().getFullYear().toString().slice(-2)}${Math.floor(1000 + Math.random() * 9000)}`;
    const finalStudentId = data.studentId && data.studentId.trim() !== "" ? data.studentId.trim() : generatedId;

    // Verificar si ya existe otro hermano con este correo
    const existingSiblingUsers = await db.user.findMany({
      where: { email: cleanEmail, role: "STUDENT" },
      include: { studentProfile: true },
    });

    const student = await db.user.create({
      data: {
        email: cleanEmail,
        password: hashedPassword,
        name: data.name.trim(),
        phone: data.phone,
        role: "STUDENT",
        sede,
        studentProfile: {
          create: {
            studentId: finalStudentId,
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

    // Si comparte correo con hermanos, vincularlos en la entidad Family
    if (existingSiblingUsers.length > 0 && student.studentProfile) {
      try {
        let family = await db.family.findFirst({
          where: { email: cleanEmail },
        });

        if (!family) {
          const lastName = data.name.trim().split(" ").slice(1).join(" ") || data.name.trim();
          family = await db.family.create({
            data: {
              name: `Familia ${lastName}`,
              email: cleanEmail,
              phone: data.phone,
              address: data.address,
            },
          });

          // Vincular hermanos existentes
          for (const sib of existingSiblingUsers) {
            if (sib.studentProfile) {
              await db.familyLink.create({
                data: {
                  familyId: family.id,
                  studentProfileId: sib.studentProfile.id,
                  relationship: "HERMANO",
                  isPrimary: false,
                },
              });
            }
          }
        }

        // Vincular nuevo hermano
        await db.familyLink.create({
          data: {
            familyId: family.id,
            studentProfileId: student.studentProfile.id,
            relationship: "HERMANO",
            isPrimary: false,
          },
        });
      } catch (famErr) {
        console.error("Error linking family siblings:", famErr);
      }
    }

    revalidatePath("/dashboard/alumnos");
    revalidatePath("/dashboard/familias");
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
      return { success: false, error: "El identificador interno / matrícula ya existe. Por favor utiliza una matrícula diferente." };
    }
    return { success: false, error: "Error al crear el alumno" };
  }
}

export async function updateStudent(
  userId: string,
  data: {
    name?: string;
    email?: string;
    studentId?: string;
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
    const cleanEmail = data.email ? data.email.trim().toLowerCase() : undefined;

    const student = await db.user.update({
      where: { id: userId },
      data: {
        name: data.name ? data.name.trim() : undefined,
        email: cleanEmail,
        phone: data.phone,
        ...(data.sede ? { sede: data.sede as any } : {}),
        ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
        studentProfile: {
          update: {
            ...(data.studentId ? { studentId: data.studentId.trim() } : {}),
            gender: data.gender,
            address: data.address,
            city: data.city,
            state: data.state,
            ...(data.contractUrl ? { contractUrl: data.contractUrl } : {}),
            ...(data.sede ? { sede: data.sede as any } : {}),
          },
        },
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
      data: { 
        deletedAt: new Date(),
        isActive: false,
      },
    });

    await db.studentProfile.updateMany({
      where: { userId },
      data: { isActive: false },
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

    let targetCycleId: string | undefined = cycleId && cycleId.trim() !== "" ? cycleId : undefined;
    if (!targetCycleId) {
      const activeCycle = (await db.schoolCycle.findFirst({
        where: { isActive: true, sede },
      })) || (await db.schoolCycle.findFirst({
        where: { isActive: true },
      })) || (await db.schoolCycle.findFirst({
        orderBy: { startDate: "desc" },
      }));

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
          },
        });
        targetCycleId = newCycle.id;
      }
    }

    const targetGroupId = groupId && groupId.trim() !== "" ? groupId : undefined;

    const enrollment = await db.studentEnrollment.create({
      data: {
        studentId,
        courseId,
        groupId: targetGroupId,
        cycleId: targetCycleId,
        sede,
        status: "ACTIVE",
        ...(paymentConfig
          ? {
              monthlyConcept: paymentConfig.monthlyConcept,
              paymentDate: paymentConfig.paymentDate,
              monthlyValue: paymentConfig.monthlyValue,
              totalInstallments: paymentConfig.totalInstallments,
              isScholarship: paymentConfig.isScholarship,
              scholarshipDiscount: paymentConfig.scholarshipDiscount,
            }
          : {}),
      },
    });

    revalidatePath("/dashboard/alumnos");
    return { success: true, data: JSON.parse(JSON.stringify(enrollment)) };
  } catch (error) {
    console.error("Error enrolling student:", error);
    return { success: false, error: "Error al inscribir el alumno" };
  }
}

export async function getCoursesForEnrollment(sede?: string) {
  try {
    let effectiveSede = sede;
    if (!effectiveSede) {
      try {
        const session = await auth();
        effectiveSede = (session?.user as any)?.sede;
      } catch {}
    }
    if (!effectiveSede) effectiveSede = "SEAAUTLAN";

    const courses = await db.course.findMany({
      where: {
        isActive: true,
        ...(effectiveSede ? { sede: effectiveSede as any } : {}),
      },
      select: { id: true, name: true, level: true, sede: true },
      orderBy: { name: "asc" },
    });
    return { success: true, data: courses };
  } catch (error) {
    console.error("Error fetching courses:", error);
    return { success: false, error: "Error al obtener cursos", data: [] };
  }
}

export async function getGroupsForEnrollment(sede?: string) {
  try {
    let effectiveSede = sede;
    if (!effectiveSede) {
      try {
        const session = await auth();
        effectiveSede = (session?.user as any)?.sede;
      } catch {}
    }
    if (!effectiveSede) effectiveSede = "SEAAUTLAN";
    
    let groups = await db.group.findMany({
      where: {
        isActive: true,
        ...(effectiveSede ? { sede: effectiveSede as any } : {}),
      },
      select: { id: true, name: true, level: true, schedule: true, sede: true, modality: true },
      orderBy: { name: "asc" },
    });

    // Si no existen grupos creados para esta sede, auto-aprovisionamos grupos base para evitar bloqueos
    if (groups.length === 0 && effectiveSede) {
      try {
        await db.group.createMany({
          data: [
            {
              name: "Grupo A - Matutino",
              level: "General",
              schedule: "Lunes a Jueves 09:00 - 11:00",
              sede: effectiveSede as any,
              modality: "PRESENCIAL",
              maxStudents: 30,
            },
            {
              name: "Grupo B - Vespertino",
              level: "General",
              schedule: "Lunes a Jueves 16:00 - 18:00",
              sede: effectiveSede as any,
              modality: "PRESENCIAL",
              maxStudents: 30,
            },
            {
              name: "Grupo Sábados",
              level: "General",
              schedule: "Sábados 09:00 - 13:00",
              sede: effectiveSede as any,
              modality: "PRESENCIAL",
              maxStudents: 30,
            },
          ],
        });

        groups = await db.group.findMany({
          where: {
            isActive: true,
            sede: effectiveSede as any,
          },
          select: { id: true, name: true, level: true, schedule: true, sede: true, modality: true },
          orderBy: { name: "asc" },
        });
      } catch (seedErr) {
        console.error("Error auto-seeding default groups for sede:", seedErr);
      }
    }

    return { success: true, data: groups };
  } catch (error) {
    console.error("Error fetching groups:", error);
    return { success: false, error: "Error al obtener grupos", data: [] };
  }
}

export async function uploadContract(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) return { success: false, error: "No se proporcionó archivo" };

    const supabase = createClient();
    const fileName = `contracts/${Date.now()}-${file.name.replace(/\s+/g, "_")}`;

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
