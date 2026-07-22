import { DashboardTopBar } from "@/components/dashboard/sidebar"
import { getVirtualClasses } from "./actions"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Video, Users, Calendar, AlertCircle } from "lucide-react"
import { auth } from "@/lib/auth"
import { ScheduleClassDialog } from "./ScheduleClassDialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VirtualClassesCalendar } from "@/components/dashboard/virtual-classes-calendar"

export default async function VirtualClassesPage() {
  const session = await auth()
  const role = session?.user?.role
  const isTeacherOrAdmin = role === 'TEACHER' || role === 'ADMIN'
  const { groups, error } = await getVirtualClasses()

  return (
    <div className="flex h-screen flex-col bg-slate-50 dark:bg-slate-900">
      <DashboardTopBar title="Clases Virtuales" />
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">Mis Clases Virtuales</h1>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-950 dark:text-red-200 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}

          {!error && (
            <Tabs defaultValue="calendar" className="w-full">
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="calendar">
                    <Calendar className="mr-2 h-4 w-4" />
                    Calendario Semanal
                  </TabsTrigger>
                  <TabsTrigger value="cards">
                    Clases
                  </TabsTrigger>
                </TabsList>
                {isTeacherOrAdmin && (
                  <ScheduleClassDialog 
                    groups={groups || []} 
                    trigger={<Button size="sm">Agendar Nueva Clase</Button>} 
                  />
                )}
              </div>

              <TabsContent value="calendar" className="mt-0">
                {(!groups || groups.length === 0) ? (
                  <div className="flex flex-col items-center justify-center rounded-lg border bg-white dark:bg-slate-950 border-dashed p-12 text-center">
                    <Video className="h-12 w-12 text-slate-400 mb-4" />
                    <h3 className="text-lg font-medium">No tienes clases virtuales</h3>
                    <p className="text-slate-500 mt-2">
                      No estás asignado a ningún grupo con modalidad virtual en este momento.
                    </p>
                  </div>
                ) : (
                  <VirtualClassesCalendar groups={groups} isTeacherOrAdmin={isTeacherOrAdmin} />
                )}
              </TabsContent>

              <TabsContent value="cards" className="mt-0">
                {(!groups || groups.length === 0) ? (
                  <div className="flex flex-col items-center justify-center rounded-lg border bg-white dark:bg-slate-950 border-dashed p-12 text-center">
                    <Video className="h-12 w-12 text-slate-400 mb-4" />
                    <h3 className="text-lg font-medium">No tienes clases virtuales</h3>
                    <p className="text-slate-500 mt-2">
                      No estás asignado a ningún grupo con modalidad virtual en este momento.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {groups?.map((group) => (
                      <div
                        key={group.id}
                        className="group relative flex flex-col justify-between overflow-hidden rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-slate-950"
                      >
                        <div>
                          <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                En Vivo
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {isTeacherOrAdmin && (
                                <ScheduleClassDialog groupId={group.id} currentNextClassAt={group.nextClassAt} />
                              )}
                              <Users className="h-4 w-4 text-slate-400" />
                            </div>
                          </div>
                          <h3 className="text-xl font-bold mb-2">{group.name}</h3>
                          <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                            Nivel: {group.level}
                            <br />
                            {group.schedule ? `Horario: ${group.schedule}` : "Horario no definido"}
                          </p>
                          {group.nextClassAt && (
                            <div className="mb-4 text-sm font-medium text-blue-700 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-300 p-2 rounded-md">
                              Próxima clase: {new Date(group.nextClassAt).toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' })}
                              {group.nextClassTopic && (
                                <div className="text-xs mt-1 font-normal italic text-blue-600 dark:text-blue-400">
                                  Tema: {group.nextClassTopic}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="mt-4">
                          <Link href={`/dashboard/clases-virtuales/${group.id}`} className="w-full">
                            <Button className="w-full group-hover:bg-blue-600 transition-colors">
                              <Video className="mr-2 h-4 w-4" />
                              Unirse a la clase
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
    </div>
  )
}
