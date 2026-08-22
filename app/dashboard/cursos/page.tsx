export const dynamic = "force-dynamic";

import { DashboardTopBar } from "@/components/dashboard/sidebar";
import { Suspense } from "react";
import { CoursesTable } from "@/components/dashboard/courses-table";
import { TableLoadingState } from "@/components/dashboard/table-skeleton";
import { auth } from "@/lib/auth";
import { getStudentAcademicAccess } from "@/lib/student-access";
import { StudentCoursesView } from "@/components/dashboard/student-courses-view";

export default async function CursosPage() {
  const session = await auth();
  const role = (session?.user as any)?.role;
  const isStudent = role === "STUDENT";
  const isAdmin = role === "ADMIN";

  let studentAccess = null;
  if (isStudent && session?.user?.id) {
    studentAccess = await getStudentAcademicAccess(session.user.id);
  }

  return (
    <div className="flex flex-col gap-6">
      <DashboardTopBar title={isStudent ? "Mis Cursos Académicos" : "Gestión de Cursos"} />

      <Suspense fallback={<TableLoadingState />}>
        {isStudent && studentAccess ? (
          <StudentCoursesView access={studentAccess} />
        ) : (
          <CoursesTable isAdmin={isAdmin} />
        )}
      </Suspense>
    </div>
  );
}
