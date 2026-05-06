import { DashboardTopBar } from "@/components/dashboard/sidebar"

export default function Page() {
  return (
    <div className="flex flex-col gap-6">
      <DashboardTopBar title="Mensajería Interna" />
      <div className="flex flex-col rounded-lg border bg-card p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Mensajería Interna</h2>
        <p className="text-muted-foreground">Esta sección está lista para su desarrollo.</p>
      </div>
    </div>
  )
}
