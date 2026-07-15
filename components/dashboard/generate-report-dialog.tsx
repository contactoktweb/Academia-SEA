"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2, FileText } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { getStudentsForSelect, getCyclesForSelect, generateReportCard } from "@/app/dashboard/boletas/actions";
import { toast } from "sonner";

const generateSchema = z.object({
  studentProfileId: z.string().min(1, "Selecciona un estudiante"),
  cycleId: z.string().optional(),
});

type GenerateFormValues = z.infer<typeof generateSchema>;

export function GenerateReportDialog({ userName }: { userName: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [students, setStudents] = useState<any[]>([]);
  const [cycles, setCycles] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      getStudentsForSelect().then((res) => {
        if (res.success) setStudents(res.data || []);
      });
      getCyclesForSelect().then((res) => {
        if (res.success) setCycles(res.data || []);
      });
    }
  }, [open]);

  const form = useForm<GenerateFormValues>({
    resolver: zodResolver(generateSchema),
    defaultValues: {
      studentProfileId: "",
      cycleId: "none",
    },
  });

  function onSubmit(values: GenerateFormValues) {
    startTransition(async () => {
      const promise = generateReportCard({
        studentProfileId: values.studentProfileId,
        cycleId: values.cycleId === "none" ? undefined : values.cycleId,
        authorName: userName,
      });

      await toast.promise(promise, {
        loading: "Generando boleta...",
        success: (result: any) => {
          if (result.success) {
            setOpen(false);
            form.reset();
            // Open print view in new tab or navigate
            // router.push(`/dashboard/boletas/print/${result.data.id}`);
            window.open(`/dashboard/boletas/print/${result.data.id}`, "_blank");
            return "Boleta generada exitosamente";
          }
          throw new Error(result.error);
        },
        error: (err) => err.message || "Error al generar la boleta",
      });
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          Generar Boleta
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Generar Boleta de Calificaciones</DialogTitle>
          <DialogDescription>
            Selecciona el estudiante y el ciclo escolar para compilar las calificaciones y generar el PDF.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="studentProfileId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estudiante</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un estudiante..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {students.map((s) => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                      ))}
                      {students.length === 0 && <SelectItem value="none" disabled>Cargando estudiantes...</SelectItem>}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cycleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ciclo Escolar (Opcional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos los ciclos" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Todos los ciclos (Historial completo)</SelectItem>
                      {cycles.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                Generar Documento
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
