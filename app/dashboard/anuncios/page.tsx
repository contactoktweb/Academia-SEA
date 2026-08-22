import { DashboardTopBar } from "@/components/dashboard/sidebar"
import { AnnouncementForm } from "@/components/dashboard/announcement-form"
import { db } from "@/lib/db"
import { getSedeCondition } from "@/lib/multi-tenancy"

export default async function Page() {
  const sedeCondition = await getSedeCondition();
  const announcements = await db.announcement.findMany({
    where: {
      author: {
        ...sedeCondition,
        deletedAt: null,
      }
    },
    include: { author: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="flex flex-col gap-6">
      <DashboardTopBar title="Tablero de Anuncios" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 flex flex-col rounded-lg border bg-card p-6 shadow-sm h-fit">
          <h2 className="text-xl font-semibold mb-4">Nuevo Anuncio</h2>
          <AnnouncementForm />
        </div>
        
        <div className="md:col-span-2 flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Anuncios Recientes</h2>
          {announcements.length === 0 ? (
            <p className="text-muted-foreground bg-white p-6 border rounded-lg text-center">No hay anuncios publicados.</p>
          ) : (
            announcements.map((ann) => (
              <div key={ann.id} className="p-4 border rounded-lg bg-white shadow-sm flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg">{ann.title}</h3>
                  <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">
                    Audiencia: {ann.audience}
                  </span>
                </div>
                <p className="text-sm text-slate-700 whitespace-pre-wrap">{ann.content}</p>
                <div className="text-xs text-muted-foreground mt-2 border-t pt-2">
                  Publicado por {ann.author.name} el {ann.createdAt.toLocaleDateString()} a las {ann.createdAt.toLocaleTimeString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
