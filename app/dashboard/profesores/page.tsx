export const dynamic = "force-dynamic";

import { DashboardTopBar } from "@/components/dashboard/sidebar";
import { Suspense } from "react";
import { TeachersTable } from "@/components/dashboard/teachers-table";
import { TableLoadingState } from "@/components/dashboard/table-skeleton";

export default function ProfesoresPage() {
  return (
    <div className="flex flex-col gap-6">
      <DashboardTopBar title="Directorio de Profesores" />

      <Suspense fallback={<TableLoadingState />}>
        <TeachersTable />
      </Suspense>
    </div>
  );
}
