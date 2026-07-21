import { PrismaClient, Modality } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log("Configurando datos de prueba para Clases Virtuales...")

  const defaultPassword = await bcrypt.hash("Prueba123!", 10)
  const sede = "SEAAUTLAN"

  // 1. Admin
  const admin = await prisma.user.upsert({
    where: { email: "admin@academiasea.com" },
    update: { isApproved: true },
    create: {
      email: "admin@academiasea.com",
      password: defaultPassword,
      name: "Administrador Principal",
      role: "ADMIN",
      sede: sede,
      isApproved: true,
    }
  })

  // 2. Profesor
  let teacherUser = await prisma.user.findUnique({
    where: { email: "maestro@academiasea.com" },
    include: { teacherProfile: true }
  })

  if (!teacherUser) {
    teacherUser = await prisma.user.create({
      data: {
        email: "maestro@academiasea.com",
        password: defaultPassword,
        name: "Profesor Virtual",
        role: "TEACHER",
        sede: sede,
        isApproved: true,
        teacherProfile: {
          create: {
            specialty: "Inglés & Tecnología",
            sede: sede,
            isActive: true
          }
        }
      },
      include: { teacherProfile: true }
    })
  }

  let teacherProfile = teacherUser.teacherProfile
  if (!teacherProfile) {
    teacherProfile = await prisma.teacherProfile.create({
      data: {
        userId: teacherUser.id,
        specialty: "Inglés & Tecnología",
        sede: sede,
        isActive: true
      }
    })
  }

  // 3. Estudiante Virtual
  let studentUser = await prisma.user.findUnique({
    where: { email: "alumno@academiasea.com" },
    include: { studentProfile: true }
  })

  if (!studentUser) {
    studentUser = await prisma.user.create({
      data: {
        email: "alumno@academiasea.com",
        password: defaultPassword,
        name: "Alumno Virtual",
        role: "STUDENT",
        sede: sede,
        isApproved: true,
        studentProfile: {
          create: {
            sede: sede,
            modality: Modality.VIRTUAL,
            curp: "VIRT123456EFGHIJ78",
            emergencyContact: "Tutor Virtual",
            emergencyPhone: "3171234567"
          }
        }
      },
      include: { studentProfile: true }
    })
  } else if (studentUser.studentProfile) {
    await prisma.studentProfile.update({
      where: { id: studentUser.studentProfile.id },
      data: { modality: Modality.VIRTUAL }
    })
  }

  let studentProfile = studentUser.studentProfile
  if (!studentProfile) {
    studentProfile = await prisma.studentProfile.create({
      data: {
        userId: studentUser.id,
        sede: sede,
        modality: Modality.VIRTUAL,
      }
    })
  }

  // 4. Ciclo escolar
  let cycle = await prisma.schoolCycle.findFirst({ where: { isActive: true } })
  if (!cycle) {
    cycle = await prisma.schoolCycle.create({
      data: {
        name: "Ciclo Virtual 2026",
        startDate: new Date("2026-01-01"),
        endDate: new Date("2026-12-31"),
        sede: sede,
        isActive: true,
      }
    })
  }

  // 5. Curso Virtual
  let course = await prisma.course.findFirst({ where: { code: "VIRT-101" } })
  if (!course) {
    course = await prisma.course.create({
      data: {
        name: "Inglés Virtual Avanzado",
        code: "VIRT-101",
        level: "Avanzado",
        sede: sede,
        isActive: true,
        cycleId: cycle.id
      }
    })
  }

  // 6. Grupo Virtual
  let group = await prisma.group.findFirst({ where: { name: "Grupo Virtual 101" } })
  if (!group) {
    group = await prisma.group.create({
      data: {
        name: "Grupo Virtual 101",
        level: "Avanzado",
        schedule: "Lunes a Viernes 10:00 AM - 11:30 AM",
        modality: Modality.VIRTUAL,
        sede: sede,
        isActive: true,
        maxStudents: 20
      }
    })
  } else {
    group = await prisma.group.update({
      where: { id: group.id },
      data: { modality: Modality.VIRTUAL }
    })
  }

  // 7. Asignación de Profesor al Grupo
  const assignment = await prisma.courseAssignment.findFirst({
    where: { groupId: group.id, teacherId: teacherProfile.id }
  })
  if (!assignment) {
    await prisma.courseAssignment.create({
      data: {
        courseId: course.id,
        groupId: group.id,
        teacherId: teacherProfile.id,
        cycleId: cycle.id,
        sede: sede
      }
    })
  }

  // 8. Inscripción de Alumno al Grupo
  const enrollment = await prisma.studentEnrollment.findFirst({
    where: { studentId: studentProfile.id, courseId: course.id }
  })
  if (!enrollment) {
    await prisma.studentEnrollment.create({
      data: {
        studentId: studentProfile.id,
        courseId: course.id,
        groupId: group.id,
        cycleId: cycle.id,
        sede: sede,
        status: "ACTIVE"
      }
    })
  }

  console.log("✅ Datos de prueba para clases virtuales listos.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
