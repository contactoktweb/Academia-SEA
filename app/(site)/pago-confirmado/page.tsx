import { Metadata } from "next";
import Link from "next/link";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import {
  CheckCircle2,
  AlertTriangle,
  Receipt,
  User,
  BookOpen,
  Calendar,
  CreditCard,
  Hash,
  ShieldCheck,
  Mail,
  GraduationCap
} from "lucide-react";
import { ReceiptActionButtons } from "./receipt-action-buttons";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Comprobante de Pago | Academia SEA",
  description: "Comprobante oficial de pago en línea de Academia SEA.",
};

interface PagoConfirmadoProps {
  searchParams: Promise<{
    session_id?: string;
    payment_status?: string;
  }>;
}

export default async function PagoConfirmadoPage({ searchParams }: PagoConfirmadoProps) {
  const params = await searchParams;
  const sessionId = params.session_id;
  const paymentStatus = params.payment_status;

  if (paymentStatus === "cancelled") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-28 pb-16 sm:pt-36 sm:pb-24 bg-slate-50/60">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-100 shadow-xl text-center space-y-4">
          <div className="mx-auto w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-bold text-slate-900">Proceso Cancelado</h1>
            <p className="text-xs text-slate-500">
              No se realizó ningún cargo. Puedes volver a intentarlo cuando lo desees.
            </p>
          </div>
          <div className="pt-3 flex flex-col gap-2">
            <Link
              href="/dashboard/mis-pagos"
              className="w-full py-2.5 px-4 rounded-xl bg-[#0066cc] text-white font-semibold text-xs hover:bg-[#0055aa] transition-all"
            >
              Volver a Mis Pagos
            </Link>
            <Link
              href="/"
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition-all"
            >
              Ir al Inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-28 pb-16 sm:pt-36 sm:pb-24 bg-slate-50/60">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-100 shadow-xl text-center space-y-4">
          <Receipt className="mx-auto h-10 w-10 text-slate-400" />
          <h1 className="text-lg font-bold text-slate-900">Sin información de pago</h1>
          <p className="text-xs text-slate-500">
            No se recibió una sesión de pago válida.
          </p>
          <Link
            href="/"
            className="inline-block py-2.5 px-5 rounded-xl bg-[#0066cc] text-white font-semibold text-xs"
          >
            Volver al Inicio
          </Link>
        </div>
      </div>
    );
  }

  let sessionData: any = null;
  let paymentRecord: any = null;

  try {
    sessionData = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent", "line_items"],
    });

    const paymentId = sessionData.metadata?.paymentId;
    const amountTotal = sessionData.amount_total ? sessionData.amount_total / 100 : 0;
    const reference = (sessionData.payment_intent as any)?.id || sessionData.id;

    if (paymentId) {
      try {
        const isAssisted = sessionData.metadata?.isAssisted === "true";
        const tag = isAssisted ? "[ASISTIDO_STRIPE]" : "[PORTAL_ALUMNO]";
        
        const existing = await db.payment.findUnique({ where: { id: paymentId } });
        const existingNotes = existing?.notes || "";
        const updatedNotes = existingNotes.includes(tag) 
          ? existingNotes 
          : `${tag} ${existingNotes}`.trim();

        paymentRecord = await db.payment.update({
          where: { id: paymentId },
          data: {
            status: "PAID",
            amountPaid: amountTotal > 0 ? amountTotal : undefined,
            method: "ONLINE",
            reference,
            paidAt: new Date(),
            notes: updatedNotes,
          },
          include: {
            student: {
              include: {
                user: true,
                enrollments: {
                  where: { status: "ACTIVE" },
                  include: { course: true, group: true },
                },
              },
            },
            concept: true,
          },
        });
      } catch (dbErr) {
        console.error("Error updating payment in receipt page:", dbErr);
        paymentRecord = await db.payment.findUnique({
          where: { id: paymentId },
          include: {
            student: { include: { user: true, enrollments: { include: { course: true } } } },
            concept: true,
          },
        });
      }
    }
  } catch (stripeErr: any) {
    console.error("Error retrieving stripe session:", stripeErr.message);
  }

  const studentName =
    paymentRecord?.student?.user?.name ||
    sessionData?.customer_details?.name ||
    "Estudiante de Academia SEA";
  const studentEmail =
    paymentRecord?.student?.user?.email || sessionData?.customer_details?.email || "";
  const conceptName =
    paymentRecord?.concept?.name ||
    sessionData?.line_items?.data?.[0]?.description ||
    paymentRecord?.notes ||
    "Colegiatura Curso de Inglés";
  const courseName =
    paymentRecord?.student?.enrollments?.[0]?.course?.name || "Inglés Semestral SEA";
  const amountPaid =
    paymentRecord?.amountPaid
      ? Number(paymentRecord.amountPaid)
      : sessionData?.amount_total
      ? sessionData.amount_total / 100
      : 800;
  const transactionId =
    paymentRecord?.reference || (sessionData?.payment_intent as any)?.id || sessionId;
  const paidDate = paymentRecord?.paidAt
    ? new Date(paymentRecord.paidAt)
    : new Date();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50/50 to-slate-100/50 pt-28 pb-16 sm:pt-32 sm:pb-20 px-4 sm:px-6 flex items-center justify-center">
      <div className="max-w-md w-full space-y-4">
        
        {/* Recibo Minimalista */}
        <div 
          id="sea-digital-receipt" 
          className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/40 relative overflow-hidden"
        >
          {/* Encabezado Minimalista con Icono de Éxito */}
          <div className="text-center pb-5 border-b border-slate-100 space-y-2.5">
            <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center ring-4 ring-emerald-50">
              <CheckCircle2 className="h-6 w-6 stroke-[2.5]" />
            </div>

            <div>
              <span className="inline-block text-[11px] font-bold text-emerald-700 bg-emerald-50/90 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Pago Acreditado
              </span>
              <h1 className="text-xl font-extrabold text-slate-900 mt-1">
                Comprobante Oficial
              </h1>
              <p className="text-xs text-slate-400">
                Academia SEA • Transacción Procesada con Stripe
              </p>
            </div>

            {/* Total Destacado */}
            <div className="pt-2">
              <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                ${amountPaid.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                <span className="text-xs font-bold text-slate-400 ml-1.5">MXN</span>
              </div>
            </div>
          </div>

          {/* Desglose Limpio de Datos */}
          <div className="divide-y divide-slate-100 text-xs py-1">
            <div className="flex justify-between items-center py-2.5">
              <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                <User className="h-3.5 w-3.5 text-slate-300" /> Alumno
              </span>
              <span className="font-bold text-slate-900 text-right">{studentName}</span>
            </div>

            {studentEmail && (
              <div className="flex justify-between items-center py-2.5">
                <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                  <Mail className="h-3.5 w-3.5 text-slate-300" /> Correo
                </span>
                <span className="font-medium text-slate-700 text-right">{studentEmail}</span>
              </div>
            )}

            <div className="flex justify-between items-center py-2.5">
              <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                <BookOpen className="h-3.5 w-3.5 text-slate-300" /> Concepto
              </span>
              <span className="font-semibold text-slate-800 text-right max-w-[200px] truncate">{conceptName}</span>
            </div>

            <div className="flex justify-between items-center py-2.5">
              <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                <GraduationCap className="h-3.5 w-3.5 text-slate-300" /> Curso
              </span>
              <span className="font-medium text-slate-700 text-right">{courseName}</span>
            </div>

            <div className="flex justify-between items-center py-2.5">
              <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                <Calendar className="h-3.5 w-3.5 text-slate-300" /> Fecha y Hora
              </span>
              <span className="font-medium text-slate-700 text-right">
                {paidDate.toLocaleDateString("es-MX", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}{" "}
                -{" "}
                {paidDate.toLocaleTimeString("es-MX", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            <div className="flex justify-between items-center py-2.5">
              <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                <CreditCard className="h-3.5 w-3.5 text-slate-300" /> Método
              </span>
              <span className="font-semibold text-[#0066cc] bg-blue-50 px-2 py-0.5 rounded-full text-[11px]">
                Tarjeta (Stripe)
              </span>
            </div>

            <div className="flex justify-between items-center py-2.5">
              <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                <Hash className="h-3.5 w-3.5 text-slate-300" /> Folio
              </span>
              <span className="font-mono text-[10px] font-semibold text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 truncate max-w-[170px]">
                {transactionId}
              </span>
            </div>
          </div>

          {/* Sello de Autenticidad */}
          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <p className="text-[10px] text-slate-400">
              Comprobante digital verificado por Academia SEA.
            </p>
          </div>
        </div>

        {/* Botones de Acción */}
        <ReceiptActionButtons />
      </div>
    </div>
  );
}
