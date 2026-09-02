import { DashboardTopBar } from "@/components/dashboard/sidebar"
import { AccountStatement } from "@/components/dashboard/account-statement"
import { getPaymentMetadata } from "@/app/dashboard/pagos/actions"

export const dynamic = "force-dynamic"

export default async function EstadosCuentaPage() {
  const metadata = await getPaymentMetadata()
  const studentsData = metadata.success && metadata.data?.students ? metadata.data.students.map((s: any) => ({
    id: s.id,
    name: s.name,
    studentProfileId: s.studentProfile?.id || null
  })) : []

  return (
    <div className="flex flex-col gap-6" id="account-statement-print-zone">
      <div className="print:hidden">
        <DashboardTopBar title="Estados de Cuenta" />
      </div>
      
      <AccountStatement students={studentsData} />
    </div>
  )
}
