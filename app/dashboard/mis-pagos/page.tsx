import { DashboardTopBar } from "@/components/dashboard/sidebar";
import { Suspense } from "react";
import { getStudentPaymentSchedule } from "./actions";
import { StudentPaymentsClient } from "@/components/dashboard/student-payments-client";
import { TableLoadingState } from "@/components/dashboard/table-skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MisPagosPage() {
  const result = await getStudentPaymentSchedule();

  return (
    <div className="flex flex-col gap-6">
      <DashboardTopBar title="Mis Pagos e Historial de Mensualidades" />

      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Mis Pagos y Plan de Cuotas
        </h2>
        <p className="text-sm text-muted-foreground">
          Revisa el estado de tus mensualidades, descarga tus comprobantes y paga de forma 100% segura con tarjeta mediante Stripe.
        </p>
      </div>

      <Suspense fallback={<TableLoadingState />}>
        {result.success && result.data ? (
          <StudentPaymentsClient initialData={result.data as any} />
        ) : (
          <Card className="border-red-200 bg-red-50/50 p-6 text-red-900">
            <CardContent className="flex items-center gap-3 p-0">
              <AlertCircle className="h-6 w-6 text-red-600 shrink-0" />
              <div>
                <p className="font-bold text-base">Error al cargar información</p>
                <p className="text-sm text-red-800">
                  {result.error || "No se pudo obtener tu información de pagos. Intenta nuevamente más tarde."}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </Suspense>
    </div>
  );
}
