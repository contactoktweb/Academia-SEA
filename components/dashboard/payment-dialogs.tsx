"use client";

import { useState, useEffect, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  PlusCircle, 
  Edit2, 
  Trash2, 
  Loader2, 
  Check, 
  CheckCircle2,
  ChevronsUpDown, 
  Send, 
  Copy, 
  MessageSquare, 
  RotateCcw, 
  Upload, 
  FileText, 
  ExternalLink,
  ShieldAlert,
  CreditCard,
  RotateCw,
  Lock,
  FileCheck,
  Image as ImageIcon
} from "lucide-react";
import { 
  createPayment, 
  recordPayment, 
  deletePayment, 
  getPaymentMetadata, 
  getStudentFinancialSummary,
  generateAssistedPaymentLink,
  uploadPaymentReceipt,
  revertPayment
} from "@/app/dashboard/pagos/actions";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { compressImage } from "@/lib/compress-image";

function generateAutoReference(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `REC-${year}${month}${day}-${randomSuffix}`;
}

const paymentSchema = z.object({
  studentId: z.string().min(1, "Seleccione un estudiante"),
  conceptId: z.string().optional(),
  cycleId: z.string().optional(),
  amount: z.string().min(1, "Monto requerido"),
  dueDate: z.string().min(1, "Fecha de vencimiento requerida"),
  notes: z.string().optional(),
  status: z.string().optional(),
  amountPaid: z.string().optional(),
  method: z.string().optional(),
  reference: z.string().optional(),
  receiptUrl: z.string().optional(),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

interface PaymentDialogProps {
  mode: "add" | "edit" | "delete" | "record";
  payment?: any;
}

export function PaymentDialog({ mode, payment }: PaymentDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreviewUrl, setReceiptPreviewUrl] = useState<string | null>(payment?.receiptUrl || null);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function handleSuccess() {
    setOpen(false);
    const toastId = toast.loading("Actualizando...");
    startTransition(() => {
      router.refresh();
      toast.dismiss(toastId);
      toast.success("Datos actualizados");
    });
  }

  const [metadata, setMetadata] = useState<any>({ students: [], concepts: [], cycles: [] });
  const [financialSummary, setFinancialSummary] = useState<any>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect(() => {
    if (open && (mode === "add" || mode === "edit")) {
      const fetchMetadata = async () => {
        const result = await getPaymentMetadata();
        if (result.success) setMetadata(result.data);
      };
      fetchMetadata();
    }
  }, [open, mode]);

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      studentId: payment?.studentId || "",
      conceptId: payment?.conceptId || "",
      cycleId: payment?.cycleId || "",
      amount: payment?.amount?.toString() || "",
      dueDate: payment?.dueDate ? new Date(payment.dueDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      notes: payment?.notes || "",
      amountPaid: (payment?.amountPaid ?? payment?.amount ?? "").toString(),
      method: payment?.method || "BANK_TRANSFER",
      reference: payment?.reference || "",
      receiptUrl: payment?.receiptUrl || "",
    },
  });

  // Sincronizar formulario cada vez que se abra el modal
  useEffect(() => {
    if (open && payment) {
      form.reset({
        studentId: payment.studentId || "",
        conceptId: payment.conceptId || "",
        cycleId: payment.cycleId || "",
        amount: payment.amount?.toString() || "",
        dueDate: payment.dueDate ? new Date(payment.dueDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        notes: payment.notes || "",
        amountPaid: (payment.amountPaid ?? payment.amount ?? "").toString(),
        method: payment.method || "BANK_TRANSFER",
        reference: payment.reference || "",
        receiptUrl: payment.receiptUrl || "",
      });
      setReceiptFile(null);
      setReceiptPreviewUrl(payment.receiptUrl || null);
    }
  }, [open, payment, form]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setIsCompressing(true);
        try {
          const optimized = await compressImage(file);
          setReceiptFile(optimized);
          const tempUrl = URL.createObjectURL(optimized);
          setReceiptPreviewUrl(tempUrl);
        } catch (err) {
          console.error("Error optimizando imagen:", err);
          setReceiptFile(file);
          const tempUrl = URL.createObjectURL(file);
          setReceiptPreviewUrl(tempUrl);
        } finally {
          setIsCompressing(false);
        }
      } else {
        // Documento PDF u otros
        setReceiptFile(file);
        const tempUrl = URL.createObjectURL(file);
        setReceiptPreviewUrl(tempUrl);
      }
    }
  };

  const onSubmit = async (values: PaymentFormValues) => {
    // Si estamos en modo "record", el comprobante es OBLIGATORIO
    if (mode === "record") {
      if (!receiptFile && !receiptPreviewUrl) {
        toast.error("Es obligatorio adjuntar un comprobante de pago para registrar el cobro manualmente.");
        return;
      }
    }

    startTransition(async () => {
      let finalReceiptUrl = values.receiptUrl || payment?.receiptUrl || "";

      // Subir archivo si se seleccionó uno nuevo
      if (receiptFile) {
        setIsUploadingFile(true);
        const fileToSend = receiptFile.type.startsWith("image/")
          ? await compressImage(receiptFile)
          : receiptFile;

        const formData = new FormData();
        formData.append("file", fileToSend);
        const uploadRes = await uploadPaymentReceipt(formData);
        setIsUploadingFile(false);

        if (!uploadRes.success || !uploadRes.url) {
          toast.error(uploadRes.error || "Error al subir el comprobante");
          return;
        }
        finalReceiptUrl = uploadRes.url;
      }

      let promise;
      if (mode === "record") {
        // Si no se especificó referencia, asignar una automática
        const finalRef = values.reference?.trim() || generateAutoReference();
        // El monto no es editable y se fija exactamente al monto adeudado
        const lockedAmount = parseFloat(String(payment?.amount || values.amountPaid || 0));

        promise = recordPayment(payment.id, {
          amountPaid: lockedAmount,
          method: values.method || "BANK_TRANSFER",
          reference: finalRef,
          receiptUrl: finalReceiptUrl,
          notes: values.notes,
        });
      } else if (mode === "add") {
        promise = createPayment({
          ...values,
          cycleId: values.cycleId || undefined,
          conceptId: values.conceptId || undefined,
          amount: parseFloat(values.amount),
        });
      } else {
        toast.error("Edición no disponible");
        return;
      }

      await toast.promise(promise, {
        loading: mode === "record" ? "Registrando pago con comprobante..." : "Creando cobro...",
        success: (result: any) => {
          if (result.success) {
            handleSuccess();
            return "Operación realizada con éxito";
          }
          throw new Error(result.error);
        },
        error: (err) => err.message || "Error en la operación",
      });
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      const promise = deletePayment(payment.id);
      await toast.promise(promise, {
        loading: "Eliminando pago...",
        success: (result: any) => {
          if (result.success) {
            handleSuccess();
            return "Pago eliminado correctamente";
          }
          throw new Error(result.error);
        },
        error: (err) => err.message || "Error al eliminar el pago",
      });
    });
  };

  if (mode === "delete") {
    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">Eliminar cobro</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar cobro/pago?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el registro de pago de {payment?.student?.user?.name}. Si ya fue pagado, esto alterará los reportes financieros.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Eliminar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {mode === "add" ? (
        <DialogTrigger asChild>
          <Button className="bg-[#0066cc] hover:bg-[#0055aa] text-white shadow-sm font-semibold">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nuevo Pago
          </Button>
        </DialogTrigger>
      ) : mode === "record" ? (
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg">
                  <CheckCircle2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">Registrar pago con comprobante</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 p-0 rounded-lg">
            <Edit2 className="h-4 w-4" />
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-[460px]" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Crear Nuevo Cobro" : "Registrar Pago con Comprobante"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add" 
              ? "Genera una nueva obligación de pago para un estudiante." 
              : `Registra el pago recibido para ${payment?.student?.user?.name || "el alumno"}. Es obligatorio adjuntar el comprobante.`}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3.5 pt-1">
            {mode === "add" && (
              <>
                <FormField
                  control={form.control}
                  name="studentId"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-1.5">
                      <FormLabel className="text-xs font-bold text-slate-700">Estudiante</FormLabel>
                      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between h-9 text-xs",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <span className="truncate">
                                {field.value
                                  ? metadata.students.find(
                                      (student: any) => student.studentProfile?.id === field.value
                                    )?.name
                                  : "Seleccione un estudiante"}
                              </span>
                              <ChevronsUpDown className="ml-2 h-3.5 w-3.5 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[360px] p-0" align="start">
                          <Command>
                            <CommandInput placeholder="Buscar estudiante..." className="text-xs" />
                            <CommandList>
                              <CommandEmpty className="text-xs py-4 text-center">No se encontró ningún estudiante.</CommandEmpty>
                              <CommandGroup>
                                {metadata.students.map((student: any) => (
                                  <CommandItem
                                    key={student.id}
                                    value={student.name}
                                    className="text-xs"
                                    onSelect={() => {
                                      const profileId = student.studentProfile?.id;
                                      field.onChange(profileId);
                                      setIsPopoverOpen(false);
                                      if (profileId) {
                                        getStudentFinancialSummary(profileId).then(res => {
                                          if (res.success && res.data) {
                                            setFinancialSummary(res.data);
                                            if (res.data.activePlans && res.data.activePlans.length > 0) {
                                              const plan = res.data.activePlans[0];
                                              const amountToPay = plan.customAmount || plan.plan?.amount;
                                              if (amountToPay) form.setValue("amount", String(amountToPay));
                                              if (plan.conceptId) form.setValue("conceptId", plan.conceptId);
                                              else if (plan.plan?.conceptId) form.setValue("conceptId", plan.plan.conceptId);
                                            }
                                          }
                                        });
                                      }
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-3.5 w-3.5",
                                        field.value === student.studentProfile?.id ? "opacity-100" : "opacity-0"
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Concepto y Monto en 2 columnas con límite de texto en el selector */}
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="conceptId"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5 min-w-0">
                        <FormLabel className="text-xs font-bold text-slate-700">Concepto</FormLabel>
                        <Select 
                          onValueChange={(val) => {
                            field.onChange(val);
                            const selected = metadata.concepts.find((c: any) => c.id === val);
                            if (selected) form.setValue("amount", String(selected.amount));
                          }} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full h-9 text-xs overflow-hidden">
                              <span className="truncate block text-left">
                                {field.value
                                  ? metadata.concepts.find((c: any) => c.id === field.value)?.name
                                  : "Concepto..."}
                              </span>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-60 max-w-[320px]">
                            {metadata.concepts.map((c: any) => (
                              <SelectItem key={c.id} value={c.id} className="text-xs">
                                <div className="flex items-center justify-between gap-2 w-full">
                                  <span className="truncate">{c.name}</span>
                                  <span className="font-semibold text-slate-400 shrink-0">
                                    (${Number(c.amount).toFixed(0)})
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5 min-w-0">
                        <FormLabel className="text-xs font-bold text-slate-700 truncate block">
                          Monto ($ MXN)
                        </FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="800.00" className="h-9 text-xs" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-xs font-bold text-slate-700">Fecha de Vencimiento</FormLabel>
                      <FormControl>
                        <Input type="date" className="h-9 text-xs" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {mode === "record" && (
              <>
                <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200 text-xs space-y-1.5 shadow-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Alumno:</span>
                    <strong className="text-slate-900">{payment?.student?.user?.name || "Estudiante"}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Concepto:</span>
                    <strong className="text-slate-800">{payment?.concept?.name || payment?.notes || "Colegiatura"}</strong>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-1.5 mt-1">
                    <span className="text-slate-500">Monto Adeudado:</span>
                    <strong className="text-sm font-black text-emerald-700">
                      ${parseFloat(String(payment?.amount || 0)).toFixed(2)} MXN
                    </strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Monto NO editable */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-xs font-bold text-slate-700">Monto Recibido</FormLabel>
                      <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                        <Lock className="h-2.5 w-2.5 text-slate-400" />
                        Bloqueado
                      </span>
                    </div>
                    <Input
                      type="text"
                      readOnly
                      disabled
                      value={`$ ${parseFloat(String(payment?.amount || 0)).toFixed(2)} MXN`}
                      className="h-9 text-xs font-black bg-slate-100/90 text-slate-900 border-slate-200 cursor-not-allowed select-none"
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="method"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-xs font-bold text-slate-700">Método de Pago</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-9 text-xs">
                              <SelectValue placeholder="Seleccione método" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="BANK_TRANSFER">Transferencia Bancaria</SelectItem>
                            <SelectItem value="CASH">Efectivo en Sede</SelectItem>
                            <SelectItem value="CARD">Tarjeta (Terminal física)</SelectItem>
                            <SelectItem value="ONLINE">Stripe / En Línea</SelectItem>
                            <SelectItem value="CHECK">Cheque</SelectItem>
                            <SelectItem value="OTHER">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="reference"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-xs font-bold text-slate-700">
                          Número de Referencia / Folio / Autorización
                        </FormLabel>
                        <span className="text-[10px] text-slate-400 font-medium">Opcional</span>
                      </div>
                      <FormControl>
                        <Input 
                          placeholder="Ej: SPEI-984214 o Folio de recibo" 
                          className="h-9 text-xs" 
                          {...field} 
                        />
                      </FormControl>
                      <p className="text-[11px] text-slate-500">
                        *Si se deja vacío, el sistema asignará un folio automático (ej. REC-{new Date().getFullYear()}...).
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* ─── Comprobante Obligatorio (PDF o Imagen) ─── */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between">
                    <FormLabel className="flex items-center gap-1 text-slate-900 font-bold text-xs">
                      <span>Comprobante de Pago</span>
                      <span className="text-red-500">* (Obligatorio)</span>
                    </FormLabel>
                    <span className="text-[10px] text-slate-400 font-medium">PDF, JPG, PNG, WEBP</span>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/jpeg,image/png,image/webp,image/jpg,application/pdf"
                    className="hidden"
                  />

                  <div
                    onClick={() => !isCompressing && fileInputRef.current?.click()}
                    className={`flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                      isCompressing
                        ? "border-amber-400 bg-amber-50/50 cursor-wait"
                        : receiptFile || receiptPreviewUrl
                        ? "border-emerald-400 bg-emerald-50/60 hover:bg-emerald-50"
                        : "border-slate-300 hover:border-[#0066cc] bg-slate-50 hover:bg-blue-50/30"
                    }`}
                  >
                    {isCompressing ? (
                      <Loader2 className="h-6 w-6 mb-2 text-amber-600 animate-spin" />
                    ) : receiptFile ? (
                      receiptFile.type === "application/pdf" || receiptFile.name.toLowerCase().endsWith(".pdf") ? (
                        <FileText className="h-7 w-7 mb-1 text-red-600" />
                      ) : (
                        <ImageIcon className="h-7 w-7 mb-1 text-emerald-600" />
                      )
                    ) : receiptPreviewUrl ? (
                      receiptPreviewUrl.toLowerCase().includes(".pdf") ? (
                        <FileText className="h-7 w-7 mb-1 text-red-600" />
                      ) : (
                        <FileCheck className="h-7 w-7 mb-1 text-emerald-600" />
                      )
                    ) : (
                      <Upload className="h-6 w-6 mb-2 text-slate-400" />
                    )}

                    {isCompressing ? (
                      <div className="text-center">
                        <p className="text-xs font-bold text-amber-800">Optimizando archivo...</p>
                        <p className="text-[11px] text-amber-600">Procesando para subida rápida y segura</p>
                      </div>
                    ) : receiptFile ? (
                      <div className="text-center space-y-1">
                        <div className="flex items-center justify-center gap-1.5">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            receiptFile.type === "application/pdf" || receiptFile.name.toLowerCase().endsWith(".pdf")
                              ? "bg-red-100 text-red-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}>
                            {receiptFile.type === "application/pdf" || receiptFile.name.toLowerCase().endsWith(".pdf") ? "DOCUMENTO PDF" : "IMAGEN"}
                          </span>
                          <p className="text-xs font-bold text-slate-800 truncate max-w-[220px]">{receiptFile.name}</p>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          {(receiptFile.size / 1024).toFixed(1)} KB • Clic para cambiar archivo
                        </p>
                      </div>
                    ) : receiptPreviewUrl ? (
                      <div className="text-center space-y-1">
                        <p className="text-xs font-bold text-emerald-800 flex items-center justify-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          Comprobante adjuntado previamente
                        </p>
                        <p className="text-[11px] text-emerald-600">Clic para seleccionar un nuevo archivo (PDF o Imagen)</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="text-xs font-semibold text-slate-700">Subir imagen o documento PDF del comprobante</p>
                        <p className="text-[11px] text-slate-400">Captura de transferencia, ticket o recibo en PDF</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas / Observaciones</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Observaciones adicionales..." className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isPending || isUploadingFile || isCompressing || (mode === "record" && !receiptFile && !receiptPreviewUrl)}
                className={mode === "record" ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-[#0066cc] hover:bg-[#0055aa] text-white"}
              >
                {(isPending || isUploadingFile || isCompressing) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === "record" ? "Confirmar y Marcar como Pagado" : "Guardar Cobro"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Modal para Enviar Link de Pago Asistido (Stripe + WhatsApp) ───
export function SendPaymentLinkDialog({ payment }: { payment: any }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [linkData, setLinkData] = useState<{
    paymentUrl?: string | null;
    whatsappUrl?: string;
    studentName?: string;
    amount?: number;
    conceptName?: string;
  } | null>(null);

  const handleGenerateLink = async () => {
    setIsLoading(true);
    const res = await generateAssistedPaymentLink(payment.id);
    setIsLoading(false);

    if (res.success && res.data) {
      setLinkData(res.data);
    } else {
      toast.error(res.error || "No se pudo generar el enlace de Stripe.");
    }
  };

  const handleCopyLink = () => {
    if (linkData?.paymentUrl) {
      navigator.clipboard.writeText(linkData.paymentUrl);
      toast.success("Enlace de pago copiado al portapapeles");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val);
      if (val && !linkData) {
        handleGenerateLink();
      }
    }}>
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button size="icon" variant="ghost" className="h-8 w-8 text-[#0066cc] hover:text-[#0055aa] hover:bg-blue-50 rounded-lg">
                <Send className="h-4 w-4" />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs">Enviar link de pago Stripe</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-slate-900">
            <CreditCard className="h-5 w-5 text-[#0066cc]" />
            Link de Pago Asistido (Stripe)
          </DialogTitle>
          <DialogDescription>
            Genera un enlace con el valor exacto de la cuenta de {payment?.student?.user?.name} para enviárselo por WhatsApp o copiarlo.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="py-8 flex flex-col items-center justify-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-[#0066cc]" />
            <p className="text-xs text-slate-500">Conectando con Stripe y generando sesión segura...</p>
          </div>
        ) : linkData ? (
          <div className="space-y-4 pt-2">
            {/* Info Box */}
            <div className="rounded-xl bg-blue-50/70 p-4 border border-blue-200/80 space-y-1.5 text-xs text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Alumno:</span>
                <span className="font-bold text-slate-900">{linkData.studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Concepto:</span>
                <span className="font-semibold text-slate-800">{linkData.conceptName}</span>
              </div>
              <div className="flex justify-between border-t border-blue-200 pt-1.5 mt-1.5">
                <span className="text-slate-500 font-medium">Monto a Cobrar:</span>
                <span className="font-black text-base text-[#0066cc]">
                  ${(linkData.amount || 0).toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN
                </span>
              </div>
            </div>

            {/* Link Copy Box */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Enlace de Stripe Checkout:</label>
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={linkData.paymentUrl || ""}
                  className="text-xs font-mono bg-slate-50 select-all"
                />
                <Button size="sm" variant="outline" onClick={handleCopyLink} className="shrink-0 gap-1">
                  <Copy className="h-3.5 w-3.5" />
                  Copiar
                </Button>
              </div>
            </div>

            {/* Direct WhatsApp Share */}
            <div className="pt-2">
              <a
                href={linkData.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3 px-4 shadow-sm transition-all text-sm"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Enviar por WhatsApp al Alumno</span>
              </a>
            </div>

            <p className="text-[11px] text-slate-500 text-center leading-relaxed">
              *En cuanto el alumno complete el pago en Stripe, el sistema lo marcará automáticamente como <strong>PAGADO</strong> en tiempo real.
            </p>
          </div>
        ) : (
          <div className="py-6 text-center text-sm text-red-600">
            No se pudo generar el enlace. Por favor verifica tus credenciales de Stripe en .env.local.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ─── Modal para Revertir Pago (Marcar de nuevo como Pendiente) ───
export function RevertPaymentDialog({ payment }: { payment: any }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [reason, setReason] = useState("");
  const router = useRouter();

  const handleRevert = () => {
    startTransition(async () => {
      const res = await revertPayment(payment.id, reason);
      if (res.success) {
        toast.success("Pago revertido con éxito. El estado volvió a Pendiente.");
        setOpen(false);
        router.refresh();
      } else {
        toast.error(res.error || "Error al revertir el pago.");
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs">Revertir pago a pendiente</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-amber-800">
            <ShieldAlert className="h-5 w-5 text-amber-600" />
            ¿Revertir este pago a Pendiente?
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <span>
              Esta acción revertirá el pago de <strong>{payment?.student?.user?.name}</strong> (${parseFloat(String(payment?.amountPaid || payment?.amount || 0)).toFixed(2)} MXN).
            </span>
            <span className="block text-xs text-slate-500">
              El estado volverá a <strong>PENDIENTE</strong>, se borrará la fecha de cobro y el alumno volverá a tener el saldo pendiente en su cuenta.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-2">
          <label className="text-xs font-semibold text-slate-700 mb-1 block">Motivo de la reversión (Opcional):</label>
          <Input
            placeholder="Ej: Error en el comprobante / Pago cancelado"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="text-xs"
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleRevert}
            disabled={isPending}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirmar Reversión
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
