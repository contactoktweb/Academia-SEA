"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
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
  Calendar,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PaymentDialog, SendPaymentLinkDialog, RevertPaymentDialog, EditDueDateDialog } from "./payment-dialogs";
import { ReceiptViewerDialog } from "./receipt-viewer-dialog";
import { getPaginatedPaymentsAction } from "@/app/dashboard/pagos/actions";

interface PaymentsTableClientProps {
  initialPayments?: any[];
  initialTotalCount?: number;
  concepts?: any[];
  totalRegistered?: number;
  itemsPerPage?: number;
}

function formatYMD(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function PaymentsTableClient({
  initialPayments = [],
  initialTotalCount = 0,
  concepts = [],
  totalRegistered = 0,
  itemsPerPage = 10,
}: PaymentsTableClientProps) {
  const [payments, setPayments] = useState<any[]>(initialPayments);
  const [totalCount, setTotalCount] = useState<number>(initialTotalCount);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConcept, setSelectedConcept] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [datePreset, setDatePreset] = useState<string>("ALL");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(itemsPerPage);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const isInitialRender = useRef(true);

  // Lista de conceptos únicos disponibles
  const conceptOptions = useMemo(() => {
    const map = new Map<string, string>();
    concepts.forEach((c: any) => {
      if (c.name) map.set(c.name.trim(), c.id || c.name);
    });
    return Array.from(map.keys()).sort((a, b) => a.localeCompare(b, "es"));
  }, [concepts]);

  // Carga asíncrona de pagos desde el servidor
  const loadPayments = useCallback(
    async (params: {
      page: number;
      pageSize: number;
      search: string;
      concept: string;
      status: string;
      startDate: string;
      endDate: string;
    }) => {
      setIsLoading(true);
      try {
        const res = await getPaginatedPaymentsAction(params);
        if (res.success && res.data) {
          setPayments(res.data.payments);
          setTotalCount(res.data.totalCount);
        }
      } catch (error) {
        console.error("Error al cargar pagos asíncronamente:", error);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Efecto reactivo con debounce para búsquedas y filtros
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      loadPayments({
        page: currentPage,
        pageSize,
        search: searchQuery,
        concept: selectedConcept,
        status: selectedStatus,
        startDate,
        endDate,
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [currentPage, pageSize, searchQuery, selectedConcept, selectedStatus, startDate, endDate, loadPayments]);

  // Manejador de rangos rápidos de fecha
  const applyDatePreset = (preset: string) => {
    setDatePreset(preset);
    const now = new Date();
    if (preset === "ALL") {
      setStartDate("");
      setEndDate("");
    } else if (preset === "TODAY") {
      const todayStr = formatYMD(now);
      setStartDate(todayStr);
      setEndDate(todayStr);
    } else if (preset === "THIS_WEEK") {
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(now);
      monday.setDate(diff);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      setStartDate(formatYMD(monday));
      setEndDate(formatYMD(sunday));
    } else if (preset === "THIS_MONTH") {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      setStartDate(formatYMD(firstDay));
      setEndDate(formatYMD(lastDay));
    } else if (preset === "LAST_MONTH") {
      const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth(), 0);
      setStartDate(formatYMD(firstDay));
      setEndDate(formatYMD(lastDay));
    } else if (preset === "THIS_YEAR") {
      const firstDay = new Date(now.getFullYear(), 0, 1);
      const lastDay = new Date(now.getFullYear(), 11, 31);
      setStartDate(formatYMD(firstDay));
      setEndDate(formatYMD(lastDay));
    }
  };

  // Paginación
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = totalCount > 0 ? (validCurrentPage - 1) * pageSize : 0;
  const endIndex = Math.min(startIndex + pageSize, totalCount);

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
    setDatePreset("ALL");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedConcept !== "ALL" ||
    selectedStatus !== "ALL" ||
    datePreset !== "ALL" ||
    startDate !== "" ||
    endDate !== "";

  return (
    <Card className="overflow-hidden border-slate-200 shadow-sm">
      <CardHeader className="bg-slate-50/60 border-b border-slate-100 p-3 sm:p-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center gap-2.5 w-full">
          {/* 1. Buscador Asíncrono */}
          <div className="relative flex-1 min-w-[180px]">
            {isLoading ? (
              <Loader2 className="absolute left-2.5 top-2.5 h-4 w-4 text-[#0066cc] animate-spin" />
            ) : (
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            )}
            <Input
              type="text"
              placeholder="Buscar alumno, folio, concepto..."
              className="pl-8 pr-8 h-9 text-xs bg-white border-slate-200 rounded-lg shadow-2xs w-full"
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

          {/* Grupo de Filtros (Uno al lado del otro en pantallas no móviles) */}
          <div className="flex flex-col sm:flex-row flex-wrap lg:flex-nowrap items-stretch sm:items-center gap-2">
            {/* 2. Filtro por Concepto */}
            <div className="w-full sm:w-[170px] shrink-0">
              <Select
                value={selectedConcept}
                onValueChange={(val) => {
                  setSelectedConcept(val);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-9 text-xs bg-white border-slate-200 rounded-lg shadow-2xs w-full">
                  <span className="truncate text-left block w-full">
                    {selectedConcept === "ALL" ? "Todos los conceptos" : selectedConcept}
                  </span>
                </SelectTrigger>
                <SelectContent className="max-h-64 max-w-[300px]">
                  <SelectItem value="ALL" className="text-xs font-semibold text-slate-900">
                    Todos los conceptos
                  </SelectItem>
                  {conceptOptions.map((conceptName) => (
                    <SelectItem key={conceptName} value={conceptName} className="text-xs">
                      <span className="truncate">{conceptName}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 3. Filtro por Estado */}
            <div className="w-full sm:w-[130px] shrink-0">
              <Select
                value={selectedStatus}
                onValueChange={(val) => {
                  setSelectedStatus(val);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-9 text-xs bg-white border-slate-200 rounded-lg shadow-2xs w-full">
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

            {/* 4. Filtro por Período / Fecha */}
            <div className="w-full sm:w-[150px] shrink-0">
              <Select
                value={datePreset}
                onValueChange={(val) => {
                  applyDatePreset(val);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-9 text-xs bg-white border-slate-200 rounded-lg shadow-2xs w-full">
                  <Calendar className="h-3.5 w-3.5 mr-1.5 text-slate-400 shrink-0" />
                  <SelectValue placeholder="Filtrar por fecha" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL" className="text-xs">Todas las fechas</SelectItem>
                  <SelectItem value="TODAY" className="text-xs">Hoy</SelectItem>
                  <SelectItem value="THIS_WEEK" className="text-xs">Esta semana</SelectItem>
                  <SelectItem value="THIS_MONTH" className="text-xs">Este mes</SelectItem>
                  <SelectItem value="LAST_MONTH" className="text-xs">Mes anterior</SelectItem>
                  <SelectItem value="THIS_YEAR" className="text-xs">Este año ({new Date().getFullYear()})</SelectItem>
                  <SelectItem value="CUSTOM" className="text-xs font-semibold text-[#0066cc]">Rango personalizado...</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 5. Inputs de Rango de Fechas (Del / Al) */}
            {(datePreset === "CUSTOM" || startDate || endDate) && (
              <div className="flex items-center gap-1.5 bg-slate-100/90 p-1 rounded-lg border border-slate-200/80 shrink-0 w-full sm:w-auto">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-bold text-slate-500 pl-1">Del:</span>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      setDatePreset("CUSTOM");
                      setCurrentPage(1);
                    }}
                    className="h-7 w-[115px] text-[11px] bg-white border-slate-200 px-1.5 py-0"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-bold text-slate-500">Al:</span>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      setDatePreset("CUSTOM");
                      setCurrentPage(1);
                    }}
                    className="h-7 w-[115px] text-[11px] bg-white border-slate-200 px-1.5 py-0"
                  />
                </div>
              </div>
            )}

            {/* 6. Botón Limpiar Filtros */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="h-9 px-2.5 text-xs text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg shrink-0 w-full sm:w-auto justify-center"
                title="Limpiar todos los filtros"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1 text-slate-400" />
                Limpiar
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 relative">
        {/* Indicador de carga asíncrona sutil */}
        {isLoading && (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#0066cc] animate-pulse z-10" />
        )}

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
            <TableBody className={cn(isLoading && "opacity-60 transition-opacity duration-200")}>
              {payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-36 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 py-4">
                      {isLoading ? (
                        <>
                          <Loader2 className="h-8 w-8 text-[#0066cc] animate-spin" />
                          <p className="text-sm font-semibold text-slate-700">Cargando pagos...</p>
                        </>
                      ) : (
                        <>
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
                        </>
                      )}
                    </div>
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
                        {!isPaid ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-500 border border-slate-200">
                            Sin pagar
                          </span>
                        ) : isAssistedStripe ? (
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

                              {/* 2. Editar Fecha de Vencimiento Rápida */}
                              <EditDueDateDialog payment={payment} />

                              {/* 3. Editar Cobro Completo (Concepto, Monto, Fecha) */}
                              <PaymentDialog mode="edit" payment={payment} />

                              {/* 4. Marcar como Pagado / Registrar Comprobante */}
                              <PaymentDialog mode="record" payment={payment} />

                              {/* 5. Eliminar Cobro Pendiente */}
                              <PaymentDialog mode="delete" payment={payment} />
                            </>
                          ) : (
                            /* Revertir Pago para el Administrador (Motivo Obligatorio) */
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

        {/* ─── Paginador y Selector de Página Asíncrono ─── */}
        {totalCount > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <div>
                Mostrando <span className="font-semibold text-slate-800">{startIndex + 1}</span> a{" "}
                <span className="font-semibold text-slate-800">{endIndex}</span> de{" "}
                <span className="font-semibold text-slate-800">{totalCount}</span> pagos
                {hasActiveFilters && totalRegistered > 0 && ` (filtrados de ${totalRegistered})`}
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
                  disabled={validCurrentPage === 1 || isLoading}
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
                  disabled={validCurrentPage === 1 || isLoading}
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
                        disabled={isLoading}
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
                  disabled={validCurrentPage === totalPages || isLoading}
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
                  disabled={validCurrentPage === totalPages || isLoading}
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
