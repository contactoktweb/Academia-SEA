import { db } from "@/lib/db";
import { getSedeCondition } from "@/lib/multi-tenancy";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, CreditCard, Clock, AlertCircle } from "lucide-react";
import { PaymentsHeaderActions } from "./payments-header-actions";
import { PaymentsTableClient } from "./payments-table-client";

export async function PaymentsTable() {
  const sedeCondition = await getSedeCondition();
  const [rawPayments, rawConcepts] = await Promise.all([
    db.payment.findMany({
      where: {
        ...sedeCondition,
        status: { not: "CANCELLED" },
      },
      include: {
        student: { include: { user: true } },
        concept: true,
        cycle: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    db.chargeConcept.findMany({
      where: { isActive: true, ...sedeCondition },
      orderBy: { name: "asc" },
    }),
  ]);

  // Serialize Decimal objects for Client Components
  const payments: any[] = rawPayments.map(payment => ({
    ...payment,
    amount: Number(payment.amount),
    amountPaid: payment.amountPaid ? Number(payment.amountPaid) : null,
    concept: payment.concept ? {
      ...payment.concept,
      amount: Number(payment.concept.amount),
    } : null,
  }));

  const concepts: any[] = rawConcepts.map(concept => ({
    ...concept,
    amount: Number(concept.amount),
  }));

  const paidCount = payments.filter((p: any) => p.status === "PAID").length;
  const pendingCount = payments.filter((p: any) => ["PENDING", "OVERDUE"].includes(p.status)).length;
  const totalAmount = payments.reduce((sum: number, p: any) => sum + parseFloat(String(p.amount)), 0);
  const paidAmount = payments.filter((p: any) => p.status === "PAID").reduce((sum: number, p: any) => sum + parseFloat(String(p.amountPaid || p.amount || 0)), 0);

  return (
    <>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Total Adeudado</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{payments.length} pagos registrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Recaudado</CardTitle>
            <Check className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${paidAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{paidCount} completados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Pendiente</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${(totalAmount - paidAmount).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">{pendingCount} por cobrar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">% Cobranza</CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalAmount > 0 ? ((paidAmount / totalAmount) * 100).toFixed(0) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Eficiencia de cobro</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Gestión y Registro de Pagos</h2>
          <p className="text-sm text-muted-foreground">
            Envía enlaces de Stripe asistidos a alumnos, registra pagos o revierte transacciones.
          </p>
        </div>
        <PaymentsHeaderActions />
      </div>

      {/* Tabla interactiva con buscador, filtro por concepto y paginador */}
      <PaymentsTableClient payments={payments} concepts={concepts} />
    </>
  );
}
