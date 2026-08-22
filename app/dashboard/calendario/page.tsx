import { DashboardTopBar } from "@/components/dashboard/sidebar"
import { CalendarForm } from "@/components/dashboard/calendar-form"
import { db } from "@/lib/db"
import { Calendar as CalendarIcon, Clock, BookOpen, Flag } from "lucide-react"
import { getSedeCondition } from "@/lib/multi-tenancy"

const typeIcons: Record<string, any> = {
  INICIO_CURSO: BookOpen,
  FIN_CURSO: Flag,
  EXAMEN: Clock,
  EVENTO: CalendarIcon
};

const typeColors: Record<string, string> = {
  INICIO_CURSO: "text-blue-600 bg-blue-50",
  FIN_CURSO: "text-red-600 bg-red-50",
  EXAMEN: "text-yellow-600 bg-yellow-50",
  EVENTO: "text-green-600 bg-green-50",
};

export default async function Page() {
  const sedeCondition = await getSedeCondition();
  const events = await db.calendarEvent.findMany({
    orderBy: { startDate: "asc" },
    where: {
      ...sedeCondition,
      type: { not: "CANCELLED" },
      endDate: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)) // Eventos futuros o activos
      }
    }
  });

  return (
    <div className="flex flex-col gap-6">
      <DashboardTopBar title="Calendario Escolar" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 flex flex-col rounded-lg border bg-card p-6 shadow-sm h-fit">
          <h2 className="text-xl font-semibold mb-4">Nuevo Evento</h2>
          <CalendarForm />
        </div>
        
        <div className="md:col-span-2 flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Próximos Eventos</h2>
          {events.length === 0 ? (
            <p className="text-muted-foreground bg-white p-6 border rounded-lg text-center">No hay eventos próximos en el calendario.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {events.map((event) => {
                const Icon = typeIcons[event.type] || CalendarIcon;
                const colorClass = typeColors[event.type] || typeColors.EVENTO;
                
                return (
                  <div key={event.id} className="p-4 border rounded-lg bg-white shadow-sm flex gap-4 items-start">
                    <div className={`p-3 rounded-full ${colorClass}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{event.title}</h3>
                      <div className="text-sm text-slate-600 font-medium">
                        {event.startDate.toLocaleDateString()} {event.startDate.getTime() !== event.endDate.getTime() && `- ${event.endDate.toLocaleDateString()}`}
                      </div>
                      {event.description && (
                        <p className="text-sm text-slate-700 mt-2">{event.description}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
