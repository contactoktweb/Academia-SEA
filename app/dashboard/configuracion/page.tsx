import { DashboardTopBar } from "@/components/dashboard/sidebar"
import { getSystemConfig } from "@/app/dashboard/configuracion/actions"
import { ConfigTabsClient } from "@/components/dashboard/config-tabs"
import { Suspense } from "react"
import { Loader2, Info } from "lucide-react"
import { auth } from "@/lib/auth"

export default async function Page() {
  const session = await auth();
  const isApproved = session?.user?.isApproved ?? true;
  const result = await getSystemConfig();

  return (
    <div className="flex flex-col gap-6">
      <DashboardTopBar title="Configuración" />
      
      {!isApproved && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-xl p-4 flex items-start gap-3">
          <Info className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-500" />
          <div>
            <h3 className="font-semibold text-sm">Cuenta en revisión</h3>
            <p className="text-sm mt-1">
              Tu cuenta ha sido creada exitosamente pero se encuentra en estado de revisión. 
              Podrás acceder a todas las funciones (mensajes, calificaciones, etc.) una vez que un administrador valide tus datos y te asigne a un grupo o curso.
            </p>
          </div>
        </div>
      )}

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
