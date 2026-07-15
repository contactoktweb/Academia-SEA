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
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit2, Check, CreditCard, Clock, AlertCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import { PaymentDialog } from "./payment-dialogs";

export async function PaymentsTable() {
  const sedeCondition = await getSedeCondition();
  const rawPayments = await db.payment.findMany({
    where: sedeCondition,
    include: {
      student: { include: { user: true } },
      concept: true,
      cycle: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // Serialize Decimal objects for Client Components
  const payments = rawPayments.map(payment => ({
    ...payment,
    amount: Number(payment.amount),
    amountPaid: payment.amountPaid ? Number(payment.amountPaid) : null,
    concept: payment.concept ? {
      ...payment.concept,
      amount: Number(payment.concept.amount),
    } : null,
  })) as any;

  const paidCount = payments.filter((p) => p.status === "PAID").length;
  const pendingCount = payments.filter((p) => p.status === "PENDING").length;
  const totalAmount = payments.reduce((sum, p) => sum + parseFloat(String(p.amount)), 0);
  const paidAmount = payments.filter((p) => p.status === "PAID").reduce((sum, p) => sum + parseFloat(String(p.amountPaid || 0)), 0);

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

      <div className="flex justify-between items-center mt-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Pagos</h2>
          <p className="text-muted-foreground">
            Registra y administra los pagos de estudiantes.
          </p>
        </div>
        <PaymentDialog mode="add" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registro de Pagos</CardTitle>
          <CardDescription>Todos los pagos registrados en el sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Estudiante</TableHead>
                <TableHead>Concepto</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Vencimiento</TableHead>
                <TableHead>Recibido</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No hay pagos registrados aún.
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">
                      {payment.student.user.name}
                    </TableCell>
                    <TableCell>{payment.concept?.name || "N/A"}</TableCell>
                    <TableCell className="font-mono">
                      ${parseFloat(String(payment.amount)).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {payment.method === "CASH"
                          ? "Efectivo"
                          : payment.method === "BANK_TRANSFER"
                          ? "Transferencia"
                          : payment.method === "CARD"
                          ? "Tarjeta"
                          : "Otro"}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">
                      {payment.dueDate.toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-mono">
                      {payment.paidAt
                        ? `$${parseFloat(String(payment.amountPaid || 0)).toFixed(2)}`
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${
                          payment.status === "PAID"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : payment.status === "OVERDUE"
                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        }`}
                      >
                        {payment.status === "PAID"
                          ? "Pagado"
                          : payment.status === "OVERDUE"
                          ? "Vencido"
                          : "Pendiente"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {payment.status === "PENDING" && (
                          <PaymentDialog mode="record" payment={payment} />
                        )}
                        <PaymentDialog mode="delete" payment={payment} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
