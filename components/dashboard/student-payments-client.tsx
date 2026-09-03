"use client";

import { useState, useEffect, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  CheckCircle2, 
  CreditCard, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  Sparkles, 
  AlertCircle, 
  FileText, 
  Receipt, 
  Loader2, 
  BadgeCheck, 
  ArrowRight,
  TrendingUp,
  GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { StudentInstallment, verifyStripeSessionPayment } from "@/app/dashboard/mis-pagos/actions";

interface StudentPaymentsClientProps {
  initialData: {
    student: {
      name: string;
      email: string;
      phone?: string | null;
      sede: string;
    };
    enrollment: {
      id: string;
      courseName: string;
      level: string;
      groupName: string;
      schedule: string;
      totalInstallments: number;
      baseMonthlyValue: number;
      netMonthlyAmount: number;
      isScholarship: boolean;
      scholarshipDiscount: number;
      paymentDay: number;
      conceptName: string;
      isPlanActive?: boolean;
      planActivatedAt?: string | null;
    } | null;
    isPlanActive?: boolean;
    pendingInscriptionPayment?: any | null;
    installments: StudentInstallment[];
    summary: {
      totalCourseCost: number;
      totalPaid: number;
      totalPending: number;
      paidCount: number;
      pendingCount: number;
      totalInstallments: number;
    };
    allPayments: any[];
  };
}

export function StudentPaymentsClient({ initialData }: StudentPaymentsClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [data, setData] = useState(initialData);
  const [payingInstallmentNumber, setPayingInstallmentNumber] = useState<number | null>(null);
  const [isPayingGenericId, setIsPayingGenericId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"ALL" | "PENDING" | "PAID">("ALL");
  const [isVerifying, startVerification] = useTransition();

  // Verificar si venimos redirigidos de Stripe tras un pago exitoso
  useEffect(() => {
    const paymentStatus = searchParams.get("payment_status");
    const sessionId = searchParams.get("session_id");

    if (paymentStatus === "success" && sessionId) {
      startVerification(async () => {
        const toastId = toast.loading("Verificando tu pago con Stripe...");
        const res = await verifyStripeSessionPayment(sessionId);
        toast.dismiss(toastId);

        if (res.success) {
          toast.success("¡Pago procesado con éxito! Tu pago ha sido acreditado en el sistema.");
          router.replace("/dashboard/mis-pagos");
        } else {
          toast.info("Pago recibido. Si aún no ves reflejado el cambio, se actualizará en unos segundos.");
        }
      });
    } else if (paymentStatus === "cancelled") {
      toast.info("El proceso de pago en Stripe fue cancelado.");
      router.replace("/dashboard/mis-pagos");
    }
  }, [searchParams, router]);

  // Pago de una cuota mensual con Stripe
  const handlePayWithStripe = async (inst: StudentInstallment) => {
    try {
      setPayingInstallmentNumber(inst.installmentNumber);
      const toastId = toast.loading("Generando pasarela de pago segura con Stripe...");

      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentId: inst.paymentId,
          installmentNumber: inst.installmentNumber,
          amount: inst.amount,
          dueDate: inst.dueDate,
          conceptName: inst.conceptName,
          courseName: data.enrollment?.courseName || "Curso de Inglés",
        }),
      });

      const resData = await response.json();
      toast.dismiss(toastId);

      if (response.status === 503) {
        toast.error("⚠️ Falla en credenciales de Stripe. Contacta al administrador del sistema.", { duration: 6000 });
        setPayingInstallmentNumber(null);
        return;
      }

      if (resData.success && resData.url) {
        window.location.href = resData.url;
      } else {
        toast.error(resData.error || "No se pudo iniciar la pasarela de Stripe.");
        setPayingInstallmentNumber(null);
      }
    } catch (err: any) {
      console.error("Error initiating Stripe payment:", err);
      toast.error("Ocurrió un error de conexión con Stripe.");
      setPayingInstallmentNumber(null);
    }
  };

  // Pago de un cobro genérico (ej. Inscripción pendiente)
  const handlePayGenericPayment = async (pay: any) => {
    try {
      setIsPayingGenericId(pay.id);
      const toastId = toast.loading("Conectando con la pasarela de Stripe...");

      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentId: pay.id,
          installmentNumber: 1,
          amount: Number(pay.amount),
          conceptName: pay.concept?.name || pay.notes || "Inscripción Ciclo Escolar",
          courseName: data.enrollment?.courseName || "Curso de Inglés",
        }),
      });

      const resData = await response.json();
      toast.dismiss(toastId);

      if (response.status === 503) {
        toast.error("⚠️ Falla en credenciales de Stripe. Contacta al administrador del sistema.", { duration: 6000 });
        setIsPayingGenericId(null);
        return;
      }

      if (resData.success && resData.url) {
        window.location.href = resData.url;
      } else {
        toast.error(resData.error || "No se pudo iniciar la pasarela de Stripe.");
        setIsPayingGenericId(null);
      }
    } catch (err) {
      console.error("Error paying generic payment:", err);
      toast.error("Error de conexión con Stripe.");
      setIsPayingGenericId(null);
    }
  };

  const { enrollment, summary, installments, allPayments, isPlanActive } = data;

  const progressPercentage = summary.totalCourseCost > 0
    ? Math.min(100, Math.round((summary.totalPaid / summary.totalCourseCost) * 100))
    : 0;

  // Filtrado de cuotas
  const paidInstallments = installments.filter((i) => i.status === "PAID");
  const pendingInstallments = installments.filter((i) => i.status !== "PAID");
  const displayedInstallments =
    activeTab === "ALL"
      ? installments
      : activeTab === "PAID"
      ? paidInstallments
      : pendingInstallments;

  // Buscar si hay cobro de inscripción pendiente
  const pendingInscription =
    data.pendingInscriptionPayment ||
    allPayments?.find(
      (p) =>
        ["PENDING", "OVERDUE"].includes(p.status) &&
        (p.concept?.type === "ENROLLMENT" ||
          p.concept?.name?.toLowerCase().includes("inscripci") ||
          p.notes?.toLowerCase().includes("inscripci"))
    );

  return (
    <div className="space-y-8">
      {/* ─── 1. Header & Summary Stats (solo si plan activo) ─── */}
      {isPlanActive && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Course Cost */}
          <Card className="border-slate-200/80 shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Valor Total del Curso ({summary.totalInstallments} Meses)
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-extrabold text-slate-900">
                ${summary.totalCourseCost.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                ${enrollment?.netMonthlyAmount.toLocaleString("es-MX", { minimumFractionDigits: 2 })} / mes
              </p>
            </CardContent>
          </Card>

          {/* Total Paid */}
          <Card className="border-emerald-200 bg-emerald-50/40 shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Total Pagado
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-extrabold text-emerald-700">
                ${summary.totalPaid.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-emerald-800/80 mt-1 font-semibold">
                {summary.paidCount} de {summary.totalInstallments} mensualidades liquidadas
              </p>
            </CardContent>
          </Card>

          {/* Balance Pending */}
          <Card className="border-slate-200/80 shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Saldo Pendiente
              </CardTitle>
              <Clock className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-extrabold text-slate-900">
                ${summary.totalPending.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {summary.pendingCount} mensualidad(es) por pagar
              </p>
            </CardContent>
          </Card>

          {/* Progress Card */}
          <Card className="border-slate-200/80 shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Avance del Plan
              </CardTitle>
              <BadgeCheck className="h-4 w-4 text-[#0066cc]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-extrabold text-[#0066cc]">
                {progressPercentage}%
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-[#0066cc] h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ─── 2. Active Enrollment / Course Banner ─── */}
      {enrollment ? (
        <Card className="border-slate-200/80 bg-gradient-to-r from-slate-900 via-[#1a2b4a] to-[#122238] text-white shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="border-blue-400/40 bg-blue-500/20 text-blue-200 text-xs font-bold">
                    Programa Activo
                  </Badge>
                  {isPlanActive ? (
                    <Badge variant="outline" className="border-emerald-400/40 bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Plan Habilitado ({enrollment.totalInstallments} Meses)
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-amber-400/40 bg-amber-500/20 text-amber-300 text-xs font-bold flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Plan Pendiente de Inscripción
                    </Badge>
                  )}
                  {enrollment.isScholarship && (
                    <Badge variant="outline" className="border-amber-400/40 bg-amber-500/20 text-amber-300 text-xs font-bold flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      Beca Aplicada (-${enrollment.scholarshipDiscount} / mes)
                    </Badge>
                  )}
                </div>
                <h3 className="text-2xl font-extrabold tracking-tight">
                  {enrollment.courseName} <span className="text-blue-300 text-lg">({enrollment.level})</span>
                </h3>
                <p className="text-sm text-slate-300 flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span><strong>Grupo:</strong> {enrollment.groupName}</span>
                  <span><strong>Horario:</strong> {enrollment.schedule}</span>
                  <span><strong>Día de Pago:</strong> Día {enrollment.paymentDay} de cada mes</span>
                </p>
              </div>

              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-white">Pagos Seguros con Stripe</p>
                  <p className="text-slate-300">Aceptamos tarjetas de débito y crédito</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-amber-200 bg-amber-50/50 p-6 text-amber-900">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-amber-600 shrink-0" />
            <div>
              <p className="font-bold text-base">Sin Curso Activo Asignado</p>
              <p className="text-sm text-amber-800">
                Actualmente no tienes un curso registrado con plan de mensualidades. Si crees que es un error, por favor contacta a la administración.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* ─── 3. Estado: PLAN PENDIENTE DE PRIMER COBRO (INSCRIPCIÓN) ─── */}
      {!isPlanActive && (
        <Card className="border-2 border-dashed border-amber-300 bg-amber-50/60 p-6 shadow-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3.5 rounded-2xl bg-amber-100 text-amber-700 shrink-0">
                <Clock className="h-7 w-7" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-amber-950">
                  Plan de Cuotas Mensuales en Espera de Activación
                </h3>
                <p className="text-sm text-amber-900/90 max-w-2xl leading-relaxed">
                  Cada alumno cuenta con su plan de pagos de mensualidades, pero este se habilitará una vez registrado el cobro o pago de tu <strong>Inscripción</strong>.
                  {pendingInscription
                    ? " Tienes un cobro de inscripción generado. Puedes realizar tu pago en línea de manera 100% segura mediante Stripe para habilitar tus 6 mensualidades:"
                    : " Si ya realizaste tu pago de inscripción en efectivo en la sede o vía transferencia bancaria, la administración habilitará tu plan de mensualidades en breve."}
                </p>
              </div>
            </div>

            {pendingInscription && (
              <div className="shrink-0 w-full md:w-auto bg-white p-4 rounded-2xl border border-amber-200 shadow-sm text-center space-y-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 block">
                  Cobro de Inscripción Pendiente
                </span>
                <div className="text-2xl font-black text-slate-900">
                  ${Number(pendingInscription.amount).toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN
                </div>
                <Button
                  onClick={() => handlePayGenericPayment(pendingInscription)}
                  disabled={isPayingGenericId === pendingInscription.id}
                  className="bg-[#0066cc] hover:bg-[#0055aa] text-white font-bold text-xs h-10 w-full gap-2 shadow-sm rounded-xl"
                >
                  {isPayingGenericId === pendingInscription.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CreditCard className="h-4 w-4" />
                  )}
                  <span>Pagar Inscripción con Stripe</span>
                </Button>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* ─── 4. PLAN HABILITADO: Grid de Mensualidades y Filtros (Todas, Las que vienen, Pagadas) ─── */}
      {isPlanActive && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#0066cc]" />
                Plan de Pagos y Mensualidades del Alumno
              </h2>
              <p className="text-xs text-slate-500">
                Revisa tus pagos realizados, las cuotas que vienen y paga en línea de forma segura con Stripe.
              </p>
            </div>

            {/* Pestañas de Filtrado: Todas / Por pagar (las que vienen) / Pagadas */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setActiveTab("ALL")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  activeTab === "ALL" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Todas ({installments.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("PENDING")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === "PENDING" ? "bg-white text-[#0066cc] shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>Por Pagar / Las que vienen</span>
                <span className="bg-blue-100 text-[#0066cc] text-[10px] px-1.5 py-0.2 rounded-full font-extrabold">
                  {pendingInstallments.length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("PAID")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === "PAID" ? "bg-white text-emerald-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>Pagadas</span>
                <span className="bg-emerald-100 text-emerald-700 text-[10px] px-1.5 py-0.2 rounded-full font-extrabold">
                  {paidInstallments.length}
                </span>
              </button>
            </div>
          </div>

          {displayedInstallments.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-8 text-center text-slate-500 text-sm">
              {activeTab === "PAID"
                ? "Aún no tienes mensualidades pagadas en este plan."
                : "¡Felicidades! No tienes mensualidades pendientes en esta vista."}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
              {displayedInstallments.map((inst) => {
                const isPaid = inst.status === "PAID";
                const isOverdue = inst.status === "OVERDUE";
                const isCurrent = inst.isCurrentMonth;
                const isProcessingThis = payingInstallmentNumber === inst.installmentNumber;

                return (
                  <div
                    key={inst.installmentNumber}
                    className={`relative flex flex-col justify-between rounded-2xl p-5 transition-all duration-200 border-2 ${
                      isPaid
                        ? "bg-emerald-50/70 border-emerald-300 shadow-sm"
                        : isCurrent
                        ? "bg-white border-[#0066cc] shadow-md ring-2 ring-blue-100"
                        : isOverdue
                        ? "bg-amber-50/50 border-amber-300 shadow-xs"
                        : "bg-white border-slate-200 shadow-xs hover:border-slate-300"
                    }`}
                  >
                    {/* Ribbon para el Mes Actual */}
                    {isCurrent && !isPaid && (
                      <div className="absolute -top-3 right-4 rounded-full bg-[#0066cc] text-white px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider shadow-xs">
                        Mes Actual
                      </div>
                    )}

                    <div>
                      {/* Cabecera de la cuota y Estado */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                          Mensualidad {inst.installmentNumber} de {inst.totalInstallments}
                        </span>

                        {isPaid ? (
                          <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 shadow-xs">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            PAGADO
                          </Badge>
                        ) : isOverdue ? (
                          <Badge variant="destructive" className="font-bold text-xs">
                            VENCIDO
                          </Badge>
                        ) : isCurrent ? (
                          <Badge className="bg-[#0066cc] hover:bg-[#0055aa] text-white font-bold text-xs">
                            POR PAGAR
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-slate-600 border-slate-300 text-xs">
                            PRÓXIMO
                          </Badge>
                        )}
                      </div>

                      {/* Nombre del mes y concepto */}
                      <h4 className="text-lg font-bold text-slate-900 leading-tight">
                        {inst.monthName}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {inst.conceptName}
                      </p>

                      {/* Fecha de vencimiento o pago */}
                      <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-600">
                        <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        {isPaid && inst.paidAt ? (
                          <span>
                            Pagado el: <strong>{new Date(inst.paidAt).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })}</strong>
                          </span>
                        ) : (
                          <span>
                            Vencimiento: <strong>{new Date(inst.dueDate).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })}</strong> (Día {inst.dueDay})
                          </span>
                        )}
                      </div>

                      {/* Desglose de Monto */}
                      <div className="mt-4 pt-3 border-t border-slate-200/70 flex items-baseline justify-between">
                        <div>
                          <span className="text-xs text-slate-400 uppercase font-semibold">Total:</span>
                          <div className="text-2xl font-black text-slate-900">
                            ${inst.amount.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                            <span className="text-xs font-normal text-slate-500 ml-1">MXN</span>
                          </div>
                        </div>

                        {inst.isScholarship && inst.discount > 0 && !isPaid && (
                          <span className="text-[11px] text-emerald-700 bg-emerald-100 font-semibold px-2 py-0.5 rounded-md">
                            -${inst.discount} Beca
                          </span>
                        )}
                      </div>

                      {/* Detalles del comprobante si está liquidada */}
                      {isPaid && (
                        <div className="mt-3 bg-white/80 p-2.5 rounded-lg border border-emerald-200/60 text-xs text-slate-700 space-y-1">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Método:</span>
                            <span className="font-semibold">{inst.method === "ONLINE" ? "Stripe / Tarjeta" : inst.method || "Efectivo"}</span>
                          </div>
                          {inst.reference && (
                            <div className="flex justify-between truncate">
                              <span className="text-slate-500">Ref:</span>
                              <span className="font-mono text-[10px] text-slate-600 truncate max-w-[150px]">{inst.reference}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Botón de Pago con Stripe o Confirmación de Liquidado */}
                    <div className="mt-5">
                      {isPaid ? (
                        <div className="flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-emerald-700 bg-emerald-100/80 rounded-xl border border-emerald-200">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Mensualidad Liquidada</span>
                        </div>
                      ) : (
                        <Button
                          onClick={() => handlePayWithStripe(inst)}
                          disabled={isProcessingThis}
                          className="w-full rounded-xl bg-gradient-to-r from-[#0066cc] to-[#0055aa] hover:from-[#0055aa] hover:to-[#004488] text-white font-bold text-sm py-2.5 shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
                        >
                          {isProcessingThis ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>Conectando con Stripe...</span>
                            </>
                          ) : (
                            <>
                              <CreditCard className="h-4 w-4" />
                              <span>Pagar con Stripe</span>
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ─── 5. Historial General de Transacciones (Inscripciones, Cuotas y Recibos) ─── */}
      <Card className="border-slate-200/80 shadow-xs">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Receipt className="h-5 w-5 text-slate-500" />
            Historial General de Transacciones
          </CardTitle>
          <CardDescription>
            Registro detallado de todos los cobros y pagos acreditados en tu cuenta de Academia SEA.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {allPayments && allPayments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-slate-50 text-slate-500 border-b">
                  <tr>
                    <th className="py-3 px-4">Concepto</th>
                    <th className="py-3 px-4">Fecha Vencimiento</th>
                    <th className="py-3 px-4">Fecha Pago</th>
                    <th className="py-3 px-4">Monto</th>
                    <th className="py-3 px-4">Método</th>
                    <th className="py-3 px-4">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allPayments.map((pay: any) => {
                    const isPayPaid = pay.status === "PAID";
                    return (
                      <tr key={pay.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-medium text-slate-900">
                          {pay.concept?.name || pay.notes || "Mensualidad de Curso"}
                        </td>
                        <td className="py-3 px-4 text-slate-500 text-xs">
                          {new Date(pay.dueDate).toLocaleDateString("es-MX")}
                        </td>
                        <td className="py-3 px-4 text-slate-500 text-xs">
                          {pay.paidAt ? new Date(pay.paidAt).toLocaleDateString("es-MX") : "-"}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          ${(pay.amountPaid || pay.amount).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 px-4 text-xs font-semibold text-slate-600">
                          {pay.method === "ONLINE" ? "Stripe / Online" : pay.method || "Efectivo"}
                        </td>
                        <td className="py-3 px-4">
                          {isPayPaid ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                              <CheckCircle2 className="h-3 w-3" />
                              Pagado
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                              <Clock className="h-3 w-3" />
                              Pendiente
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-8 text-center text-slate-500 text-sm">
              No hay pagos registrados en tu historial todavía.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
