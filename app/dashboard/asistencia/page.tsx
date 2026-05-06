export const dynamic = "force-dynamic";

import { DashboardTopBar } from "@/components/dashboard/sidebar";
import { Suspense } from "react";
import { AttendanceTable } from "@/components/dashboard/attendance-table";
import { TableLoadingState } from "@/components/dashboard/table-skeleton";

export default function AsistenciaPage() {
  return (
    <div className="flex flex-col gap-6">
      <DashboardTopBar title="Asistencia Diaria" />

      <Suspense fallback={<TableLoadingState />}>
        <AttendanceTable />
      </Suspense>
    </div>
  );
}
