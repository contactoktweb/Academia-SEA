export const dynamic = "force-dynamic";

import { DashboardTopBar } from "@/components/dashboard/sidebar";
import { Suspense } from "react";
import { PaymentsTable } from "@/components/dashboard/payments-table";
import { TableLoadingState } from "@/components/dashboard/table-skeleton";

export default function PagosPage() {
  return (
    <div className="flex flex-col gap-6">
      <DashboardTopBar title="Finanzas y Pagos" />

      <Suspense fallback={<TableLoadingState />}>
        <PaymentsTable />
      </Suspense>
    </div>
  );
}
