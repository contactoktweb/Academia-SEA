import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LogIn } from "lucide-react"

export async function RecentActivityLog() {
  const session = await auth()
  
  if (!session?.user?.id) return null

  // Fetch only the last 10 login logs for the current user
  const logs = await db.activityLog.findMany({
    where: {
      userId: session.user.id,
      action: "LOGIN"
    },
    orderBy: {
      createdAt: "desc"
    },
    take: 10
  })

  if (logs.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground text-sm">
        No hay registros de ingreso recientes.
      </div>
    )
  }

  return (
    <ScrollArea className="h-[300px] pr-4">
      <div className="space-y-4">
        {logs.map((log) => {
          const details = log.details as { sede?: string; ipAddress?: string } | null;
          
          return (
            <div key={log.id} className="flex items-start gap-4 p-3 rounded-lg border bg-slate-50/50 dark:bg-slate-900/50 transition-colors hover:bg-slate-50 dark:hover:bg-slate-900">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-sea-blue rounded-full">
                <LogIn className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium leading-none mb-1">Inicio de Sesión Exitoso</p>
                <div className="flex flex-col text-xs text-muted-foreground">
                  <span>Desde la Sede: <span className="font-semibold text-slate-700 dark:text-slate-300">{details?.sede || "General"}</span></span>
                  {details?.ipAddress && <span>IP: {details.ipAddress}</span>}
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-slate-500 whitespace-nowrap">
                  {new Date(log.createdAt).toLocaleDateString()}
                </p>
                <p className="text-[10px] text-muted-foreground whitespace-nowrap">
                  {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </ScrollArea>
  )
}
