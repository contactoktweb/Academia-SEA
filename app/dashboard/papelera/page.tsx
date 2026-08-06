import { DashboardTopBar } from "@/components/dashboard/sidebar";
import { getDeletedUsers } from "./actions";
import { PapeleraTable } from "@/components/dashboard/papelera-table";

export const dynamic = "force-dynamic";

export default async function PapeleraPage() {
  const result = await getDeletedUsers();
  const users = result.success ? result.data || [] : [];

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      <DashboardTopBar title="Papelera de Reciclaje" />
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Usuarios Eliminados</h2>
          <p className="text-muted-foreground">
            Restaurar perfiles eliminados o borrarlos de forma permanente del sistema.
          </p>
        </div>
        <PapeleraTable users={users} />
      </div>
    </div>
  );
}
