export const dynamic = "force-dynamic";

import { DashboardTopBar } from "@/components/dashboard/sidebar";
import { Suspense } from "react";
import { CoursesTable } from "@/components/dashboard/courses-table";
import { TableLoadingState } from "@/components/dashboard/table-skeleton";
import { auth } from "@/lib/auth";

export default async function CursosPage() {
  const session = await auth();
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  return (
    <div className="flex flex-col gap-6">
      <DashboardTopBar title="Gestión de Cursos" />

      <Suspense fallback={<TableLoadingState />}>
        <CoursesTable isAdmin={isAdmin} />
      </Suspense>
    </div>
  );
}
