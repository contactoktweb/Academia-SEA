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
  CheckCircle2,
  Receipt,
  FileCheck,
  Sparkles,
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
  const [activeTab, setActiveTab] = useState<"comprobante" | "recibo">("comprobante");

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
  const studentPhone = payment.student?.user?.phone || "";
  const conceptName = payment.concept?.name || payment.notes || "Colegiatura / Cobro";
  const amount = payment.amountPaid || payment.amount;
  const paidDate = payment.paidAt ? new Date(payment.paidAt) : new Date(payment.dueDate);
  const isPdf = Boolean(
    payment.receiptUrl?.startsWith("data:application/pdf") ||
    payment.receiptUrl?.toLowerCase().includes("application/pdf") ||
    payment.receiptUrl?.toLowerCase().endsWith(".pdf") ||
    payment.receiptUrl?.toLowerCase().includes(".pdf")
  );

  const handleOpenOrDownload = () => {
    if (!payment.receiptUrl) return;
    if (payment.receiptUrl.startsWith("data:")) {
      try {
        const [header, base64Data] = payment.receiptUrl.split(",");
        const mimeMatch = header.match(/:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : (isPdf ? "application/pdf" : "image/jpeg");
        const binary = atob(base64Data);
        const array = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          array[i] = binary.charCodeAt(i);
        }
        const blob = new Blob([array], { type: mime });
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, "_blank");
      } catch (err) {
        console.error("Error opening base64 receipt:", err);
        const win = window.open();
        if (win) {
          if (isPdf) {
            win.document.write(`<iframe src="${payment.receiptUrl}" style="width:100%;height:100vh;border:none;"></iframe>`);
          } else {
            win.document.write(`<img src="${payment.receiptUrl}" style="max-width:100%;height:auto;display:block;margin:auto;" />`);
          }
        }
      }
    } else {
      window.open(payment.receiptUrl, "_blank");
    }
  };

  const formattedPaidDate = paidDate.toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handlePrint = () => {
    // Generar documento de impresión limpio y optimizado a 1 sola página
    const printIframe = document.createElement("iframe");
    printIframe.style.position = "fixed";
    printIframe.style.right = "0";
    printIframe.style.bottom = "0";
    printIframe.style.width = "0";
    printIframe.style.height = "0";
    printIframe.style.border = "0";
    document.body.appendChild(printIframe);

    const doc = printIframe.contentWindow?.document;
    if (!doc) {
      window.print();
      return;
    }

    const printHtml = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="utf-8" />
        <title>Recibo de Pago - ${studentName}</title>
        <style>
          @page {
            size: letter portrait;
            margin: 10mm 15mm;
          }
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            color: #0f172a;
            background: #ffffff;
            font-size: 11.5px;
            line-height: 1.35;
          }
          .receipt-container {
            width: 100%;
            max-width: 580px;
            margin: 0 auto;
            border: 1.5px solid #cbd5e1;
            border-radius: 16px;
            padding: 22px 26px;
            background: #ffffff;
            page-break-inside: avoid;
            break-inside: avoid;
          }
          .header {
            text-align: center;
            border-bottom: 1.5px solid #e2e8f0;
            padding-bottom: 12px;
            margin-bottom: 12px;
          }
          .brand-title {
            font-size: 17px;
            font-weight: 900;
            color: #0066cc;
            letter-spacing: -0.5px;
            text-transform: uppercase;
          }
          .brand-sub {
            font-size: 9.5px;
            color: #64748b;
            font-weight: 600;
            margin-top: 1px;
          }
          .badge {
            display: inline-block;
            margin-top: 6px;
            background-color: #ecfdf5;
            color: #047857;
            border: 1px solid #a7f3d0;
            padding: 2px 10px;
            border-radius: 9999px;
            font-size: 9.5px;
            font-weight: 800;
            letter-spacing: 0.5px;
            text-transform: uppercase;
          }
          .receipt-title {
            font-size: 14px;
            font-weight: 800;
            color: #0f172a;
            margin-top: 5px;
          }
          .amount-box {
            background: #f8fafc;
            border: 1.5px solid #e2e8f0;
            border-radius: 12px;
            padding: 10px 14px;
            text-align: center;
            margin-bottom: 14px;
          }
          .amount-label {
            font-size: 9px;
            font-weight: 700;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.8px;
          }
          .amount-value {
            font-size: 24px;
            font-weight: 900;
            color: #0f172a;
            margin-top: 2px;
          }
          .amount-currency {
            font-size: 12px;
            font-weight: 700;
            color: #64748b;
          }
          .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 14px;
          }
          .data-table tr {
            border-bottom: 1px solid #f1f5f9;
          }
          .data-table tr:last-child {
            border-bottom: none;
          }
          .data-table td {
            padding: 5.5px 0;
            font-size: 11px;
            vertical-align: middle;
          }
          .data-table td.label {
            color: #64748b;
            font-weight: 600;
            width: 36%;
          }
          .data-table td.value {
            color: #0f172a;
            font-weight: 700;
            text-align: right;
            width: 64%;
          }
          .mono-badge {
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            font-size: 9.5px;
            background: #f1f5f9;
            border: 1px solid #cbd5e1;
            padding: 2px 6px;
            border-radius: 4px;
          }
          .origin-badge {
            display: inline-block;
            background: #ecfdf5;
            color: #065f46;
            border: 1px solid #a7f3d0;
            padding: 2px 8px;
            border-radius: 9999px;
            font-size: 9.5px;
            font-weight: 700;
          }
          .footer {
            border-top: 1.5px solid #e2e8f0;
            padding-top: 10px;
            text-align: center;
          }
          .footer p {
            font-size: 9.5px;
            color: #64748b;
            line-height: 1.35;
          }
          .footer .legal {
            font-size: 8.5px;
            color: #94a3b8;
            margin-top: 3px;
          }
        </style>
      </head>
      <body>
        <div class="receipt-container">
          <div class="header">
            <div class="brand-title">Academia de Inglés SEA</div>
            <div class="brand-sub">Centro de Aprendizaje Líder • Jalisco, México</div>
            <div>
              <span class="badge">✓ Pago Acreditado Oficialmente</span>
            </div>
            <div class="receipt-title">Recibo / Comprobante de Pago</div>
          </div>

          <div class="amount-box">
            <div class="amount-label">Monto Total Liquidado</div>
            <div class="amount-value">
              $${Number(amount).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
              <span class="amount-currency">MXN</span>
            </div>
          </div>

          <table class="data-table">
            <tbody>
              <tr>
                <td class="label">Alumno:</td>
                <td class="value">${studentName}</td>
              </tr>
              ${
                studentEmail
                  ? `
              <tr>
                <td class="label">Email del Alumno:</td>
                <td class="value">${studentEmail}</td>
              </tr>`
                  : ""
              }
              ${
                studentPhone
                  ? `
              <tr>
                <td class="label">Teléfono / WhatsApp:</td>
                <td class="value">${studentPhone}</td>
              </tr>`
                  : ""
              }
              <tr>
                <td class="label">Concepto:</td>
                <td class="value">${conceptName}</td>
              </tr>
              <tr>
                <td class="label">Fecha de Pago:</td>
                <td class="value">${formattedPaidDate}</td>
              </tr>
              <tr>
                <td class="label">Método / Canal:</td>
                <td class="value"><span class="origin-badge">${originLabel}</span></td>
              </tr>
              ${
                payment.reference
                  ? `
              <tr>
                <td class="label">Folio / Referencia:</td>
                <td class="value"><span class="mono-badge">${payment.reference}</span></td>
              </tr>`
                  : ""
              }
              ${
                payment.notes
                  ? `
              <tr>
                <td class="label">Observaciones:</td>
                <td class="value" style="font-weight: 500; font-style: italic; font-size: 10px;">${payment.notes}</td>
              </tr>`
                  : ""
              }
            </tbody>
          </table>

          <div class="footer">
            <p>Documento digital oficial emitido por <strong>Academia de Inglés SEA</strong>.</p>
            <p class="legal">Este recibo certifica la liquidación del cobro. Válido como constancia oficial de no adeudo.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    doc.open();
    doc.write(printHtml);
    doc.close();

    setTimeout(() => {
      printIframe.contentWindow?.focus();
      printIframe.contentWindow?.print();
      setTimeout(() => {
        if (document.body.contains(printIframe)) {
          document.body.removeChild(printIframe);
        }
      }, 2000);
    }, 250);
  };

  if (!isPaid && !hasUploadedReceipt) {
    return <span className="text-xs text-slate-300">-</span>;
  }

  return (
    <Dialog 
      open={open} 
      onOpenChange={(val) => {
        setOpen(val);
        if (val) {
          setActiveTab(hasUploadedReceipt ? "comprobante" : "recibo");
        }
      }}
    >
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
            {hasUploadedReceipt ? "Ver comprobante y factura oficial" : "Ver recibo digital oficial"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent className="w-[92vw] max-w-[490px] sm:max-w-[490px] max-h-[85vh] h-auto flex flex-col min-h-0 p-0 border border-slate-200/80 rounded-3xl shadow-2xl bg-white overflow-hidden">
        
        {/* Barra superior con selector de pestaña si hay archivo subido (Fija) */}
        {hasUploadedReceipt && (
          <div className="shrink-0 bg-slate-100/90 p-2 border-b border-slate-200 flex items-center justify-center gap-1.5 print:hidden">
            <button
              type="button"
              onClick={() => setActiveTab("comprobante")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "comprobante"
                  ? "bg-white text-[#0066cc] shadow-xs border border-slate-200/80"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              <FileCheck className="h-3.5 w-3.5" />
              <span>Comprobante Adjunto</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("recibo")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "recibo"
                  ? "bg-white text-emerald-700 shadow-xs border border-slate-200/80"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              <Receipt className="h-3.5 w-3.5" />
              <span>Factura / Recibo Oficial</span>
            </button>
          </div>
        )}

        {/* ─── CONTENEDOR CON SCROLL FLUIDO (min-h-0 activa el overflow-y-auto en flexbox) ─── */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {/* ─── VISTA 1: Comprobante Adjunto (Imagen o PDF) ─── */}
          {hasUploadedReceipt && activeTab === "comprobante" && (
            <div className="p-5 sm:p-6 space-y-4">
              <DialogHeader className="pb-2 border-b border-slate-100">
                <DialogTitle className="flex items-center gap-2 text-slate-900 text-base">
                  <FileText className="h-4 w-4 text-[#0066cc]" />
                  Comprobante de Pago Adjuntado
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Comprobante registrado para {studentName} ({conceptName})
                </DialogDescription>
              </DialogHeader>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-2 flex items-center justify-center h-[340px] max-h-[45vh] w-full overflow-hidden">
                {isPdf ? (
                  <iframe
                    src={payment.receiptUrl!}
                    className="w-full h-full rounded-xl border-0 bg-white"
                    title="Comprobante PDF"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={payment.receiptUrl!}
                    alt={`Comprobante de pago de ${studentName}`}
                    className="max-h-full max-w-full object-contain rounded-xl shadow-xs"
                  />
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-2 border-t border-slate-100">
                <span className="text-xs text-slate-500 font-medium">
                  Origen: <strong className="text-slate-800">{originLabel}</strong>
                </span>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleOpenOrDownload}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all shadow-xs"
                  >
                    <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
                    <span>Ver Archivo</span>
                  </Button>

                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setActiveTab("recibo")}
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex-1 sm:flex-none"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span>Imprimir Factura</span>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* ─── VISTA 2: Recibo / Factura Oficial Imprimible ─── */}
          {(!hasUploadedReceipt || activeTab === "recibo") && (
            <div className="p-5 sm:p-6 space-y-4 bg-white relative">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-[#0066cc] to-emerald-500 print:hidden" />

              <div id="sea-modal-receipt" className="space-y-3.5 pt-1">
                {/* Encabezado Oficial Institucional */}
                <div className="text-center pb-3 border-b border-slate-100 space-y-1.5">
                  <div className="mx-auto w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-xs">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div className="inline-flex items-center gap-1 rounded-full bg-emerald-100/90 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 tracking-wide uppercase">
                    <ShieldCheck className="h-3 w-3 text-emerald-700" />
                    <span>Pago Acreditado Oficialmente</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">
                    Recibo / Comprobante de Pago
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Academia de Inglés SEA • Folio de Transacción Oficial
                  </p>
                </div>

                {/* Monto Grande Liquidado */}
                <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-3 text-center">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    Monto Total Liquidado
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">
                    ${Number(amount).toLocaleString("es-MX", { minimumFractionDigits: 2 })}{" "}
                    <span className="text-xs font-bold text-slate-500">MXN</span>
                  </div>
                </div>

                {/* Datos Detallados del Pago */}
                <div className="space-y-2 text-xs text-slate-700 py-0.5">
                  <div className="flex justify-between items-center py-0.5 border-b border-slate-100">
                    <span className="text-slate-500 flex items-center gap-1.5 font-medium shrink-0">
                      <User className="h-3.5 w-3.5 text-slate-400" /> Alumno:
                    </span>
                    <span className="font-bold text-slate-900 text-right truncate pl-3">{studentName}</span>
                  </div>

                  {studentEmail && (
                    <div className="flex justify-between items-center py-0.5 border-b border-slate-100">
                      <span className="text-slate-500 font-medium shrink-0">Email:</span>
                      <span className="font-semibold text-slate-800 text-right truncate pl-3">{studentEmail}</span>
                    </div>
                  )}

                  {studentPhone && (
                    <div className="flex justify-between items-center py-0.5 border-b border-slate-100">
                      <span className="text-slate-500 font-medium shrink-0">Teléfono / WA:</span>
                      <span className="font-semibold text-slate-800 text-right truncate pl-3">{studentPhone}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center py-0.5 border-b border-slate-100">
                    <span className="text-slate-500 flex items-center gap-1.5 font-medium shrink-0">
                      <BookOpen className="h-3.5 w-3.5 text-slate-400" /> Concepto:
                    </span>
                    <span className="font-semibold text-slate-800 text-right truncate pl-3">{conceptName}</span>
                  </div>

                  <div className="flex justify-between items-center py-0.5 border-b border-slate-100">
                    <span className="text-slate-500 flex items-center gap-1.5 font-medium shrink-0">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" /> Fecha de Pago:
                    </span>
                    <span className="font-semibold text-slate-800 text-right text-[11px] pl-3">
                      {paidDate.toLocaleDateString("es-MX", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-0.5 border-b border-slate-100">
                    <span className="text-slate-500 flex items-center gap-1.5 font-medium shrink-0">
                      <CreditCard className="h-3.5 w-3.5 text-slate-400" /> Método / Origen:
                    </span>
                    <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] border border-emerald-200">
                      {originLabel}
                    </span>
                  </div>

                  {payment.reference && (
                    <div className="flex justify-between items-center py-0.5 border-b border-slate-100">
                      <span className="text-slate-500 font-medium shrink-0">Folio / Ref:</span>
                      <span className="font-mono text-[10px] font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 truncate max-w-[220px]">
                        {payment.reference}
                      </span>
                    </div>
                  )}

                  {payment.notes && (
                    <div className="flex justify-between items-start py-0.5">
                      <span className="text-slate-500 font-medium shrink-0">Notas:</span>
                      <span className="text-slate-700 text-right text-[11px] pl-3 italic truncate max-w-[240px]">
                        {payment.notes}
                      </span>
                    </div>
                  )}
                </div>

                {/* Pie institucional de validez */}
                <div className="pt-2 text-center border-t border-slate-100 space-y-0.5">
                  <p className="text-[10px] text-slate-400">
                    Documento oficial emitido por <strong>Academia SEA</strong>.
                  </p>
                  <p className="text-[9px] text-slate-400">
                    Válido como comprobante oficial de pago y constancia de no adeudo.
                  </p>
                </div>
              </div>

              {/* Acciones del Recibo */}
              <div className="pt-3 flex items-center justify-between border-t border-slate-100 print:hidden">
                <Button
                  type="button"
                  size="sm"
                  onClick={handlePrint}
                  className="gap-1.5 text-xs font-bold bg-[#0066cc] hover:bg-[#0055aa] text-white shadow-sm px-3.5 py-2"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Imprimir / PDF</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setOpen(false)}
                  className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold px-3.5 py-2"
                >
                  Cerrar
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>

      {/* ─── Estilos de Impresión CSS Exclusivos para el Recibo ─── */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            body * {
              visibility: hidden !important;
            }
            #sea-modal-receipt, #sea-modal-receipt * {
              visibility: visible !important;
            }
            #sea-modal-receipt {
              position: fixed !important;
              left: 50% !important;
              top: 40px !important;
              transform: translateX(-50%) !important;
              width: 90% !important;
              max-width: 480px !important;
              margin: 0 auto !important;
              padding: 24px 32px !important;
              border: 1.5px solid #cbd5e1 !important;
              border-radius: 20px !important;
              background: #ffffff !important;
              box-shadow: none !important;
              color: #0f172a !important;
            }
          }
        `,
      }} />
    </Dialog>
  );
}

