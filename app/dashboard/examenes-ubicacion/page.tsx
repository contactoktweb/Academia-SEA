import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { DashboardTopBar } from "@/components/dashboard/sidebar";
import { PlacementTestsTable } from "./placement-tests-table";

export const metadata = {
  title: "Exámenes de Ubicación | Academia SEA",
  description: "Gestión de resultados de exámenes de ubicación",
};

export default async function PlacementTestsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const userRole = (session.user as any).role;
  const userSede = (session.user as any).sede;

  // Only Admin should see this by default, but let's allow TEACHER too if desired.
  // For now, allow both, but filter by sede if not super admin.
  if (userRole !== "ADMIN" && userRole !== "TEACHER") {
    redirect("/dashboard");
  }

  // Fetch all placement tests
  const tests = await db.placementTest.findMany({
    orderBy: { createdAt: "desc" },
    // If we wanted to filter by sede for teachers:
    // ...(userRole !== "ADMIN" ? { where: { sede: userSede } } : {})
  });

  return (
    <div className="flex flex-col gap-6">
      <DashboardTopBar title="Exámenes de Ubicación" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-heading">Resultados de Exámenes</h2>
          <p className="text-sm text-slate-500 mt-1">
            Visualiza los resultados del examen de ubicación para contactar a los prospectos.
          </p>
        </div>
      </div>

      <PlacementTestsTable initialData={tests} />
    </div>
  );
}
