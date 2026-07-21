import { DashboardTopBar } from "@/components/dashboard/sidebar"
import { getVirtualClasses } from "./actions"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Video, Users, Calendar, AlertCircle } from "lucide-react"

export default async function VirtualClassesPage() {
  const { groups, error } = await getVirtualClasses()

  return (
    <div className="flex h-screen flex-col bg-slate-50 dark:bg-slate-900">
      <DashboardTopBar title="Clases Virtuales" />
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">Mis Clases Virtuales</h1>
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              Calendario
            </Button>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-950 dark:text-red-200 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}

          {!error && (!groups || groups.length === 0) && (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
              <Video className="h-12 w-12 text-slate-400 mb-4" />
              <h3 className="text-lg font-medium">No tienes clases virtuales</h3>
              <p className="text-slate-500 mt-2">
                No estás asignado a ningún grupo con modalidad virtual en este momento.
              </p>
            </div>
          )}

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {groups?.map((group) => (
              <div
                key={group.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-slate-950"
              >
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      En Vivo
                    </span>
                    <Users className="h-4 w-4 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{group.name}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                    Nivel: {group.level}
                    <br />
                    {group.schedule ? `Horario: ${group.schedule}` : "Horario no definido"}
                  </p>
                </div>

                <Link href={`/dashboard/clases-virtuales/${group.id}`} className="mt-4">
                  <Button className="w-full group-hover:bg-blue-600 transition-colors">
                    <Video className="mr-2 h-4 w-4" />
                    Unirse a la clase
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
