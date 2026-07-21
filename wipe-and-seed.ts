import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log("Limpiando base de datos...")
  // Clean all data in proper order to respect foreign keys
  await prisma.activityLog.deleteMany()
  await prisma.report.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.message.deleteMany()
  await prisma.announcement.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.studentPaymentPlan.deleteMany()
  await prisma.paymentPlan.deleteMany()
  await prisma.chargeConcept.deleteMany()
  await prisma.attendance.deleteMany()
  await prisma.grade.deleteMany()
  await prisma.studentEnrollment.deleteMany()
  await prisma.document.deleteMany()
  await prisma.familyLink.deleteMany()
  await prisma.family.deleteMany()
  await prisma.studentProfile.deleteMany()
  await prisma.examQuestion.deleteMany()
  await prisma.exam.deleteMany()
  await prisma.unit.deleteMany()
  await prisma.courseAssignment.deleteMany()
  await prisma.course.deleteMany()
  await prisma.group.deleteMany()
  await prisma.schoolCycle.deleteMany()
  await prisma.teacherProfile.deleteMany()
  await prisma.verificationCode.deleteMany()
  await prisma.calendarEvent.deleteMany()
  await prisma.scholarship.deleteMany()
  await prisma.user.deleteMany()

  console.log("Base de datos limpia. Creando datos semilla...")

  const defaultPassword = await bcrypt.hash("Prueba123!", 10)
  const sede = "SEAAUTLAN"

  // 1. Admin
  await prisma.user.create({
    data: {
      email: "admin@academiasea.com",
      password: defaultPassword,
      name: "Administrador Principal",
      role: "ADMIN",
      sede: sede,
      isApproved: true,
    }
  })

  // 2. Maestro
  const teacher = await prisma.user.create({
    data: {
      email: "maestro@academiasea.com",
      password: defaultPassword,
      name: "Profesor Prueba",
      role: "TEACHER",
      sede: sede,
      isApproved: true,
      teacherProfile: {
        create: {
          specialty: "Matemáticas",
          sede: sede,
          isActive: true
        }
      }
    },
    include: { teacherProfile: true }
  })

  // 3. Alumno
  const student = await prisma.user.create({
    data: {
      email: "alumno@academiasea.com",
      password: defaultPassword,
      name: "Alumno Prueba",
      role: "STUDENT",
      sede: sede,
      isApproved: true,
      studentProfile: {
        create: {
          sede: sede,
          curp: "ABCD123456EFGHIJ78",
          emergencyContact: "Tutor Prueba",
          emergencyPhone: "3171234567"
        }
      }
    },
    include: { studentProfile: true }
  })

  // Create Cycle, Course, Group
  const cycle = await prisma.schoolCycle.create({
    data: {
      name: `Ciclo Actual`,
      startDate: new Date("2024-08-01"),
      endDate: new Date("2025-07-31"),
      sede: sede,
      isActive: true,
    },
  });

  const course = await prisma.course.create({
    data: {
      name: `Materia Prueba`,
      code: `MAT-01`,
      level: "Básico",
      sede: sede,
      isActive: true,
      cycleId: cycle.id,
    },
  });

  const group = await prisma.group.create({
    data: {
      name: `Grupo Prueba A`,
      level: "Básico",
      sede: sede,
      isActive: true,
      maxStudents: 30,
    },
  });

  // Assign teacher
  await prisma.courseAssignment.create({
    data: {
      courseId: course.id,
      groupId: group.id,
      teacherId: teacher.teacherProfile!.id,
      cycleId: cycle.id,
      sede: sede,
    }
  });

  // Enroll student
  await prisma.studentEnrollment.create({
    data: {
      studentId: student.studentProfile!.id,
      courseId: course.id,
      groupId: group.id,
      cycleId: cycle.id,
      sede: sede,
      monthlyConcept: "TUITION",
      monthlyValue: 1000.0,
    }
  });

  console.log("Datos semilla creados con éxito.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
