import { DashboardTopBar } from "@/components/dashboard/sidebar";
import { Suspense } from "react";
import { ExamsTable } from "@/components/dashboard/exams-table";
import { TableLoadingState } from "@/components/dashboard/table-skeleton";

export default async function EvaluacionesPage({ searchParams }: { searchParams: Promise<{ query?: string }> }) {
  const params = await searchParams;
  const query = params?.query || "";

  return (
    <div className="flex flex-col gap-6">
      <DashboardTopBar title="Exámenes y Evaluaciones" />
      <Suspense fallback={<TableLoadingState />}>
        <ExamsTable query={query} />
      </Suspense>
    </div>
  );
}
