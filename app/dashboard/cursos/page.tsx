export const dynamic = "force-dynamic";

import { DashboardTopBar } from "@/components/dashboard/sidebar";
import { Suspense } from "react";
import { CoursesTable } from "@/components/dashboard/courses-table";
import { TableLoadingState } from "@/components/dashboard/table-skeleton";

export default function CursosPage() {
  return (
    <div className="flex flex-col gap-6">
      <DashboardTopBar title="Gestión de Cursos" />

      <Suspense fallback={<TableLoadingState />}>
        <CoursesTable />
      </Suspense>
    </div>
  );
}
