"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Printer,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  Building,
  Calendar,
  User,
  BookOpen,
  Download,
  CheckCircle2,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ReceiptViewerProps {
  payment: {
    id: string;
    amount: number;
    amountPaid?: number | null;
    status: string;
    method: string;
    dueDate: string | Date;
    paidAt?: string | Date | null;
    receiptUrl?: string | null;
    reference?: string | null;
    notes?: string | null;
    sede?: string;
    student?: {
      user?: {
        name?: string;
        email?: string;
        phone?: string;
      };
    };
    concept?: {
      name?: string;
    };
  };
}

export function ReceiptViewerDialog({ payment }: ReceiptViewerProps) {
  const [open, setOpen] = useState(false);

  const isPaid = payment.status === "PAID";
  const hasUploadedReceipt = Boolean(payment.receiptUrl);

  // Determinar canal de origen
  const isAssistedStripe =
    payment.notes?.includes("[ASISTIDO_STRIPE]") ||
    payment.notes?.includes("asistido") ||
    payment.notes?.includes("Asistido");
  const isPortalStripe =
    payment.notes?.includes("[PORTAL_ALUMNO]") ||
    payment.notes?.includes("mensualidad");
  const isStripe = payment.method === "ONLINE" || payment.reference?.startsWith("pi_") || payment.reference?.startsWith("cs_");

  let originLabel = "Registro Manual";
  if (isAssistedStripe) {
    originLabel = "Stripe (Link de Pago Asistido)";
  } else if (isPortalStripe || isStripe) {
    originLabel = "Stripe (Portal del Alumno)";
  } else if (payment.method === "CASH") {
    originLabel = "Manual (Efectivo)";
  } else if (payment.method === "BANK_TRANSFER") {
    originLabel = "Manual (Transferencia Bancaria)";
  } else if (payment.method === "CARD") {
    originLabel = "Manual (Terminal / Tarjeta)";
  }

  const studentName = payment.student?.user?.name || "Estudiante";
  const studentEmail = payment.student?.user?.email || "";
  const conceptName = payment.concept?.name || payment.notes || "Colegiatura / Cobro";
  const amount = payment.amountPaid || payment.amount;
  const paidDate = payment.paidAt ? new Date(payment.paidAt) : new Date(payment.dueDate);
  const isPdf = payment.receiptUrl?.toLowerCase().endsWith(".pdf");

  const handlePrint = () => {
    window.print();
  };

  if (!isPaid && !hasUploadedReceipt) {
    return <span className="text-xs text-slate-300">-</span>;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 rounded-lg transition-all ${
                  hasUploadedReceipt
                    ? "text-[#0066cc] hover:bg-blue-50 hover:text-[#0055aa]"
                    : "text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                }`}
              >
                <FileText className="h-4 w-4" />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs">
            {hasUploadedReceipt ? "Ver comprobante adjunto" : "Ver recibo digital oficial"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto p-0 border-0 rounded-3xl overflow-hidden shadow-2xl">
        {/* Caso 1: Tiene archivo subido (Imagen o PDF) */}
        {hasUploadedReceipt ? (
          <div className="p-6 space-y-4">
            <DialogHeader className="pb-3 border-b border-slate-100">
              <DialogTitle className="flex items-center gap-2 text-slate-900">
                <FileText className="h-5 w-5 text-[#0066cc]" />
                Comprobante de Pago Adjuntado
              </DialogTitle>
              <DialogDescription>
                Comprobante registrado para {studentName} ({conceptName})
              </DialogDescription>
            </DialogHeader>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-2 overflow-hidden flex items-center justify-center min-h-[300px] max-h-[450px]">
              {isPdf ? (
                <iframe
                  src={payment.receiptUrl!}
                  className="w-full h-[400px] rounded-xl border-0"
                  title="Comprobante PDF"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={payment.receiptUrl!}
                  alt={`Comprobante de pago de ${studentName}`}
                  className="max-h-[420px] w-auto object-contain rounded-xl shadow-sm"
                />
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500 font-medium">
                Origen: <strong className="text-slate-800">{originLabel}</strong>
              </span>
              <a
                href={payment.receiptUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0066cc] text-white hover:bg-[#0055aa] text-xs font-bold transition-all shadow-sm"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Abrir Archivo Original</span>
              </a>
            </div>
          </div>
        ) : (
          /* Caso 2: Pago en Línea / Stripe generado por la plataforma (Recibo Digital Oficial) */
          <div className="p-6 sm:p-8 space-y-5 bg-white relative">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-[#0066cc] to-emerald-500" />

            <div id="sea-modal-receipt" className="space-y-4 pt-2">
              <div className="text-center pb-4 border-b border-slate-100 space-y-2">
                <div className="mx-auto w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div className="inline-flex items-center gap-1 rounded-full bg-emerald-100/80 px-3 py-0.5 text-[11px] font-bold text-emerald-800 tracking-wide uppercase">
                  <ShieldCheck className="h-3 w-3 text-emerald-700" />
                  <span>Acreditado Oficialmente</span>
                </div>
                <h3 className="text-xl font-black text-slate-900">
                  Recibo Digital de Pago
                </h3>
                <p className="text-xs text-slate-500">
                  Academia de Inglés SEA • Folio de Transacción Oficial
                </p>
              </div>

              {/* Monto Grande */}
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 text-center">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Monto Liquidado
                </span>
                <div className="text-3xl font-black text-slate-900 mt-0.5">
                  ${Number(amount).toLocaleString("es-MX", { minimumFractionDigits: 2 })}{" "}
                  <span className="text-sm font-bold text-slate-500">MXN</span>
                </div>
              </div>

              {/* Datos del Pago */}
              <div className="space-y-2.5 text-xs text-slate-700 py-1">
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                    <User className="h-3.5 w-3.5 text-slate-400" /> Alumno:
                  </span>
                  <span className="font-bold text-slate-900 text-right">{studentName}</span>
                </div>

                {studentEmail && (
                  <div className="flex justify-between items-center py-1 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Email:</span>
                    <span className="font-semibold text-slate-800 text-right">{studentEmail}</span>
                  </div>
                )}

                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                    <BookOpen className="h-3.5 w-3.5 text-slate-400" /> Concepto:
                  </span>
                  <span className="font-semibold text-slate-800 text-right">{conceptName}</span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" /> Fecha de Pago:
                  </span>
                  <span className="font-semibold text-slate-800 text-right">
                    {paidDate.toLocaleDateString("es-MX", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    {payment.paidAt &&
                      `- ${paidDate.toLocaleTimeString("es-MX", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}`}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                    <CreditCard className="h-3.5 w-3.5 text-slate-400" /> Canal de Origen:
                  </span>
                  <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full text-[11px]">
                    {originLabel}
                  </span>
                </div>

                {payment.reference && (
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-500 font-medium">Referencia / Folio Stripe:</span>
                    <span className="font-mono text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 truncate max-w-[200px]">
                      {payment.reference}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Acciones del Recibo */}
            <div className="pt-3 flex items-center justify-between border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="gap-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                <Printer className="h-3.5 w-3.5 text-slate-500" />
                <span>Imprimir / PDF</span>
              </Button>

              <Button
                type="button"
                size="sm"
                onClick={() => setOpen(false)}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4"
              >
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
