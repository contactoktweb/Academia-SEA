import { DashboardTopBar } from "@/components/dashboard/sidebar"
import { getDashboardMetrics } from "@/app/dashboard/metricas/actions"
import { MetricsDashboardClient } from "@/components/dashboard/metrics-charts"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function Page() {
  const result = await getDashboardMetrics();

  return (
    <div className="flex flex-col gap-6">
      <DashboardTopBar title="Métricas" />
      <Suspense fallback={
        <div className="flex items-center justify-center h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }>
        {result.success && result.data ? (
          <MetricsDashboardClient data={result.data} />
        ) : (
          <div className="flex flex-col items-center justify-center h-[50vh] text-muted-foreground bg-slate-50 border border-slate-200 rounded-lg">
            <p>Ocurrió un error al cargar las métricas o no hay datos disponibles.</p>
          </div>
        )}
      </Suspense>
    </div>
  )
}
