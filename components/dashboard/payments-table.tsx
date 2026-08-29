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

  // 1. Estadísticas agregadas + Catálogo de conceptos + Primera página (10 registros)
  const [statsSummary, rawConcepts, initialCount, initialRawPayments] = await Promise.all([
    db.payment.groupBy({
      by: ["status"],
      where: {
        ...sedeCondition,
        status: { not: "CANCELLED" },
      },
      _sum: {
        amount: true,
        amountPaid: true,
      },
      _count: {
        id: true,
      },
    }),
    db.chargeConcept.findMany({
      where: { isActive: true, ...sedeCondition },
      orderBy: { name: "asc" },
    }),
    db.payment.count({
      where: {
        ...sedeCondition,
        status: { not: "CANCELLED" },
      },
    }),
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
      take: 10,
    }),
  ]);

  let totalAmount = 0;
  let paidAmount = 0;
  let paidCount = 0;
  let pendingCount = 0;

  statsSummary.forEach((stat) => {
    const amt = Number(stat._sum.amount || 0);
    const paidAmt = Number(stat._sum.amountPaid || 0);
    totalAmount += amt;
    if (stat.status === "PAID") {
      paidAmount += paidAmt > 0 ? paidAmt : amt;
      paidCount += stat._count.id;
    } else {
      pendingCount += stat._count.id;
    }
  });

  // Serializar Decimales para Client Components
  const initialPayments: any[] = initialRawPayments.map((payment) => ({
    ...payment,
    amount: Number(payment.amount),
    amountPaid: payment.amountPaid ? Number(payment.amountPaid) : null,
    concept: payment.concept
      ? {
          ...payment.concept,
          amount: Number(payment.concept.amount),
        }
      : null,
  }));

  const concepts: any[] = rawConcepts.map((concept) => ({
    ...concept,
    amount: Number(concept.amount),
  }));

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
            <p className="text-xs text-muted-foreground">{initialCount} pagos registrados</p>
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

      {/* Tabla asíncrona con carga paginada bajo demanda desde el servidor */}
      <PaymentsTableClient
        initialPayments={initialPayments}
        initialTotalCount={initialCount}
        concepts={concepts}
        totalRegistered={initialCount}
      />
    </>
  );
}
