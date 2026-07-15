import { DashboardTopBar } from "@/components/dashboard/sidebar";
import { Suspense } from "react";
import { ReportsTable } from "@/components/dashboard/reports-table";
import { TableLoadingState } from "@/components/dashboard/table-skeleton";

export default async function BoletasPage({ searchParams }: { searchParams: Promise<{ query?: string }> }) {
  const params = await searchParams;
  const query = params?.query || "";

  return (
    <div className="flex flex-col gap-6">
      <DashboardTopBar title="Boletas y Reportes" />
      <Suspense fallback={<TableLoadingState />}>
        <ReportsTable query={query} />
      </Suspense>
    </div>
  );
}
