"use client";

import { useState, useTransition, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  CalendarCheck,
  CreditCard,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Loader2,
  RefreshCw,
  Edit3,
  Check,
  X,
  Send,
  Receipt,
  GraduationCap,
  Calendar,
  DollarSign,
  TrendingUp,
  FileText,
  MessageSquare,
  Copy,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import {
  getStudentPaymentPlanDetails,
  updateStudentPaymentPlan,
} from "@/app/dashboard/alumnos/actions";
import {
  generateAssistedPaymentLink,
  generateAssistedTotalPaymentLink,
  recordPayment,
  uploadPaymentReceipt,
} from "@/app/dashboard/pagos/actions";
import { ReceiptViewerDialog } from "./receipt-viewer-dialog";
import { EditDueDateDialog } from "./payment-dialogs";
import { compressImage } from "@/lib/compress-image";

interface StudentPaymentPlanDialogProps {
  studentUser: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    photoUrl?: string | null;
  };
  studentProfile: {
    id: string;
    studentId?: string | null;
    sede?: string;
    enrollmentDate?: string | Date;
  };
  trigger?: React.ReactNode;
}

export function StudentPaymentPlanDialog({
  studentUser,
  studentProfile,
  trigger,
}: StudentPaymentPlanDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [planData, setPlanData] = useState<any>(null);

  // Modo edición de configuración del plan
  const [isEditingConfig, setIsEditingConfig] = useState(false);
  const [configForm, setConfigForm] = useState({
    monthlyConcept: "",
    monthlyValue: "",
    paymentDate: "",
    totalInstallments: "",
    isScholarship: false,
    scholarshipDiscount: "",
  });

  // Modal para registrar pago de una cuota
  const [recordingInstallment, setRecordingInstallment] = useState<any | null>(null);
  const [recordForm, setRecordForm] = useState({
    amountPaid: "",
    method: "BANK_TRANSFER",
    reference: "",
    paidAt: new Date().toISOString().split("T")[0],
    notes: "",
  });
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [isSavingPayment, setIsSavingPayment] = useState(false);

  // Modal para ver enlace generado de Stripe/WhatsApp
  const [stripeLinkData, setStripeLinkData] = useState<any | null>(null);
  const [isGeneratingLinkFor, setIsGeneratingLinkFor] = useState<string | null>(null);
  const [isGeneratingTotalLink, setIsGeneratingTotalLink] = useState(false);

  // Cargar datos del plan al abrir el diálogo
  useEffect(() => {
    if (open && studentProfile?.id) {
      loadPlanData();
    }
  }, [open, studentProfile?.id]);

  async function loadPlanData(showToast = false) {
    setLoading(true);
    try {
      const res = await getStudentPaymentPlanDetails(studentProfile.id);
      if (res.success && res.data) {
        setPlanData(res.data);
        if (res.data.enrollment) {
          setConfigForm({
            monthlyConcept: res.data.enrollment.conceptName || "Colegiatura Mensual",
            monthlyValue: res.data.enrollment.baseMonthlyValue?.toString() || "800",
            paymentDate: res.data.enrollment.paymentDay?.toString() || "5",
            totalInstallments: res.data.enrollment.totalInstallments?.toString() || "6",
            isScholarship: res.data.enrollment.isScholarship || false,
            scholarshipDiscount: res.data.enrollment.scholarshipDiscount?.toString() || "",
          });
        }
        if (showToast) {
          toast.success("Plan de pagos sincronizado con éxito");
        }
      } else {
        toast.error(res.error || "No se pudo cargar el plan de pagos.");
      }
    } catch (err) {
      console.error("Error loading payment plan:", err);
      toast.error("Error de conexión al cargar el plan.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveConfig() {
    startTransition(async () => {
      const toastId = toast.loading("Actualizando configuración del plan...");
      const res = await updateStudentPaymentPlan(studentProfile.id, {
        monthlyConcept: configForm.monthlyConcept.trim() || undefined,
        monthlyValue: configForm.monthlyValue ? parseFloat(configForm.monthlyValue) : undefined,
        paymentDate: configForm.paymentDate ? parseInt(configForm.paymentDate) : undefined,
        totalInstallments: configForm.totalInstallments ? parseInt(configForm.totalInstallments) : undefined,
        isScholarship: configForm.isScholarship,
        scholarshipDiscount: configForm.scholarshipDiscount ? parseFloat(configForm.scholarshipDiscount) : 0,
      });

      toast.dismiss(toastId);
      if (res.success && res.data) {
        setPlanData(res.data);
        setIsEditingConfig(false);
        toast.success("Plan de pagos y cuotas recalculadas exitosamente");
      } else {
        toast.error(res.error || "Error al actualizar la configuración.");
      }
    });
  }

  async function handleGenerateStripeLink(paymentId: string) {
    if (!paymentId) {
      toast.error("Identificador de pago no válido.");
      return;
    }
    setIsGeneratingLinkFor(paymentId);
    const toastId = toast.loading("Generando enlace seguro con Stripe...");
    try {
      const res = await generateAssistedPaymentLink(paymentId);
      toast.dismiss(toastId);
      if (res.success && res.data) {
        setStripeLinkData(res.data);
      } else {
        toast.error(res.error || "Error al generar enlace de Stripe.");
      }
    } catch (err) {
      toast.dismiss(toastId);
      toast.error("Error de conexión con Stripe.");
    } finally {
      setIsGeneratingLinkFor(null);
    }
  }

  async function handleGenerateTotalStripeLink() {
    setIsGeneratingTotalLink(true);
    const toastId = toast.loading("Generando enlace por el total adeudado...");
    try {
      const res = await generateAssistedTotalPaymentLink(studentProfile.id);
      toast.dismiss(toastId);
      if (res.success && res.data) {
        setStripeLinkData(res.data);
      } else {
        toast.error(res.error || "Error al generar enlace de Stripe.");
      }
    } catch (err) {
      toast.dismiss(toastId);
      toast.error("Error de conexión con Stripe.");
    } finally {
      setIsGeneratingTotalLink(false);
    }
  }

  const handleReceiptFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        try {
          const optimized = await compressImage(file);
          setReceiptFile(optimized);
          setReceiptPreview(URL.createObjectURL(optimized));
        } catch {
          setReceiptFile(file);
          setReceiptPreview(URL.createObjectURL(file));
        }
      } else {
        setReceiptFile(file);
        setReceiptPreview(null);
      }
    }
  };

  async function handleRecordPaymentSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!recordingInstallment?.paymentId) {
      toast.error("No se encontró el registro del cobro");
      return;
    }

    setIsSavingPayment(true);
    const toastId = toast.loading("Registrando pago de mensualidad...");

    try {
      let uploadedReceiptUrl = "";
      if (receiptFile) {
        const formData = new FormData();
        formData.append("file", receiptFile);
        const uploadRes = await uploadPaymentReceipt(formData);
        if (uploadRes.success && uploadRes.url) {
          uploadedReceiptUrl = uploadRes.url;
        }
      }

      const res = await recordPayment(recordingInstallment.paymentId, {
        amountPaid: parseFloat(recordForm.amountPaid || recordingInstallment.amount.toString()),
        method: recordForm.method,
        reference: recordForm.reference.trim() || undefined,
        paidAt: recordForm.paidAt,
        receiptUrl: uploadedReceiptUrl || undefined,
        notes: recordForm.notes.trim() || undefined,
      });

      toast.dismiss(toastId);
      if (res.success) {
        toast.success("¡Pago registrado y mensualidad liquidada con éxito!");
        setRecordingInstallment(null);
        setReceiptFile(null);
        setReceiptPreview(null);
        await loadPlanData();
      } else {
        toast.error(res.error || "Error al registrar el pago");
      }
    } catch (err) {
      toast.dismiss(toastId);
      toast.error("Error inesperado al registrar el pago");
    } finally {
      setIsSavingPayment(false);
    }
  }

  const enrollment = planData?.enrollment;
  const summary = planData?.summary;
  const installments = planData?.installments || [];

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {trigger || (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-[#0066cc] hover:text-[#0055aa] hover:bg-blue-50"
              title="Plan de Pagos y Mensualidades"
            >
              <CalendarCheck className="h-4 w-4" />
            </Button>
          )}
        </DialogTrigger>

        <DialogContent
          className="sm:max-w-[900px] max-h-[92vh] overflow-y-auto overscroll-contain p-0 gap-0 rounded-2xl border-slate-200"
          onInteractOutside={(e) => e.preventDefault()}
        >
          {/* ─── Encabezado del Modal ─── */}
          <div className="bg-gradient-to-r from-slate-900 via-[#1a2b4a] to-[#122238] text-white p-6 rounded-t-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14 border-2 border-white/20 shadow-sm">
                  <AvatarImage src={studentUser.photoUrl || ""} alt={studentUser.name} />
                  <AvatarFallback className="bg-blue-600 text-white font-bold text-lg">
                    {studentUser.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-extrabold text-white leading-tight">
                      {studentUser.name}
                    </h2>
                    {studentProfile.studentId && (
                      <span className="font-mono text-xs font-bold bg-white/20 text-blue-100 px-2 py-0.5 rounded-md border border-white/10">
                        {studentProfile.studentId}
                      </span>
                    )}
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30 text-[11px] font-bold">
                      {studentProfile.sede || "SEAAUTLAN"}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 flex items-center gap-3">
                    <span>{studentUser.email}</span>
                    {studentUser.phone && <span>• {studentUser.phone}</span>}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => loadPlanData(true)}
                  disabled={loading}
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs gap-1.5 h-8 font-semibold"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
                  <span>Sincronizar</span>
                </Button>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {loading && !planData ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-500">
                <Loader2 className="h-8 w-8 animate-spin text-[#0066cc]" />
                <p className="text-sm font-medium">Cargando y sincronizando plan de pagos...</p>
              </div>
            ) : (
              <>
                {/* ─── 1. Banner del Curso e Inscripción ─── */}
                {enrollment ? (
                  <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 font-bold text-xs text-[#0066cc] uppercase tracking-wider">
                          <GraduationCap className="h-4 w-4" />
                          Programa de Estudios Activo
                        </span>
                        {enrollment.isScholarship && (
                          <Badge className="bg-amber-100 text-amber-900 border-amber-300 text-[10px] font-bold flex items-center gap-1">
                            <Sparkles className="h-3 w-3 text-amber-600" />
                            Beca Aplicada (-${enrollment.scholarshipDiscount}/mes)
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {enrollment.courseName}{" "}
                        <span className="text-sm font-normal text-slate-600">({enrollment.courseLevel})</span>
                      </h3>
                      <p className="text-xs text-slate-600 flex flex-wrap items-center gap-x-4 gap-y-1">
                        <span><strong>Grupo:</strong> {enrollment.groupName}</span>
                        <span><strong>Horario:</strong> {enrollment.groupSchedule}</span>
                        <span>
                          <strong>Fecha de Inscripción:</strong>{" "}
                          {new Date(enrollment.enrolledAt).toLocaleDateString("es-MX", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <Button
                        size="sm"
                        variant={isEditingConfig ? "secondary" : "outline"}
                        onClick={() => setIsEditingConfig(!isEditingConfig)}
                        className="text-xs font-semibold gap-1.5 h-8 border-slate-300"
                      >
                        <Edit3 className="h-3.5 w-3.5 text-slate-600" />
                        <span>{isEditingConfig ? "Cerrar Edición" : "Editar Plan"}</span>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 text-xs text-amber-900 flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
                    <div>
                      <p className="font-bold">Alumno sin curso activo formalmente inscrito</p>
                      <p className="text-amber-800">
                        Puedes registrar cobros individuales o inscribir al alumno en un grupo desde la sección de edición.
                      </p>
                    </div>
                  </div>
                )}

                {/* ─── 2. Editor de Configuración del Plan (Colapsable) ─── */}
                {isEditingConfig && (
                  <Card className="border-blue-200 bg-slate-50/70 shadow-xs animate-in fade-in slide-in-from-top-2 duration-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-bold flex items-center justify-between">
                        <span>Modificar Parámetros del Plan de Pagos</span>
                        <span className="text-xs font-normal text-slate-500">
                          Se recalcularán las cuotas pendientes automáticamente
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        <div>
                          <Label className="text-xs font-semibold">Concepto Mensual</Label>
                          <Input
                            value={configForm.monthlyConcept}
                            onChange={(e) => setConfigForm({ ...configForm, monthlyConcept: e.target.value })}
                            placeholder="Ej. Colegiatura Mensual"
                            className="h-8 text-xs bg-white mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-semibold">Valor Mensual ($)</Label>
                          <Input
                            type="number"
                            value={configForm.monthlyValue}
                            onChange={(e) => setConfigForm({ ...configForm, monthlyValue: e.target.value })}
                            placeholder="Ej. 800"
                            className="h-8 text-xs bg-white mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-semibold">Día de Corte Mensual (1-31)</Label>
                          <Input
                            type="number"
                            min={1}
                            max={31}
                            value={configForm.paymentDate}
                            onChange={(e) => setConfigForm({ ...configForm, paymentDate: e.target.value })}
                            placeholder="Ej. 5"
                            className="h-8 text-xs bg-white mt-1"
                          />
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            +7 días de vencimiento desde el corte
                          </p>
                        </div>
                        <div>
                          <Label className="text-xs font-semibold">Total de Mensualidades</Label>
                          <Input
                            type="number"
                            min={1}
                            max={36}
                            value={configForm.totalInstallments}
                            onChange={(e) => setConfigForm({ ...configForm, totalInstallments: e.target.value })}
                            placeholder="Ej. 6"
                            className="h-8 text-xs bg-white mt-1"
                          />
                        </div>
                        <div className="sm:col-span-2 flex flex-col justify-end">
                          <div className="flex items-center space-x-2 bg-white p-2 rounded-md border border-slate-200">
                            <Checkbox
                              id="beca-check"
                              checked={configForm.isScholarship}
                              onCheckedChange={(checked) =>
                                setConfigForm({ ...configForm, isScholarship: !!checked })
                              }
                            />
                            <Label htmlFor="beca-check" className="text-xs font-medium cursor-pointer">
                              Aplicar Beca / Descuento Mensual
                            </Label>
                            {configForm.isScholarship && (
                              <Input
                                type="number"
                                value={configForm.scholarshipDiscount}
                                onChange={(e) =>
                                  setConfigForm({ ...configForm, scholarshipDiscount: e.target.value })
                                }
                                placeholder="Monto de Beca ($)"
                                className="h-7 w-32 text-xs ml-auto"
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setIsEditingConfig(false)}
                          className="h-8 text-xs"
                        >
                          Cancelar
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleSaveConfig}
                          disabled={isPending}
                          className="h-8 text-xs bg-[#0066cc] hover:bg-[#0055aa] text-white font-bold gap-1"
                        >
                          {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                          <span>Guardar y Recalcular Cuotas</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* ─── 3. Resumen Financiero ─── */}
                {summary && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <Card className="border-slate-200 shadow-2xs">
                      <CardContent className="p-3.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                          Total del Plan
                          <DollarSign className="h-3.5 w-3.5 text-slate-400" />
                        </span>
                        <div className="text-xl font-extrabold text-slate-900 mt-1">
                          ${summary.totalCourseCost.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {summary.totalInstallments} mensualidades programadas
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-emerald-200 bg-emerald-50/40 shadow-2xs">
                      <CardContent className="p-3.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center justify-between">
                          Total Liquidado
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        </span>
                        <div className="text-xl font-extrabold text-emerald-700 mt-1">
                          ${summary.totalPaid.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                        </div>
                        <p className="text-[10px] text-emerald-800 font-semibold mt-0.5">
                          {summary.paidCount} de {summary.totalInstallments} cuotas pagadas
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-slate-200 shadow-2xs">
                      <CardContent className="p-3.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                          Saldo Pendiente
                          <Clock className="h-3.5 w-3.5 text-amber-500" />
                        </span>
                        <div className="text-xl font-extrabold text-slate-900 mt-1">
                          ${summary.totalPending.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {summary.pendingCount} mensualidad(es) por cobrar
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-slate-200 shadow-2xs">
                      <CardContent className="p-3.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                          Avance
                          <TrendingUp className="h-3.5 w-3.5 text-[#0066cc]" />
                        </span>
                        <div className="text-xl font-extrabold text-[#0066cc] mt-1">
                          {summary.progressPercentage}%
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-emerald-500 to-[#0066cc] h-full rounded-full transition-all duration-300"
                            style={{ width: `${summary.progressPercentage}%` }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* ─── 4. Cronograma de Cuotas Mes a Mes ─── */}
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-[#0066cc]" />
                        Cronograma de Mensualidades (Generadas automáticamente mes a mes)
                      </h4>
                      <p className="text-xs text-slate-500">
                        Cada cuota corresponde al corte mensual desde su fecha de ingreso.
                      </p>
                    </div>

                    {summary && summary.totalPending > 0 && (
                      <Button
                        size="sm"
                        onClick={handleGenerateTotalStripeLink}
                        disabled={isGeneratingTotalLink}
                        className="bg-[#0066cc] hover:bg-[#0055aa] text-white text-xs h-8 font-bold gap-1 shadow-xs"
                      >
                        {isGeneratingTotalLink ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <CreditCard className="h-3.5 w-3.5" />
                        )}
                        <span>Cobro Total Stripe (${summary.totalPending})</span>
                      </Button>
                    )}
                  </div>

                  {installments.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-xs">
                      No hay cuotas programadas para este alumno.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {installments.map((inst: any) => {
                        const isPaid = inst.status === "PAID";
                        const isOverdue = inst.status === "OVERDUE";
                        const isCurrent = inst.isCurrentMonth;
                        const isGenerating = isGeneratingLinkFor === inst.paymentId;

                        return (
                          <div
                            key={inst.installmentNumber}
                            className={`rounded-xl p-4 border transition-all duration-150 flex flex-col justify-between ${
                              isPaid
                                ? "bg-emerald-50/60 border-emerald-300 shadow-2xs"
                                : isCurrent
                                ? "bg-white border-[#0066cc] ring-2 ring-blue-100 shadow-xs"
                                : isOverdue
                                ? "bg-amber-50/50 border-amber-300"
                                : "bg-slate-50/50 border-slate-200"
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                                  Mensualidad {inst.installmentNumber} de {inst.totalInstallments}
                                </span>

                                {isPaid ? (
                                  <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white font-bold text-[10px] flex items-center gap-1 shadow-2xs">
                                    <CheckCircle2 className="h-3 w-3" />
                                    PAGADO
                                  </Badge>
                                ) : isOverdue ? (
                                  <Badge variant="destructive" className="font-bold text-[10px]">
                                    VENCIDO
                                  </Badge>
                                ) : isCurrent ? (
                                  <Badge className="bg-[#0066cc] hover:bg-[#0055aa] text-white font-bold text-[10px]">
                                    MES ACTUAL
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-slate-600 border-slate-300 text-[10px]">
                                    PRÓXIMO
                                  </Badge>
                                )}
                              </div>

                              <div className="flex items-baseline justify-between">
                                <h5 className="font-extrabold text-slate-900 text-base">
                                  {inst.monthName}
                                </h5>
                                <div className="text-lg font-black text-slate-900">
                                  ${inst.amount.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                                  <span className="text-[10px] font-normal text-slate-500 ml-1">MXN</span>
                                </div>
                              </div>

                              <p className="text-[11px] text-slate-500 mt-0.5">
                                {inst.conceptName}
                              </p>

                              <div className="mt-2 text-[11px] text-slate-600 flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                {isPaid && inst.paidAt ? (
                                  <span>
                                    Pagado el:{" "}
                                    <strong>
                                      {new Date(inst.paidAt).toLocaleDateString("es-MX", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                      })}
                                    </strong>
                                  </span>
                                ) : (
                                  <span>
                                    Vence:{" "}
                                    <strong className={isOverdue ? "text-red-600 font-bold" : "text-slate-900 font-bold"}>
                                      {new Date(inst.dueDate).toLocaleDateString("es-MX", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                      })}
                                    </strong>{" "}
                                    <span className="text-[10px] text-slate-500 font-normal">
                                      (7 días de plazo)
                                    </span>
                                  </span>
                                )}
                              </div>

                              {isPaid && (
                                <div className="mt-2 bg-white/80 p-2 rounded-lg border border-emerald-200 text-[11px] text-slate-700 flex justify-between items-center">
                                  <span>
                                    Método: <strong>{inst.method === "ONLINE" ? "Stripe / Tarjeta" : inst.method || "Efectivo"}</strong>
                                  </span>
                                  {inst.reference && (
                                    <span className="font-mono text-[10px] text-slate-500 truncate max-w-[120px]">
                                      Ref: {inst.reference}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* ── Acciones por cuota ── */}
                            <div className="mt-4 pt-2.5 border-t border-slate-200 flex flex-wrap items-center justify-end gap-2">
                              {isPaid ? (
                                <>
                                  <ReceiptViewerDialog
                                    payment={{
                                      id: inst.paymentId || "",
                                      amount: inst.amount,
                                      amountPaid: inst.amount,
                                      status: "PAID",
                                      method: inst.method || "CASH",
                                      dueDate: inst.dueDate,
                                      paidAt: inst.paidAt,
                                      receiptUrl: inst.receiptUrl,
                                      reference: inst.reference,
                                      notes: inst.conceptName,
                                      sede: studentProfile.sede,
                                      student: {
                                        user: {
                                          name: studentUser.name,
                                          email: studentUser.email,
                                          phone: studentUser.phone || undefined,
                                        },
                                      },
                                      concept: { name: inst.conceptName },
                                    }}
                                  />
                                </>
                              ) : (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleGenerateStripeLink(inst.paymentId)}
                                    disabled={isGenerating}
                                    className="h-7 text-xs px-2.5 gap-1 text-[#0066cc] border-blue-200 hover:bg-blue-50 font-semibold"
                                  >
                                    {isGenerating ? (
                                      <Loader2 className="h-3 w-3 animate-spin" />
                                    ) : (
                                      <Send className="h-3 w-3" />
                                    )}
                                    <span>Cobro Stripe / WA</span>
                                  </Button>

                                  {inst.paymentId && (
                                    <EditDueDateDialog
                                      payment={{
                                        id: inst.paymentId,
                                        dueDate: inst.dueDate,
                                        amount: inst.amount,
                                        conceptName: inst.conceptName,
                                        studentName: studentUser.name,
                                      }}
                                      trigger={
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="h-7 text-xs px-2.5 gap-1 text-slate-700 border-slate-300 hover:bg-slate-100 font-semibold"
                                        >
                                          <Calendar className="h-3 w-3 text-blue-600" />
                                          <span>Vencimiento</span>
                                        </Button>
                                      }
                                      onSuccess={() => loadPlanData()}
                                    />
                                  )}

                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      setRecordingInstallment(inst);
                                      setRecordForm({
                                        amountPaid: inst.amount.toString(),
                                        method: "BANK_TRANSFER",
                                        reference: "",
                                        paidAt: new Date().toISOString().split("T")[0],
                                        notes: `Pago mensualidad ${inst.installmentNumber}: ${inst.monthName}`,
                                      });
                                    }}
                                    className="h-7 text-xs px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-1 shadow-2xs"
                                  >
                                    <CheckCircle2 className="h-3 w-3" />
                                    <span>Registrar Pago</span>
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* ─── Modal para Registrar Pago de una Mensualidad Específica ─── */}
      {recordingInstallment && (
        <Dialog
          open={!!recordingInstallment}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setRecordingInstallment(null);
              setReceiptFile(null);
              setReceiptPreview(null);
            }
          }}
        >
          <DialogContent className="sm:max-w-[500px] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-slate-900">
                Registrar Pago de Mensualidad
              </DialogTitle>
              <DialogDescription className="text-xs">
                {recordingInstallment.conceptName} • {recordingInstallment.monthName} ({studentUser.name})
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleRecordPaymentSubmit} className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold">Monto Pagado ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    required
                    value={recordForm.amountPaid}
                    onChange={(e) => setRecordForm({ ...recordForm, amountPaid: e.target.value })}
                    className="h-9 text-xs mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold">Método de Pago</Label>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm mt-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={recordForm.method}
                    onChange={(e) => setRecordForm({ ...recordForm, method: e.target.value })}
                  >
                    <option value="BANK_TRANSFER">Transferencia Bancaria</option>
                    <option value="CASH">Efectivo</option>
                    <option value="CARD">Tarjeta (Términal / Débito / Crédito)</option>
                    <option value="CHECK">Cheque</option>
                    <option value="OTHER">Otro</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold">Fecha del Pago</Label>
                  <Input
                    type="date"
                    required
                    value={recordForm.paidAt}
                    onChange={(e) => setRecordForm({ ...recordForm, paidAt: e.target.value })}
                    className="h-9 text-xs mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold">Referencia / Folio</Label>
                  <Input
                    placeholder="Ej. AUT-89412"
                    value={recordForm.reference}
                    onChange={(e) => setRecordForm({ ...recordForm, reference: e.target.value })}
                    className="h-9 text-xs mt-1"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold">Comprobante de Pago (Opcional)</Label>
                <div className="mt-1 flex items-center gap-3">
                  <Input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleReceiptFileChange}
                    className="h-9 text-xs file:text-xs file:font-semibold"
                  />
                  {receiptPreview && (
                    <img
                      src={receiptPreview}
                      alt="Preview"
                      className="h-9 w-9 rounded object-cover border"
                    />
                  )}
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold">Notas / Observaciones</Label>
                <Input
                  placeholder="Comentario adicional..."
                  value={recordForm.notes}
                  onChange={(e) => setRecordForm({ ...recordForm, notes: e.target.value })}
                  className="h-9 text-xs mt-1"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setRecordingInstallment(null)}
                  className="h-9 text-xs"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSavingPayment}
                  className="h-9 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-1.5"
                >
                  {isSavingPayment && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>Confirmar y Liquidar Cuota</span>
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* ─── Modal Enlace de Pago Stripe / WhatsApp ─── */}
      {stripeLinkData && (
        <Dialog open={!!stripeLinkData} onOpenChange={() => setStripeLinkData(null)}>
          <DialogContent className="sm:max-w-[480px] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-[#0066cc]" />
                Enlace de Cobro Generado
              </DialogTitle>
              <DialogDescription className="text-xs">
                Comparte este enlace para que el alumno pague de forma segura con tarjeta.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-2">
              <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-3.5 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Alumno:</span>
                  <span className="font-bold text-slate-900">{stripeLinkData.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Concepto:</span>
                  <span className="font-semibold text-slate-800">{stripeLinkData.conceptName}</span>
                </div>
                <div className="flex justify-between border-t border-blue-200/60 pt-1 mt-1">
                  <span className="text-slate-500 font-bold">Total a Cobrar:</span>
                  <span className="font-extrabold text-slate-900 text-sm">
                    ${stripeLinkData.amount?.toFixed(2)} MXN
                  </span>
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold">Enlace Seguro de Stripe</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    readOnly
                    value={stripeLinkData.paymentUrl}
                    className="h-9 text-xs bg-slate-50 font-mono"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(stripeLinkData.paymentUrl);
                      toast.success("Enlace copiado al portapapeles");
                    }}
                    className="h-9 px-3 shrink-0"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <a
                  href={stripeLinkData.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button className="w-full h-10 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs gap-2 shadow-xs">
                    <MessageSquare className="h-4 w-4" />
                    <span>Enviar por WhatsApp</span>
                  </Button>
                </a>
                <a
                  href={stripeLinkData.paymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button variant="outline" className="w-full h-10 text-xs font-bold gap-2">
                    <ExternalLink className="h-4 w-4" />
                    <span>Abrir Pasarela</span>
                  </Button>
                </a>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
