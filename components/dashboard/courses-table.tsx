import { db } from "@/lib/db";
import { getSedeCondition } from "@/lib/multi-tenancy";
import { CoursesAndGroupsView } from "./courses-and-groups-view";
import { auth } from "@/lib/auth";

export async function CoursesTable({ isAdmin = true }: { isAdmin?: boolean }) {
  const sedeCondition = await getSedeCondition();
  const session = await auth();
  const activeSede = (session?.user as any)?.sede || "SEAAUTLAN";
  const userRole = session?.user?.role;
  const userId = session?.user?.id;

  // Obtener perfil de profesor si aplica
  let teacherProfile: { id: string } | null = null;
  if (userRole === "TEACHER" && userId) {
    teacherProfile = await db.teacherProfile.findUnique({
      where: { userId },
      select: { id: true },
    });
  }

  // ─── Filtros por rol ─────────────────────────────────────────────────────────
  const courseWhere = teacherProfile
    ? {
        isActive: true,
        assignments: {
          some: { teacherId: teacherProfile.id },
        },
      }
    : { ...sedeCondition, isActive: true };

  const groupWhere = teacherProfile
    ? {
        isActive: true,
        assignments: {
          some: { teacherId: teacherProfile.id },
        },
      }
    : { ...sedeCondition, isActive: true };

  const [rawCourses, rawGroups] = await Promise.all([
    db.course.findMany({
      where: courseWhere,
      include: {
        cycle: true,
        assignments: {
          // Si es profesor, incluir solo sus asignaciones; si es admin, todas
          ...(teacherProfile
            ? { where: { teacherId: teacherProfile.id } }
            : {}),
          include: {
            teacher: { include: { user: true } },
            group: true,
          },
        },
        enrollments: true,
        units: true,
      },
      orderBy: { name: "asc" },
    }),
    db.group.findMany({
      where: groupWhere,
      include: {
        assignments: {
          ...(teacherProfile
            ? { where: { teacherId: teacherProfile.id } }
            : {}),
          include: {
            course: true,
            teacher: { include: { user: true } },
          },
        },
        enrollments: {
          where: { status: "ACTIVE" },
        },
      },
      orderBy: { name: "asc" },
    }),
  ]);

  // Serialize Decimal objects for Client Components
  const courses = rawCourses.map((course) => ({
    ...course,
    assignments: course.assignments.map((as) => ({
      ...as,
      teacher: as.teacher
        ? {
            ...as.teacher,
            salary: as.teacher.salary ? Number(as.teacher.salary) : null,
          }
        : null,
      customMonthlyFee: as.customMonthlyFee
        ? Number(as.customMonthlyFee)
        : null,
    })),
    enrollments: course.enrollments.map((en) => ({
      ...en,
      monthlyValue: en.monthlyValue ? Number(en.monthlyValue) : null,
    })),
  })) as any[];

  const groups = rawGroups.map((group) => ({
    ...group,
    assignments: group.assignments.map((as) => ({
      ...as,
      teacher: as.teacher
        ? {
            ...as.teacher,
            salary: as.teacher.salary ? Number(as.teacher.salary) : null,
          }
        : null,
      customMonthlyFee: as.customMonthlyFee
        ? Number(as.customMonthlyFee)
        : null,
    })),
    enrollments: group.enrollments.map((en) => ({
      ...en,
      monthlyValue: en.monthlyValue ? Number(en.monthlyValue) : null,
    })),
  })) as any[];

  return (
    <CoursesAndGroupsView
      courses={courses}
      groups={groups}
      isAdmin={isAdmin}
      activeSede={activeSede}
    />
  );
}

