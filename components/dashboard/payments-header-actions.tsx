"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  RotateCw, 
  HelpCircle, 
  Send, 
  CheckCircle2, 
  FileText, 
  RotateCcw, 
  Trash2,
  CreditCard,
  Info
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PaymentDialog } from "./payment-dialogs";
import { toast } from "sonner";

export function PaymentsHeaderActions() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
      toast.success("Tabla de pagos actualizada");
    });
  };

  return (
    <div className="flex items-center gap-2">
      {/* Botón de Ayuda con Guía de Iconos de Acciones */}
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9 gap-1.5 text-slate-600 hover:text-slate-900 border-slate-200 shadow-sm"
          >
            <HelpCircle className="h-4 w-4 text-[#0066cc]" />
            <span className="hidden sm:inline text-xs font-semibold">Guía de Iconos</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="end">
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <Info className="h-4 w-4 text-[#0066cc]" />
              <h4 className="font-bold text-xs text-slate-900">Significado de los Iconos de Acción</h4>
            </div>
            
            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex items-start gap-2.5">
                <div className="p-1 rounded-md bg-blue-50 text-[#0066cc] shrink-0 mt-0.5">
                  <Send className="h-3.5 w-3.5" />
                </div>
                <div>
                  <strong className="text-slate-900 block">Enviar Link Stripe:</strong>
                  <span>Genera el link de Stripe Checkout para enviarlo por WhatsApp o copiarlo.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-1 rounded-md bg-emerald-50 text-emerald-600 shrink-0 mt-0.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
                <div>
                  <strong className="text-slate-900 block">Registrar Pago Manual:</strong>
                  <span>Marca el cobro como pagado adjuntando obligatoriamente el comprobante.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-1 rounded-md bg-slate-100 text-slate-700 shrink-0 mt-0.5">
                  <FileText className="h-3.5 w-3.5" />
                </div>
                <div>
                  <strong className="text-slate-900 block">Ver Comprobante:</strong>
                  <span>Abre el recibo o foto del ticket de pago adjuntado.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-1 rounded-md bg-amber-50 text-amber-600 shrink-0 mt-0.5">
                  <RotateCcw className="h-3.5 w-3.5" />
                </div>
                <div>
                  <strong className="text-slate-900 block">Revertir Pago:</strong>
                  <span>Regresa un pago de &quot;Pagado&quot; a &quot;Pendiente&quot; si hubo un error.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-1 rounded-md bg-red-50 text-red-600 shrink-0 mt-0.5">
                  <Trash2 className="h-3.5 w-3.5" />
                </div>
                <div>
                  <strong className="text-slate-900 block">Eliminar Cobro:</strong>
                  <span>Elimina el registro de cargo pendiente de la cuenta del alumno.</span>
                </div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Botón de Recargar Tabla Manualmente */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleRefresh}
        disabled={isPending}
        className="h-9 gap-1.5 text-slate-600 hover:text-slate-900 border-slate-200 shadow-sm"
        title="Actualizar tabla de pagos"
      >
        <RotateCw className={`h-4 w-4 text-slate-600 ${isPending ? "animate-spin text-[#0066cc]" : ""}`} />
        <span className="hidden sm:inline text-xs font-semibold">
          {isPending ? "Actualizando..." : "Recargar"}
        </span>
      </Button>

      {/* Botón Nuevo Pago */}
      <PaymentDialog mode="add" />
    </div>
  );
}
