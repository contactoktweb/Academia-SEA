import { DashboardTopBar } from "@/components/dashboard/sidebar"
import { getSystemConfig } from "@/app/dashboard/configuracion/actions"
import { ConfigTabsClient } from "@/components/dashboard/config-tabs"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function Page() {
  const result = await getSystemConfig();

  return (
    <div className="flex flex-col gap-6">
      <DashboardTopBar title="Configuración del Sistema" />
      <Suspense fallback={
        <div className="flex items-center justify-center h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }>
        {result.success && result.data ? (
          <ConfigTabsClient data={result.data} />
        ) : (
          <div className="flex flex-col items-center justify-center h-[50vh] text-muted-foreground bg-slate-50 border border-slate-200 rounded-lg">
            <p>Ocurrió un error al cargar la configuración del sistema.</p>
          </div>
        )}
      </Suspense>
    </div>
  )
}
