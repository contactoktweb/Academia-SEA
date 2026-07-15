export const dynamic = "force-dynamic";

import { DashboardTopBar } from "@/components/dashboard/sidebar";
import { Suspense } from "react";
import { GradesTable } from "@/components/dashboard/grades-table";
import { TableLoadingState } from "@/components/dashboard/table-skeleton";

export default async function CalificacionesPage({ searchParams }: { searchParams: Promise<{ query?: string }> }) {
  const params = await searchParams;
  const query = params?.query || "";

  return (
    <div className="flex flex-col gap-6">
      <DashboardTopBar title="Calificaciones y Boletas" />

      <Suspense fallback={<TableLoadingState />}>
        <GradesTable query={query} />
      </Suspense>
    </div>
  );
}
