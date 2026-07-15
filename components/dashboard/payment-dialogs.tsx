"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { PlusCircle, Edit2, Trash2, Loader2, Check, ChevronsUpDown } from "lucide-react";
import { createPayment, recordPayment, deletePayment, getPaymentMetadata, getStudentFinancialSummary } from "@/app/dashboard/pagos/actions";
import { toast } from "sonner";
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
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

interface PaymentDialogProps {
  mode: "add" | "edit" | "delete" | "record";
  payment?: any;
}

export function PaymentDialog({ mode, payment }: PaymentDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSuccess() {
    setOpen(false);
    const toastId = toast.loading("Actualizando tabla...");
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
      amountPaid: payment?.amountPaid?.toString() || payment?.amount?.toString() || "",
      method: payment?.method || "CASH",
      reference: payment?.reference || "",
    },
  });

  const onSubmit = (values: PaymentFormValues) => {
    startTransition(async () => {
      let promise;
      if (mode === "record") {
        promise = recordPayment(payment.id, {
          amountPaid: parseFloat(values.amountPaid || "0"),
          method: values.method || "CASH",
          reference: values.reference,
        });
      } else if (mode === "add") {
        promise = createPayment({
          ...values,
          cycleId: values.cycleId || undefined,
          conceptId: values.conceptId || undefined,
          amount: parseFloat(values.amount),
        });
      } else {
        toast.error("Edición no implementada aún para pagos complejos");
        return;
      }

      await toast.promise(promise, {
        loading: mode === "record" ? "Registrando pago..." : "Creando cobro...",
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
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
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
      <DialogTrigger asChild>
        {mode === "add" ? (
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nuevo Pago
          </Button>
        ) : mode === "record" ? (
          <Button size="sm" variant="outline" className="h-8">
            <Check className="mr-2 h-4 w-4" />
            Registrar Pago
          </Button>
        ) : (
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Edit2 className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Crear Nuevo Cobro" : mode === "record" ? "Registrar Pago Recibido" : "Editar Pago"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add" 
              ? "Genera una nueva obligación de pago para un estudiante." 
              : "Confirma la recepción del dinero y el método de pago."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            {mode === "add" && (
              <>
                <FormField
                  control={form.control}
                  name="studentId"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Estudiante</FormLabel>
                      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? metadata.students.find(
                                    (student: any) => student.studentProfile?.id === field.value
                                  )?.name
                                : "Seleccione un estudiante"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[400px] p-0" align="start">
                          <Command>
                            <CommandInput placeholder="Buscar estudiante..." />
                            <CommandList>
                              <CommandEmpty>No se encontró ningún estudiante.</CommandEmpty>
                              <CommandGroup>
                                {metadata.students.map((student: any) => (
                                  <CommandItem
                                    key={student.id}
                                    value={student.name} // CommandItem matches against value
                                    onSelect={() => {
                                      const profileId = student.studentProfile?.id;
                                      field.onChange(profileId);
                                      setIsPopoverOpen(false);
                                      if (profileId) {
                                        getStudentFinancialSummary(profileId).then(res => {
                                          if (res.success) {
                                            setFinancialSummary(res.data);
                                            // Prefill amount and concept if possible
                                            if (res.data.activePlans?.length > 0) {
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
                                        "mr-2 h-4 w-4",
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

                {/* Resumen Financiero */}
                {financialSummary && (
                  <div className="bg-slate-50 border rounded-lg p-3 text-sm space-y-3">
                    <div>
                      <h4 className="font-semibold mb-1">Plan de Pago Actual</h4>
                      {financialSummary.activePlans?.length > 0 ? (
                        financialSummary.activePlans.map((p: any) => (
                          <div key={p.id} className="flex justify-between items-center text-slate-600">
                            <span>{p.plan?.name}</span>
                            <span className="font-medium text-slate-900">${p.customAmount || p.plan?.amount}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground italic">Sin plan de pago activo.</p>
                      )}
                    </div>
                    
                    {financialSummary.pendingPayments?.length > 0 && (
                      <div className="pt-2 border-t">
                        <h4 className="font-semibold mb-1 text-amber-700">Deudas Pendientes</h4>
                        {financialSummary.pendingPayments.slice(0, 3).map((debt: any) => (
                          <div key={debt.id} className="flex justify-between items-center text-amber-600">
                            <span>{debt.concept?.name || "Cobro"} ({new Date(debt.dueDate).toLocaleDateString()})</span>
                            <span className="font-medium">${debt.amount}</span>
                          </div>
                        ))}
                        {financialSummary.pendingPayments.length > 3 && (
                          <p className="text-xs text-amber-700/80 mt-1">
                            + {financialSummary.pendingPayments.length - 3} cobros más pendientes.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                    control={form.control}
                    name="conceptId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Concepto</FormLabel>
                        <Select 
                          onValueChange={(val) => {
                            field.onChange(val);
                            // Auto-fill amount based on selected concept
                            const selectedConcept = metadata.concepts.find((c: any) => c.id === val);
                            if (selectedConcept && selectedConcept.amount !== undefined) {
                              form.setValue("amount", String(selectedConcept.amount));
                            }
                          }} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione concepto" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {metadata.concepts.map((concept: any) => (
                              <SelectItem key={concept.id} value={concept.id}>
                                {concept.name}
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
                      <FormItem>
                        <FormLabel>Monto</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="0.00" {...field} />
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
                    <FormItem>
                      <FormLabel>Fecha de Vencimiento</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {mode === "record" && (
              <>
                <div className="bg-slate-50 p-3 rounded-lg mb-4 text-sm">
                  <p><strong>Estudiante:</strong> {payment?.student?.user?.name}</p>
                  <p><strong>Concepto:</strong> {payment?.concept?.name || "N/A"}</p>
                  <p><strong>Monto Total:</strong> ${payment?.amount}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="amountPaid"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Monto Pagado</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="method"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Método de Pago</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione método" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="CASH">Efectivo</SelectItem>
                            <SelectItem value="BANK_TRANSFER">Transferencia</SelectItem>
                            <SelectItem value="CARD">Tarjeta</SelectItem>
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
                    <FormItem>
                      <FormLabel>Referencia / Comprobante</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej. # Transacción, Recibo..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas</FormLabel>
                  <FormControl>
                    <Textarea placeholder="..." className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === "add" ? "Crear Cobro" : mode === "record" ? "Confirmar Pago" : "Guardar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
