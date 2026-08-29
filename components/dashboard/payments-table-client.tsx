"use client";

import { useState, useMemo } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CreditCard,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PaymentDialog, SendPaymentLinkDialog, RevertPaymentDialog } from "./payment-dialogs";
import { ReceiptViewerDialog } from "./receipt-viewer-dialog";

interface PaymentsTableClientProps {
  payments: any[];
  concepts?: any[];
  itemsPerPage?: number;
}

export function PaymentsTableClient({
  payments,
  concepts = [],
  itemsPerPage = 10,
}: PaymentsTableClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConcept, setSelectedConcept] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [pageSize, setPageSize] = useState<number>(itemsPerPage);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Lista de conceptos únicos disponibles para filtrar
  const conceptOptions = useMemo(() => {
    const map = new Map<string, string>();
    // 1. Catálogo de conceptos de la base de datos
    concepts.forEach((c: any) => {
      if (c.name) map.set(c.name.trim(), c.id || c.name);
    });
    // 2. Conceptos presentes en los pagos existentes
    payments.forEach((p: any) => {
      const name = p.concept?.name || p.notes;
      if (name && !map.has(name.trim())) {
        map.set(name.trim(), name.trim());
      }
    });
    return Array.from(map.keys()).sort((a, b) => a.localeCompare(b, "es"));
  }, [concepts, payments]);

  // Filtrado reactivo en memoria
  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      // 1. Filtro por buscador (nombre de alumno, email, referencia, notas o concepto)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const studentName = payment.student?.user?.name?.toLowerCase() || "";
        const studentEmail = payment.student?.user?.email?.toLowerCase() || "";
        const reference = payment.reference?.toLowerCase() || "";
        const conceptName = (payment.concept?.name || payment.notes || "").toLowerCase();
        const notes = payment.notes?.toLowerCase() || "";

        const matchesSearch =
          studentName.includes(query) ||
          studentEmail.includes(query) ||
          reference.includes(query) ||
          conceptName.includes(query) ||
          notes.includes(query);

        if (!matchesSearch) return false;
      }

      // 2. Filtro por Concepto
      if (selectedConcept !== "ALL") {
        const currentConceptName = (payment.concept?.name || payment.notes || "").trim().toLowerCase();
        if (currentConceptName !== selectedConcept.trim().toLowerCase()) {
          return false;
        }
      }

      // 3. Filtro por Estado
      if (selectedStatus !== "ALL") {
        if (payment.status !== selectedStatus) {
          return false;
        }
      }

      return true;
    });
  }, [payments, searchQuery, selectedConcept, selectedStatus]);

  // Paginación
  const totalPages = Math.max(1, Math.ceil(filteredPayments.length / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPayments = filteredPayments.slice(startIndex, endIndex);

  // Generador de números de página con elipsis
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (validCurrentPage <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }
    if (validCurrentPage >= totalPages - 3) {
      return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, "...", validCurrentPage - 1, validCurrentPage, validCurrentPage + 1, "...", totalPages];
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedConcept("ALL");
    setSelectedStatus("ALL");
    setCurrentPage(1);
  };

  const hasActiveFilters = searchQuery.trim() !== "" || selectedConcept !== "ALL" || selectedStatus !== "ALL";

  return (
    <Card className="overflow-hidden border-slate-200 shadow-sm">
      <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base font-bold text-slate-900">Registro de Pagos</CardTitle>
            <CardDescription className="text-xs">
              {hasActiveFilters ? (
                <>
                  Mostrando <strong className="text-slate-800">{filteredPayments.length}</strong> de {payments.length} pagos registrados
                </>
              ) : (
                `Todos los pagos y cuotas registradas en el sistema (${payments.length} totales)`
              )}
            </CardDescription>
          </div>

          {/* ─── Buscador y Filtros ─── */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto">
            {/* 1. Buscador */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Buscar alumno, folio..."
                className="pl-8 pr-8 h-9 text-xs bg-white border-slate-200 rounded-lg shadow-2xs"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setCurrentPage(1);
                  }}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* 2. Filtro por Concepto */}
            <div className="w-full sm:w-52">
              <Select
                value={selectedConcept}
                onValueChange={(val) => {
                  setSelectedConcept(val);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-9 text-xs bg-white border-slate-200 rounded-lg shadow-2xs">
                  <span className="truncate text-left block w-full">
                    {selectedConcept === "ALL" ? "Todos los conceptos" : selectedConcept}
                  </span>
                </SelectTrigger>
                <SelectContent className="max-h-64 max-w-[300px]">
                  <SelectItem value="ALL" className="text-xs font-semibold text-slate-900">
                    Todos los conceptos ({payments.length})
                  </SelectItem>
                  {conceptOptions.map((conceptName) => {
                    const count = payments.filter((p: any) => (p.concept?.name || p.notes || "").trim() === conceptName).length;
                    return (
                      <SelectItem key={conceptName} value={conceptName} className="text-xs">
                        <div className="flex items-center justify-between gap-2 w-full">
                          <span className="truncate">{conceptName}</span>
                          <span className="text-[11px] text-slate-400 font-mono shrink-0">({count})</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* 3. Filtro por Estado */}
            <div className="w-full sm:w-36">
              <Select
                value={selectedStatus}
                onValueChange={(val) => {
                  setSelectedStatus(val);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-9 text-xs bg-white border-slate-200 rounded-lg shadow-2xs">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL" className="text-xs">Todos los estados</SelectItem>
                  <SelectItem value="PAID" className="text-xs font-medium text-emerald-700">Pagados</SelectItem>
                  <SelectItem value="PENDING" className="text-xs font-medium text-amber-700">Pendientes</SelectItem>
                  <SelectItem value="OVERDUE" className="text-xs font-medium text-red-700">Vencidos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 4. Botón Limpiar Filtros */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="h-9 px-2.5 text-xs text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg shrink-0"
                title="Limpiar filtros de búsqueda"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1 text-slate-400" />
                Limpiar
              </Button>
            )}
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
              {filteredPayments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-36 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 py-4">
                      <Search className="h-8 w-8 text-slate-300" />
                      <p className="text-sm font-semibold text-slate-700">
                        {hasActiveFilters
                          ? "No se encontraron pagos con los filtros seleccionados."
                          : "No hay pagos registrados aún."}
                      </p>
                      {hasActiveFilters && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleClearFilters}
                          className="mt-1 text-xs"
                        >
                          Restablecer búsqueda y filtros
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                currentPayments.map((payment: any) => {
                  const isPaid = payment.status === "PAID";

                  const isAssistedStripe =
                    payment.notes?.includes("[ASISTIDO_STRIPE]") ||
                    payment.notes?.includes("asistido") ||
                    payment.notes?.includes("Asistido");
                  const isPortalStripe =
                    payment.notes?.includes("[PORTAL_ALUMNO]") ||
                    payment.notes?.includes("mensualidad");
                  const isStripe =
                    payment.method === "ONLINE" ||
                    payment.reference?.startsWith("pi_") ||
                    payment.reference?.startsWith("cs_");

                  return (
                    <TableRow key={payment.id} className="hover:bg-slate-50/80 transition-colors">
                      <TableCell className="font-semibold text-slate-900 whitespace-nowrap">
                        {payment.student?.user?.name || "Estudiante"}
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

        {/* ─── Paginador y Selector de Página ─── */}
        {filteredPayments.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <div>
                Mostrando <span className="font-semibold text-slate-800">{startIndex + 1}</span> a{" "}
                <span className="font-semibold text-slate-800">{Math.min(endIndex, filteredPayments.length)}</span> de{" "}
                <span className="font-semibold text-slate-800">{filteredPayments.length}</span> pagos
              </div>

              {/* Selector de registros por página */}
              <div className="hidden sm:flex items-center gap-1.5 ml-2">
                <span className="text-slate-400">Ver:</span>
                <Select
                  value={String(pageSize)}
                  onValueChange={(val) => {
                    setPageSize(Number(val));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="h-7 w-16 text-xs bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10" className="text-xs">10</SelectItem>
                    <SelectItem value="25" className="text-xs">25</SelectItem>
                    <SelectItem value="50" className="text-xs">50</SelectItem>
                    <SelectItem value="100" className="text-xs">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                {/* Primera página */}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 text-xs"
                  onClick={() => setCurrentPage(1)}
                  disabled={validCurrentPage === 1}
                  title="Primera página"
                >
                  <ChevronsLeft className="h-3.5 w-3.5" />
                </Button>

                {/* Anterior */}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 text-xs"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={validCurrentPage === 1}
                  title="Página anterior"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>

                {/* Números de página */}
                <div className="flex items-center gap-1 px-0.5">
                  {getPageNumbers().map((page, idx) =>
                    page === "..." ? (
                      <span key={`ellipsis-${idx}`} className="px-1 text-xs text-slate-400">
                        ...
                      </span>
                    ) : (
                      <Button
                        key={`page-${page}`}
                        variant={validCurrentPage === page ? "default" : "outline"}
                        size="sm"
                        className={cn(
                          "h-8 min-w-8 px-2 text-xs font-semibold",
                          validCurrentPage === page
                            ? "bg-[#0066cc] text-white hover:bg-[#0055aa]"
                            : "hover:bg-slate-100"
                        )}
                        onClick={() => setCurrentPage(Number(page))}
                      >
                        {page}
                      </Button>
                    )
                  )}
                </div>

                {/* Siguiente */}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 text-xs"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={validCurrentPage === totalPages}
                  title="Página siguiente"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>

                {/* Última página */}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 text-xs"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={validCurrentPage === totalPages}
                  title="Última página"
                >
                  <ChevronsRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
