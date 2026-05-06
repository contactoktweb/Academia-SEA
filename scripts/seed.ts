import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed de datos de prueba...\n");

  // Limpiar datos existentes (opcional)
  console.log("🗑️  Limpiando datos existentes...");
  await prisma.activityLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.message.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.studentPaymentPlan.deleteMany();
  await prisma.paymentPlan.deleteMany();
  await prisma.chargeConcept.deleteMany();
  await prisma.scholarship.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.grade.deleteMany();
  await prisma.courseAssignment.deleteMany();
  await prisma.examQuestion.deleteMany();
  await prisma.exam.deleteMany();
  await prisma.unit.deleteMany();
  await prisma.studentEnrollment.deleteMany();
  await prisma.document.deleteMany();
  await prisma.familyLink.deleteMany();
  await prisma.family.deleteMany();
  await prisma.course.deleteMany();
  await prisma.group.deleteMany();
  await prisma.teacherProfile.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.schoolCycle.deleteMany();
  await prisma.user.deleteMany();

  // Crear ciclo escolar
  console.log("📅 Creando ciclo escolar...");
  const schoolCycle = await prisma.schoolCycle.create({
    data: {
      name: "2024-2025",
      startDate: new Date("2024-09-01"),
      endDate: new Date("2025-06-30"),
      isActive: true,
    },
  });

  // Crear grupos
  console.log("👥 Creando grupos...");
  const groupA = await prisma.group.create({
    data: {
      name: "Grupo A - Principiantes",
      level: "Beginner",
      schedule: "Lunes-Miércoles 9:00-10:30",
      location: "Aula 101",
      maxStudents: 20,
    },
  });

  const groupB = await prisma.group.create({
    data: {
      name: "Grupo B - Intermedio",
      level: "Intermediate",
      schedule: "Martes-Jueves 10:00-11:30",
      location: "Aula 102",
      maxStudents: 20,
    },
  });

  const groupC = await prisma.group.create({
    data: {
      name: "Grupo C - Avanzado",
      level: "Advanced",
      schedule: "Lunes-Miércoles 15:00-16:30",
      location: "Aula 103",
      maxStudents: 15,
    },
  });

  // Crear cursos
  console.log("📚 Creando cursos...");
  const englishCourse = await prisma.course.create({
    data: {
      name: "Inglés General",
      code: "ENG-001",
      description: "Curso completo de inglés conversacional",
      level: "All Levels",
      cycleId: schoolCycle.id,
    },
  });

  const businessCourse = await prisma.course.create({
    data: {
      name: "Inglés de Negocios",
      code: "ENG-002",
      description: "Inglés enfocado al ambiente empresarial",
      level: "Advanced",
      cycleId: schoolCycle.id,
    },
  });

  // Crear usuarios y perfiles de profesor
  console.log("👨‍🏫 Creando profesores...");
  const hashedPassword = await bcrypt.hash("password123", 10);

  const teacher1 = await prisma.user.create({
    data: {
      email: "profe.maria@academia-sea.com",
      password: hashedPassword,
      name: "María López García",
      phone: "+34 612 345 678",
      role: "TEACHER",
      isActive: true,
      teacherProfile: {
        create: {
          employeeId: "EMP-001",
          specialty: "Inglés Conversacional",
          hireDate: new Date("2022-01-15"),
          salary: 2500.0,
          isActive: true,
        },
      },
    },
    include: { teacherProfile: true },
  });

  const teacher2 = await prisma.user.create({
    data: {
      email: "profe.carlos@academia-sea.com",
      password: hashedPassword,
      name: "Carlos Rodríguez Martínez",
      phone: "+34 612 345 679",
      role: "TEACHER",
      isActive: true,
      teacherProfile: {
        create: {
          employeeId: "EMP-002",
          specialty: "Inglés de Negocios",
          hireDate: new Date("2021-08-01"),
          salary: 2800.0,
          isActive: true,
        },
      },
    },
    include: { teacherProfile: true },
  });

  const teacher3 = await prisma.user.create({
    data: {
      email: "profe.sara@academia-sea.com",
      password: hashedPassword,
      name: "Sara Fernández Pérez",
      phone: "+34 612 345 680",
      role: "TEACHER",
      isActive: true,
      teacherProfile: {
        create: {
          employeeId: "EMP-003",
          specialty: "Gramática y Escritura",
          hireDate: new Date("2023-01-10"),
          salary: 2400.0,
          isActive: true,
        },
      },
    },
    include: { teacherProfile: true },
  });

  // Crear asignaciones de cursos
  console.log("📋 Asignando cursos a profesores...");
  await prisma.courseAssignment.create({
    data: {
      courseId: englishCourse.id,
      groupId: groupA.id,
      teacherId: teacher1.teacherProfile!.id,
      cycleId: schoolCycle.id,
    },
  });

  await prisma.courseAssignment.create({
    data: {
      courseId: englishCourse.id,
      groupId: groupB.id,
      teacherId: teacher2.teacherProfile!.id,
      cycleId: schoolCycle.id,
    },
  });

  await prisma.courseAssignment.create({
    data: {
      courseId: businessCourse.id,
      groupId: groupC.id,
      teacherId: teacher3.teacherProfile!.id,
      cycleId: schoolCycle.id,
    },
  });

  // Crear familias
  console.log("👨‍👩‍👧 Creando familias...");
  const family1 = await prisma.family.create({
    data: {
      name: "Familia García López",
      phone: "+34 612 111 111",
      email: "familia1@email.com",
      address: "Calle Principal 123, Ciudad",
    },
  });

  const family2 = await prisma.family.create({
    data: {
      name: "Familia Martínez Gómez",
      phone: "+34 612 222 222",
      email: "familia2@email.com",
      address: "Avenida Central 456, Ciudad",
    },
  });

  // Crear estudiantes
  console.log("👨‍🎓 Creando estudiantes...");
  const students = [];

  for (let i = 1; i <= 15; i++) {
    const student = await prisma.user.create({
      data: {
        email: `alumno${i}@academia-sea.com`,
        password: hashedPassword,
        name: `Alumno ${i}`,
        phone: `+34 612 ${String(i).padStart(3, "0")} 999`,
        role: "STUDENT",
        isActive: true,
        studentProfile: {
          create: {
            studentId: `ALU-${String(i).padStart(4, "0")}`,
            birthDate: new Date(`2005-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`),
            gender: i % 2 === 0 ? "Masculino" : "Femenino",
            address: `Dirección del Alumno ${i}`,
            city: "Ciudad",
            state: "Estado",
            emergencyContact: `Contacto Emergencia ${i}`,
            emergencyPhone: `+34 612 ${String(i).padStart(3, "0")} 888`,
            bloodType: ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"][i % 8],
            isActive: true,
          },
        },
      },
      include: { studentProfile: true },
    });
    students.push(student);
  }

  // Asignar estudiantes a grupos e inscripciones
  console.log("📝 Inscribiendo estudiantes en cursos...");
  for (let i = 0; i < 5; i++) {
    await prisma.studentEnrollment.create({
      data: {
        studentId: students[i].studentProfile!.id,
        courseId: englishCourse.id,
        groupId: groupA.id,
        cycleId: schoolCycle.id,
        status: "ACTIVE",
      },
    });
  }

  for (let i = 5; i < 10; i++) {
    await prisma.studentEnrollment.create({
      data: {
        studentId: students[i].studentProfile!.id,
        courseId: englishCourse.id,
        groupId: groupB.id,
        cycleId: schoolCycle.id,
        status: "ACTIVE",
      },
    });
  }

  for (let i = 10; i < 15; i++) {
    await prisma.studentEnrollment.create({
      data: {
        studentId: students[i].studentProfile!.id,
        courseId: businessCourse.id,
        groupId: groupC.id,
        cycleId: schoolCycle.id,
        status: "ACTIVE",
      },
    });
  }

  // Asociar estudiantes con familias
  console.log("🔗 Asociando estudiantes con familias...");
  for (let i = 0; i < 5; i++) {
    await prisma.familyLink.create({
      data: {
        studentProfileId: students[i].studentProfile!.id,
        familyId: family1.id,
        relationship: "Padre/Madre",
        isPrimary: true,
      },
    });
  }

  for (let i = 5; i < 10; i++) {
    await prisma.familyLink.create({
      data: {
        studentProfileId: students[i].studentProfile!.id,
        familyId: family2.id,
        relationship: "Padre/Madre",
        isPrimary: true,
      },
    });
  }

  // Crear unidades y exámenes
  console.log("✏️  Creando unidades y exámenes...");
  const unit1 = await prisma.unit.create({
    data: {
      courseId: englishCourse.id,
      name: "Unidad 1: Presente Simple",
      order: 1,
    },
  });

  const exam1 = await prisma.exam.create({
    data: {
      unitId: unit1.id,
      title: "Examen Unidad 1",
      type: "EXAM",
      maxScore: 100,
      weight: 1,
      examDate: new Date("2024-10-15"),
    },
  });

  // Agregar calificaciones
  console.log("⭐ Agregando calificaciones...");
  for (let i = 0; i < 5; i++) {
    await prisma.grade.create({
      data: {
        studentId: students[i].studentProfile!.id,
        examId: exam1.id,
        value: 85 + Math.random() * 15, // Entre 85 y 100
        comment: "Excelente desempeño",
      },
    });
  }

  // Agregar asistencia
  console.log("🎯 Agregando registros de asistencia...");
  for (let i = 0; i < 5; i++) {
    await prisma.attendance.create({
      data: {
        studentId: students[i].studentProfile!.id,
        date: new Date("2024-10-10"),
        status: i % 3 === 0 ? "ABSENT" : "PRESENT",
      },
    });
  }

  // Crear conceptos de cobro
  console.log("💰 Creando conceptos de cobro...");
  const tuitionConcept = await prisma.chargeConcept.create({
    data: {
      name: "Mensualidad",
      description: "Pago mensual de curso",
      amount: 150.0,
      type: "TUITION",
      cycleId: schoolCycle.id,
    },
  });

  const enrollmentConcept = await prisma.chargeConcept.create({
    data: {
      name: "Inscripción",
      description: "Cuota de inscripción",
      amount: 100.0,
      type: "ENROLLMENT",
      cycleId: schoolCycle.id,
    },
  });

  // Crear planes de pago
  console.log("💳 Creando planes de pago...");
  const monthlyPlan = await prisma.paymentPlan.create({
    data: {
      name: "Plan Mensual",
      description: "Pago mensual",
      cycleId: schoolCycle.id,
      frequency: "MONTHLY",
      installments: 10,
      amount: 150.0,
      conceptId: tuitionConcept.id,
    },
  });

  // Crear pagos
  console.log("📊 Creando pagos...");
  for (let i = 0; i < 5; i++) {
    await prisma.payment.create({
      data: {
        studentId: students[i].studentProfile!.id,
        cycleId: schoolCycle.id,
        conceptId: tuitionConcept.id,
        amount: 150.0,
        status: i % 2 === 0 ? "PAID" : "PENDING",
        method: "BANK_TRANSFER",
        dueDate: new Date("2024-10-30"),
        paidAt: i % 2 === 0 ? new Date("2024-10-25") : null,
      },
    });
  }

  // Crear usuario admin
  console.log("🔐 Creando usuario administrador...");
  await prisma.user.create({
    data: {
      email: "admin@academia-sea.com",
      password: hashedPassword,
      name: "Administrador",
      role: "ADMIN",
      isActive: true,
    },
  });

  console.log("\n✅ ¡Seed completado con éxito!\n");
  console.log("📧 Cuentas de prueba:");
  console.log("   Admin: admin@academia-sea.com");
  console.log("   Profesor 1: profe.maria@academia-sea.com");
  console.log("   Profesor 2: profe.carlos@academia-sea.com");
  console.log("   Profesor 3: profe.sara@academia-sea.com");
  console.log("   Alumno: alumno1@academia-sea.com (1-15)");
  console.log("   Contraseña: password123\n");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
