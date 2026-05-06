import { DashboardTopBar } from "@/components/dashboard/sidebar";
import { Suspense } from "react";
import { StudentsTable } from "@/components/dashboard/students-table";
import { TableLoadingState } from "@/components/dashboard/table-skeleton";

export const dynamic = "force-dynamic";

export default function AlumnosPage() {
  return (
    <div className="flex flex-col gap-6">
      <DashboardTopBar title="Directorio de Alumnos" />

      <Suspense fallback={<TableLoadingState />}>
        <StudentsTable />
      </Suspense>
    </div>
  );
}
