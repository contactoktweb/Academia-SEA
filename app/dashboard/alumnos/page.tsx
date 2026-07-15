import { DashboardTopBar } from "@/components/dashboard/sidebar";
import { Suspense } from "react";
import { StudentsTable } from "@/components/dashboard/students-table";
import { TableLoadingState } from "@/components/dashboard/table-skeleton";
import { SearchInput } from "@/components/dashboard/search-input";
import { StudentDialog } from "@/components/dashboard/student-dialogs";

export const dynamic = "force-dynamic";

export default async function AlumnosPage(props: { searchParams: Promise<{ query?: string }> }) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";

  return (
    <div className="flex flex-col gap-6">
      <DashboardTopBar title="Directorio de Alumnos" />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Alumnos</h2>
          <p className="text-muted-foreground">
            Administra los datos y matrícula de estudiantes.
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <SearchInput placeholder="Buscar por nombre o correo..." />
          <StudentDialog mode="add" />
        </div>
      </div>

      <Suspense fallback={<TableLoadingState />} key={query}>
        <StudentsTable query={query} />
      </Suspense>
    </div>
  );
}
