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
import { UserX, Edit2, Trash2, Loader2, Info } from "lucide-react";
import { recordAttendance, deleteAttendance, getStudentsForAttendance } from "@/app/dashboard/asistencia/actions";
import { toast } from "sonner";

const attendanceSchema = z.object({
  studentId: z.string().min(1, "Seleccione un estudiante"),
  date: z.string().min(1, "Seleccione una fecha"),
  status: z.enum(["ABSENT", "EXCUSED", "LATE"], {
    errorMap: () => ({ message: "Seleccione el tipo de inasistencia" }),
  }),
  notes: z.string().optional(),
});

type AttendanceFormValues = z.infer<typeof attendanceSchema>;

interface AttendanceDialogProps {
  mode: "add" | "edit" | "delete";
  attendance?: any;
}

export function AttendanceDialog({ mode, attendance }: AttendanceDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const router = useRouter();

  function handleSuccess() {
    setOpen(false);
    const toastId = toast.loading("Actualizando registros...");
    startTransition(() => {
      router.refresh();
      toast.dismiss(toastId);
      toast.success("Datos actualizados");
    });
  }

  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    if (open && (mode === "add" || mode === "edit")) {
      setIsLoadingStudents(true);
      getStudentsForAttendance()
        .then((result) => {
          if (result.success) setStudents(result.data || []);
        })
        .finally(() => setIsLoadingStudents(false));
    }
  }, [open, mode]);

  const form = useForm<AttendanceFormValues>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      studentId: attendance?.studentId || "",
      date: attendance?.date 
        ? new Date(attendance.date).toISOString().split('T')[0] 
        : new Date().toISOString().split('T')[0],
      status: attendance?.status && attendance.status !== "PRESENT" ? attendance.status : "ABSENT",
      notes: attendance?.notes || "",
    },
  });

  const onSubmit = (values: AttendanceFormValues) => {
    startTransition(async () => {
      const promise = recordAttendance(values);
      await toast.promise(promise, {
        loading: "Registrando inasistencia...",
        success: (result: any) => {
          if (result.success) {
            handleSuccess();
            return mode === "add" ? "Inasistencia registrada" : "Inasistencia actualizada";
          }
          throw new Error(result.error);
        },
        error: (err) => err.message || "Error al registrar la inasistencia",
      });
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      const promise = deleteAttendance(attendance.id);
      await toast.promise(promise, {
        loading: "Eliminando inasistencia...",
        success: (result: any) => {
          if (result.success) {
            handleSuccess();
            return "Inasistencia eliminada. Asistencia normal restablecida.";
          }
          throw new Error(result.error);
        },
        error: (err) => err.message || "Error al eliminar la inasistencia",
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
            <AlertDialogTitle>¿Eliminar inasistencia?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el reporte de inasistencia de <strong>{attendance?.student?.user?.name}</strong> para el día {new Date(attendance?.date).toLocaleDateString()}. El estudiante volverá a contar con asistencia normal en dicha fecha.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Eliminar Inasistencia
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
          <Button className="bg-[#0066cc] hover:bg-[#0055aa] text-white">
            <UserX className="mr-2 h-4 w-4" />
            Registrar Inasistencia
          </Button>
        ) : (
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Edit2 className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Registrar Inasistencia" : "Editar Inasistencia"}</DialogTitle>
          <DialogDescription>
            Indique la falta o inasistencia del estudiante para la fecha seleccionada.
          </DialogDescription>
        </DialogHeader>

        {/* Nota explicativa de negocio */}
        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-blue-50/80 border border-blue-200/80 text-blue-900 text-xs mt-1">
          <Info className="h-4 w-4 text-[#0066cc] shrink-0 mt-0.5" />
          <p>
            <strong>Asistencia por Excepción:</strong> Todos los estudiantes cuentan con asistencia por defecto. Solo es necesario registrar a aquellos alumnos que hayan faltado o llegado tarde.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <FormField
              control={form.control}
              name="studentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-slate-700">Estudiante</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={mode === "edit"}>
                    <FormControl>
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder={isLoadingStudents ? "Cargando alumnos..." : "Seleccione un estudiante"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {students.map((student) => {
                        const profileId = student.studentProfile?.id || "";
                        const enrollments = student.studentProfile?.enrollments || [];
                        const courseInfo = enrollments.length > 0
                          ? ` (${enrollments[0].course?.name || "Curso"}${enrollments[0].group?.name ? ` - ${enrollments[0].group.name}` : ""})`
                          : "";
                        return (
                          <SelectItem key={student.id} value={profileId} className="text-xs">
                            {student.name}{courseInfo}
                          </SelectItem>
                        );
                      })}
                      {!isLoadingStudents && students.length === 0 && (
                        <SelectItem value="none" disabled className="text-xs">
                          No se encontraron estudiantes
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-slate-700">Fecha de Inasistencia</FormLabel>
                    <FormControl>
                      <Input type="date" className="h-9 text-xs" {...field} disabled={mode === "edit"} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-slate-700">Tipo de Inasistencia</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-9 text-xs">
                          <SelectValue placeholder="Seleccione el estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ABSENT" className="text-xs">
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-red-500" />
                            <span className="font-semibold text-red-700">Inasistencia / Falta</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="EXCUSED" className="text-xs">
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-blue-500" />
                            <span className="font-semibold text-blue-700">Falta Justificada</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="LATE" className="text-xs">
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-amber-500" />
                            <span className="font-semibold text-amber-700">Retardo / Tardanza</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-slate-700">Motivo / Observaciones (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Ej. Justificante médico entregado, aviso de ausencia familiar..." 
                      className="text-xs min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="h-9 text-xs">
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending} className="bg-[#0066cc] hover:bg-[#0055aa] text-white h-9 text-xs font-bold">
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === "add" ? "Registrar Inasistencia" : "Guardar Cambios"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
