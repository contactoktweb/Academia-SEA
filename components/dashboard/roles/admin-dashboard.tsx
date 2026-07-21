

import { DashboardTopBar } from "@/components/dashboard/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Suspense } from "react"
import { DashboardOverviewStats } from "@/components/dashboard/overview-stats"
import { Skeleton } from "@/components/ui/skeleton"
import { RecentActivityLog } from "@/components/dashboard/recent-activity"
function StatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-3 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function AdminDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <DashboardTopBar title="Panel de Administración" />
      
      <Suspense fallback={<StatsSkeleton />}>
        <DashboardOverviewStats />
      </Suspense>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <Suspense fallback={<div className="h-[300px] flex items-center justify-center text-sm text-slate-500">Cargando actividad...</div>}>
              <RecentActivityLog />
            </Suspense>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Panel Rápido</CardTitle>
            <CardDescription>Acciones principales del administrador</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex flex-col gap-2">
               <button className="flex w-full items-center text-sm p-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-left group">
                 <span className="flex-1">Asignar curso a profesor/alumno</span>
                 <span className="text-slate-300 group-hover:text-sea-blue transition-colors">→</span>
               </button>
               <button className="flex w-full items-center text-sm p-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-left group">
                 <span className="flex-1">Ver estado de pagos internacionales</span>
                 <span className="text-slate-300 group-hover:text-sea-blue transition-colors">→</span>
               </button>
               <button className="flex w-full items-center text-sm p-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-left group">
                 <span className="flex-1">Crear y asignar un nuevo grupo</span>
                 <span className="text-slate-300 group-hover:text-sea-blue transition-colors">→</span>
               </button>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
