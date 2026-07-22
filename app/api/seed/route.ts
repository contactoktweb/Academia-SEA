import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Only available in development" }, { status: 403 });
  }

  try {
    const sedes = ["SEAAUTLAN", "SEAGRULLO", "EN_LINEA"] as const;
    const defaultPassword = await bcrypt.hash("Password123!", 10);

    for (const sede of sedes) {
      // 1. Crear un Ciclo Escolar para la sede
      const cycle = await db.schoolCycle.create({
        data: {
          name: `Ciclo 2024-2025 (${sede})`,
          startDate: new Date("2024-08-01"),
          endDate: new Date("2025-07-31"),
          sede: sede,
          isActive: true,
        },
      });

      // 2. Crear un Curso y Grupo
      const course = await db.course.create({
        data: {
          name: `Inglés Intensivo - ${sede}`,
          code: `ING-${sede.substring(3, 6)}`,
          level: "Intermediate",
          sede: sede,
          isActive: true,
          cycleId: cycle.id,
        },
      });

      const group = await db.group.create({
        data: {
          name: `Grupo A - ${sede}`,
          level: "Intermediate",
          sede: sede,
          isActive: true,
          maxStudents: 30,
        },
      });

      // 3. Crear Concepto de Cobro
      const concept = await db.chargeConcept.create({
        data: {
          name: `Mensualidad General ${sede}`,
          amount: 1500.0,
          type: "TUITION",
          sede: sede,
          cycleId: cycle.id,
        },
      });

      // 4. Crear un Profesor
      const teacherEmail = `profesor.${sede.toLowerCase()}@academia.com`;
      let teacher = await db.user.findUnique({ where: { email: teacherEmail }, include: { teacherProfile: true } });
      
      if (!teacher) {
        teacher = await db.user.create({
          data: {
            name: `Profesor ${sede}`,
            email: teacherEmail,
            password: defaultPassword,
            role: "TEACHER",
            sede: sede,
            teacherProfile: {
              create: {
                specialty: "Inglés Avanzado",
                salary: 12000.0,
                sede: sede,
              },
            },
          },
          include: { teacherProfile: true },
        });

        if (teacher.teacherProfile) {
          await db.courseAssignment.create({
            data: {
              courseId: course.id,
              groupId: group.id,
              teacherId: teacher.teacherProfile.id,
              cycleId: cycle.id,
              sede: sede,
            }
          });
        }
      }

      // 5. Crear 3 Estudiantes por Sede y asignarles Pagos
      for (let i = 1; i <= 3; i++) {
        const studentEmail = `estudiante${i}.${sede.toLowerCase()}@academia.com`;
        let student = await db.user.findUnique({ where: { email: studentEmail }, include: { studentProfile: true } });
        
        if (!student) {
          student = await db.user.create({
            data: {
              name: `Estudiante ${i} ${sede}`,
              email: studentEmail,
              password: defaultPassword,
              role: "STUDENT",
              sede: sede,
              studentProfile: {
                create: {
                  sede: sede,
                  gender: i % 2 === 0 ? "Femenino" : "Masculino",
                  city: sede,
                }
              }
            },
            include: { studentProfile: true }
          });

          if (student.studentProfile) {
            // Inscribirlo
            await db.studentEnrollment.create({
              data: {
                studentId: student.studentProfile.id,
                courseId: course.id,
                groupId: group.id,
                cycleId: cycle.id,
                sede: sede,
                monthlyConcept: "TUITION",
                monthlyValue: 1500.0,
              }
            });

            // Crear Pagos (1 pagado, 1 pendiente)
            await db.payment.create({
              data: {
                studentId: student.studentProfile.id,
                cycleId: cycle.id,
                conceptId: concept.id,
                amount: 1500.0,
                amountPaid: 1500.0,
                sede: sede,
                status: "PAID",
                method: "BANK_TRANSFER",
                dueDate: new Date(),
                paidAt: new Date(),
              }
            });

            await db.payment.create({
              data: {
                studentId: student.studentProfile.id,
                cycleId: cycle.id,
                conceptId: concept.id,
                amount: 1500.0,
                amountPaid: 0,
                sede: sede,
                status: "PENDING",
                method: "CASH",
                dueDate: new Date(new Date().setDate(new Date().getDate() + 15)), // Vence en 15 días
              }
            });
          }
        }
      }
    }

    return NextResponse.json({ success: true, message: "Base de datos poblada con éxito para todas las sedes." });
  } catch (error: any) {
    console.error("Error seeding DB:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
