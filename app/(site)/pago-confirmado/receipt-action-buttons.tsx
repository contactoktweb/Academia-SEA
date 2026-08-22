"use client";

import { Printer, ArrowRight, Home } from "lucide-react";
import Link from "next/link";

export function ReceiptActionButtons() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-1 print:hidden">
        <button
          type="button"
          onClick={handlePrint}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 py-2.5 px-4 font-semibold text-xs text-slate-700 shadow-sm transition-all cursor-pointer"
        >
          <Printer className="h-3.5 w-3.5 text-slate-500" />
          <span>Imprimir / PDF</span>
        </button>

        <div className="flex w-full sm:w-auto items-center gap-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 py-2.5 px-4 font-semibold text-xs text-slate-600 shadow-sm transition-all"
          >
            <Home className="h-3.5 w-3.5 text-slate-400" />
            <span>Inicio</span>
          </Link>

          <Link
            href="/dashboard/mis-pagos"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0066cc] hover:bg-[#0055aa] py-2.5 px-4 font-semibold text-xs text-white shadow-sm transition-all"
          >
            <span>Mis Pagos</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            body * {
              visibility: hidden !important;
            }
            #sea-digital-receipt, #sea-digital-receipt * {
              visibility: visible !important;
            }
            #sea-digital-receipt {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              border: none !important;
              box-shadow: none !important;
              padding: 24px !important;
            }
          }
        `,
      }} />
    </>
  );
}
