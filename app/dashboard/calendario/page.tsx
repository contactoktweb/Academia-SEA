import { DashboardTopBar } from "@/components/dashboard/sidebar";
import { CalendarForm } from "@/components/dashboard/calendar-form";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { Calendar as CalendarIcon, Clock, BookOpen, Flag, CalendarDays, Sparkles } from "lucide-react";
import { getSedeCondition } from "@/lib/multi-tenancy";

const typeIcons: Record<string, any> = {
  INICIO_CURSO: BookOpen,
  FIN_CURSO: Flag,
  EXAMEN: Clock,
  EVENTO: CalendarIcon,
};

const typeLabels: Record<string, string> = {
  INICIO_CURSO: "Inicio de Cursos",
  FIN_CURSO: "Fin de Cursos",
  EXAMEN: "Periodo de Exámenes",
  EVENTO: "Evento / Suspensión",
};

const typeColors: Record<string, string> = {
  INICIO_CURSO: "text-blue-600 bg-blue-50 border-blue-200",
  FIN_CURSO: "text-red-600 bg-red-50 border-red-200",
  EXAMEN: "text-yellow-600 bg-yellow-50 border-yellow-200",
  EVENTO: "text-emerald-600 bg-emerald-50 border-emerald-200",
};

export default async function Page() {
  const session = await auth();
  const userRole = session?.user?.role;
  const canManageEvents = userRole === "ADMIN";

  const sedeCondition = await getSedeCondition();
  const events = await db.calendarEvent.findMany({
    orderBy: { startDate: "asc" },
    where: {
      ...sedeCondition,
      type: { not: "CANCELLED" },
      endDate: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)), // Eventos futuros o activos
      },
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <DashboardTopBar title="Calendario Escolar" />

      {canManageEvents ? (
        /* Vista de Administrador: Creación + Listado */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 flex flex-col rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs h-fit">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Nuevo Evento</h2>
            <CalendarForm />
          </div>

          <div className="md:col-span-2 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Próximos Eventos</h2>
                <p className="text-xs text-muted-foreground">Eventos programados para la sede</p>
              </div>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {events.length} {events.length === 1 ? "evento" : "eventos"}
              </span>
            </div>

            {events.length === 0 ? (
              <p className="text-muted-foreground bg-white p-8 border border-slate-200 rounded-2xl text-center text-sm">
                No hay eventos próximos en el calendario.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {events.map((event) => {
                  const Icon = typeIcons[event.type] || CalendarIcon;
                  const colorClass = typeColors[event.type] || typeColors.EVENTO;
                  const label = typeLabels[event.type] || "Evento";

                  return (
                    <div
                      key={event.id}
                      className="p-5 border border-slate-200 rounded-2xl bg-white shadow-2xs flex gap-4 items-start hover:border-slate-300 transition"
                    >
                      <div className={`p-3 rounded-xl border shrink-0 ${colorClass}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${colorClass}`}>
                            {label}
                          </span>
                        </div>
                        <h3 className="font-bold text-base text-slate-900">{event.title}</h3>
                        <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-1">
                          <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                          <span>
                            {event.startDate.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}
                            {event.startDate.getTime() !== event.endDate.getTime() &&
                              ` - ${event.endDate.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}`}
                          </span>
                        </div>
                        {event.description && (
                          <p className="text-xs text-slate-600 mt-2.5 leading-relaxed bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                            {event.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Vista de Profesor / Estudiante: Solo Visualización Limpia */
        <div className="flex flex-col gap-5 max-w-5xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-slate-200/80">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-[#0066cc]" />
                Próximos Eventos y Fechas Clave
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Consulta los periodos escolares, fechas de exámenes, suspensiones oficiales y actividades académicas.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full shrink-0 w-fit">
              {events.length} {events.length === 1 ? "evento programado" : "eventos programados"}
            </span>
          </div>

          {events.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-2xs flex flex-col items-center justify-center">
              <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-[#0066cc] mb-3">
                <CalendarDays className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No hay eventos próximos programados</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                Cuando la dirección académica registre fechas clave o suspensiones, se mostrarán en esta sección.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {events.map((event) => {
                const Icon = typeIcons[event.type] || CalendarIcon;
                const colorClass = typeColors[event.type] || typeColors.EVENTO;
                const label = typeLabels[event.type] || "Evento";

                return (
                  <div
                    key={event.id}
                    className="p-5 border border-slate-200/90 rounded-2xl bg-white shadow-2xs flex flex-col justify-between hover:border-[#0066cc]/40 hover:shadow-xs transition"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${colorClass}`}>
                          {label}
                        </span>
                        <div className={`p-2 rounded-xl border ${colorClass}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                      </div>

                      <h3 className="font-extrabold text-base text-slate-900 leading-snug mb-1.5">
                        {event.title}
                      </h3>

                      <div className="text-xs text-slate-600 font-semibold flex items-center gap-1.5 mb-3">
                        <CalendarDays className="h-3.5 w-3.5 text-[#0066cc]" />
                        <span>
                          {event.startDate.toLocaleDateString("es-ES", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                          {event.startDate.getTime() !== event.endDate.getTime() &&
                            ` al ${event.endDate.toLocaleDateString("es-ES", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}`}
                        </span>
                      </div>

                      {event.description && (
                        <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
