"use client";

import { useState, useTransition, useEffect } from "react";
import { getStudentAccountStatement } from "@/app/dashboard/estados-cuenta/actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Loader2, Printer, CreditCard, DollarSign, Calendar } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

interface AccountStatementProps {
  students: {
    id: string;
    name: string;
    studentProfileId: string | null;
  }[];
}

export function AccountStatement({ students }: AccountStatementProps) {
  const [open, setOpen] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [statement, setStatement] = useState<any>(null);
  const [isPending, startTransition] = useTransition();

  // Load statement when student changes
  useEffect(() => {
    if (!selectedProfileId) {
      setStatement(null);
      return;
    }

    startTransition(async () => {
      const res = await getStudentAccountStatement(selectedProfileId);
      if (res.success) {
        setStatement(res.data);
      } else {
        toast.error(res.error || "Error al cargar estado de cuenta");
        setStatement(null);
      }
    });
  }, [selectedProfileId]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Selector de Estudiante (Oculto al imprimir) */}
      <div className="print:hidden">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Buscar Estudiante</CardTitle>
            <CardDescription>Selecciona un alumno para ver su historial financiero y deudas.</CardDescription>
          </CardHeader>
          <CardContent>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full md:w-[400px] justify-between"
                >
                  {selectedProfileId
                    ? students.find((s) => s.studentProfileId === selectedProfileId)?.name
                    : "Buscar alumno..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full md:w-[400px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Escribe un nombre..." />
                  <CommandList>
                    <CommandEmpty>No se encontraron alumnos.</CommandEmpty>
                    <CommandGroup>
                      {students.map((student) => (
                        <CommandItem
                          key={student.id}
                          value={student.name}
                          onSelect={() => {
                            if (student.studentProfileId) {
                              setSelectedProfileId(student.studentProfileId);
                            }
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedProfileId === student.studentProfileId ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {student.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </CardContent>
        </Card>
      </div>

      {isPending && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {!isPending && statement && (
        <div className="space-y-6 print:space-y-4 print:p-0">
          
          {/* Cabecera del Reporte */}
          <div className="flex justify-between items-start print:items-center">
            <div>
              <h2 className="text-2xl font-bold">Estado de Cuenta</h2>
              <p className="text-muted-foreground">{statement.student.name}</p>
              {statement.student.enrollment && (
                <p className="text-sm text-slate-500">
                  {statement.student.enrollment.course.name} - {statement.student.enrollment.group.name}
                </p>
              )}
            </div>
            <Button onClick={handlePrint} className="print:hidden" variant="outline">
              <Printer className="mr-2 h-4 w-4" />
              Imprimir / PDF
            </Button>
          </div>

          {/* Tarjetas de Resumen */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-slate-50/50 dark:bg-slate-900/50">
                <CardTitle className="text-sm font-medium">Deuda Total Pendiente</CardTitle>
                <DollarSign className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-red-600">${statement.summary.totalDebt.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Monto a liquidar</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-slate-50/50 dark:bg-slate-900/50">
                <CardTitle className="text-sm font-medium">Total Pagado (Histórico)</CardTitle>
                <CreditCard className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-green-600">${statement.summary.totalPaid.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Abonos exitosos</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-slate-50/50 dark:bg-slate-900/50">
                <CardTitle className="text-sm font-medium">Planes Activos</CardTitle>
                <Calendar className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">{statement.activePlans.length}</div>
                <p className="text-xs text-muted-foreground">Compromisos vigentes</p>
              </CardContent>
            </Card>
          </div>

          {/* Pagos Pendientes */}
          <Card className="border-red-100 dark:border-red-900/30">
            <CardHeader className="bg-red-50/50 dark:bg-red-900/10 pb-4">
              <CardTitle className="text-red-700 dark:text-red-400 flex items-center">
                Cargos Pendientes y Vencidos
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Concepto</TableHead>
                    <TableHead>Vencimiento</TableHead>
                    <TableHead>Monto Total</TableHead>
                    <TableHead>Abonado</TableHead>
                    <TableHead>Restante</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {statement.pendingPayments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center h-12 text-muted-foreground">
                        No hay deudas pendientes. ¡Al día!
                      </TableCell>
                    </TableRow>
                  ) : (
                    statement.pendingPayments.map((p: any) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.concept?.name || "Cobro"}</TableCell>
                        <TableCell>{new Date(p.dueDate).toLocaleDateString()}</TableCell>
                        <TableCell>${p.amount.toFixed(2)}</TableCell>
                        <TableCell>${(p.amountPaid || 0).toFixed(2)}</TableCell>
                        <TableCell className="font-bold text-red-600">${(p.amount - (p.amountPaid || 0)).toFixed(2)}</TableCell>
                        <TableCell>
                          <span className={`text-xs px-2 py-1 rounded-full ${p.status === "OVERDUE" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                            {p.status === "OVERDUE" ? "Vencido" : "Pendiente"}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Historial de Pagos Completados */}
          <Card>
            <CardHeader>
              <CardTitle>Historial de Pagos Completados</CardTitle>
              <CardDescription>Últimos pagos realizados por el alumno.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha de Pago</TableHead>
                    <TableHead>Concepto</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead>Referencia</TableHead>
                    <TableHead className="text-right">Monto Pagado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {statement.paidPayments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center h-12 text-muted-foreground">
                        No se han registrado pagos aún.
                      </TableCell>
                    </TableRow>
                  ) : (
                    statement.paidPayments.map((p: any) => (
                      <TableRow key={p.id}>
                        <TableCell>{p.paidAt ? new Date(p.paidAt).toLocaleDateString() : "-"}</TableCell>
                        <TableCell>{p.concept?.name || "Cobro"}</TableCell>
                        <TableCell>
                          {p.method === "CASH" ? "Efectivo" : p.method === "BANK_TRANSFER" ? "Transferencia" : p.method === "CARD" ? "Tarjeta" : "Otro"}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs">{p.reference || "-"}</TableCell>
                        <TableCell className="text-right font-medium text-green-600">${p.amountPaid?.toFixed(2) || p.amount.toFixed(2)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

        </div>
      )}
      
      {/* Estilos CSS Globales para impresión */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #account-statement-print-zone, #account-statement-print-zone * {
            visibility: visible;
          }
          #account-statement-print-zone {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}} />
    </div>
  );
}
