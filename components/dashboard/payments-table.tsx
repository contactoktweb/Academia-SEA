import { db } from "@/lib/db";
import { getSedeCondition } from "@/lib/multi-tenancy";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, CreditCard, Clock, AlertCircle } from "lucide-react";
import { PaymentDialog, SendPaymentLinkDialog, RevertPaymentDialog } from "./payment-dialogs";
import { PaymentsHeaderActions } from "./payments-header-actions";
import { ReceiptViewerDialog } from "./receipt-viewer-dialog";

export async function PaymentsTable() {
  const sedeCondition = await getSedeCondition();
  const rawPayments = await db.payment.findMany({
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
  });

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

      <Card className="overflow-hidden border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-900">Registro de Pagos</CardTitle>
              <CardDescription className="text-xs">Todos los pagos y cuotas registradas en el sistema</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/70 hover:bg-slate-50/70">
                  <TableHead className="font-bold text-slate-700">Estudiante</TableHead>
                  <TableHead className="font-bold text-slate-700">Concepto</TableHead>
                  <TableHead className="font-bold text-slate-700">Monto</TableHead>
                  <TableHead className="font-bold text-slate-700">Método</TableHead>
                  <TableHead className="font-bold text-slate-700">Vencimiento</TableHead>
                  <TableHead className="font-bold text-slate-700">Recibido / Pagado</TableHead>
                  <TableHead className="text-center font-bold text-slate-700">Comprobante</TableHead>
                  <TableHead className="font-bold text-slate-700">Estado</TableHead>
                  <TableHead className="text-right font-bold text-slate-700 pr-4">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                      No hay pagos registrados aún.
                    </TableCell>
                  </TableRow>
                ) : (
                  payments.map((payment: any) => {
                    const isPaid = payment.status === "PAID";
                    
                    const isAssistedStripe =
                      payment.notes?.includes("[ASISTIDO_STRIPE]") ||
                      payment.notes?.includes("asistido") ||
                      payment.notes?.includes("Asistido");
                    const isPortalStripe =
                      payment.notes?.includes("[PORTAL_ALUMNO]") ||
                      payment.notes?.includes("mensualidad");
                    const isStripe = payment.method === "ONLINE" || payment.reference?.startsWith("pi_") || payment.reference?.startsWith("cs_");

                    return (
                      <TableRow key={payment.id} className="hover:bg-slate-50/80 transition-colors">
                        <TableCell className="font-semibold text-slate-900 whitespace-nowrap">
                          {payment.student?.user?.name}
                        </TableCell>
                        <TableCell className="max-w-[180px] truncate text-slate-700" title={payment.concept?.name || payment.notes || "Colegiatura"}>
                          {payment.concept?.name || payment.notes || "Colegiatura"}
                        </TableCell>
                        <TableCell className="font-mono font-bold text-slate-900 whitespace-nowrap">
                          ${parseFloat(String(payment.amount)).toFixed(2)}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {isAssistedStripe ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-100/90 text-[#0066cc]" title="Pagado mediante enlace asistido de Stripe">
                              <CreditCard className="h-3 w-3" />
                              Stripe (Asistido)
                            </span>
                          ) : isPortalStripe || isStripe ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100/90 text-indigo-700" title="Pagado por el alumno desde su portal">
                              <CreditCard className="h-3 w-3" />
                              Stripe (Portal Alumno)
                            </span>
                          ) : payment.method === "CASH" ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                              Efectivo (Manual)
                            </span>
                          ) : payment.method === "BANK_TRANSFER" ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-purple-50 text-purple-800 border border-purple-200">
                              Transferencia (Manual)
                            </span>
                          ) : payment.method === "CARD" ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-cyan-50 text-cyan-800 border border-cyan-200">
                              Tarjeta / Terminal
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700">
                              Manual
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-slate-600 whitespace-nowrap">
                          {new Date(payment.dueDate).toLocaleDateString("es-MX")}
                        </TableCell>
                        <TableCell className="font-mono text-xs whitespace-nowrap">
                          {payment.paidAt ? (
                            <div className="flex flex-col">
                              <span className="font-bold text-emerald-700">
                                ${parseFloat(String(payment.amountPaid || payment.amount)).toFixed(2)}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {new Date(payment.paidAt).toLocaleDateString("es-MX")}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <ReceiptViewerDialog payment={payment} />
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                              isPaid
                                ? "bg-emerald-100 text-emerald-800"
                                : payment.status === "OVERDUE"
                                ? "bg-red-100 text-red-700"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {isPaid ? "Pagado" : payment.status === "OVERDUE" ? "Vencido" : "Pendiente"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right pr-4 whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            {!isPaid ? (
                              <>
                                {/* 1. Enviar Link Asistido por Stripe / WhatsApp */}
                                <SendPaymentLinkDialog payment={payment} />

                                {/* 2. Marcar como Pagado / Registrar Comprobante */}
                                <PaymentDialog mode="record" payment={payment} />

                                {/* 3. Eliminar Cobro Pendiente */}
                                <PaymentDialog mode="delete" payment={payment} />
                              </>
                            ) : (
                              /* 4. Revertir Pago para el Administrador (Motivo Obligatorio) */
                              <RevertPaymentDialog payment={payment} />
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
