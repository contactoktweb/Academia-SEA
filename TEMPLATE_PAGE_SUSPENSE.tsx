export const dynamic = "force-dynamic";

import { DashboardTopBar } from "@/components/dashboard/sidebar";
import { Suspense } from "react";
import { FamiliesTable } from "@/components/dashboard/families-table";
import { TableLoadingState } from "@/components/dashboard/table-skeleton";

export default function FamiliasPage() {
  return (
    <div className="flex flex-col gap-6">
      <DashboardTopBar title="Directorio de Familias" />

      <Suspense fallback={<TableLoadingState />}>
        <FamiliesTable />
      </Suspense>
    </div>
  );
}
