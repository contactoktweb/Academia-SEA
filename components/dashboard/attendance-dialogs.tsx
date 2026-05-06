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
import { PlusCircle, Edit2, Trash2, Loader2 } from "lucide-react";
import { recordAttendance, deleteAttendance, getStudentsForAttendance } from "@/app/dashboard/asistencia/actions";
import { toast } from "sonner";

const attendanceSchema = z.object({
  studentId: z.string().min(1, "Seleccione un estudiante"),
  date: z.string().min(1, "Seleccione una fecha"),
  status: z.string().min(1, "Seleccione el estado"),
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
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    if (open && (mode === "add" || mode === "edit")) {
      const fetchStudents = async () => {
        const result = await getStudentsForAttendance();
        if (result.success) setStudents(result.data || []);
      };
      fetchStudents();
    }
  }, [open, mode]);

  const form = useForm<AttendanceFormValues>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      studentId: attendance?.studentId || "",
      date: attendance?.date ? new Date(attendance.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      status: attendance?.status || "PRESENT",
      notes: attendance?.notes || "",
    },
  });

  const onSubmit = (values: AttendanceFormValues) => {
    startTransition(async () => {
      const promise = recordAttendance(values);
      await toast.promise(promise, {
        loading: "Registrando asistencia...",
        success: (result: any) => {
          if (result.success) {
            handleSuccess();
            return mode === "add" ? "Asistencia registrada" : "Asistencia actualizada";
          }
          throw new Error(result.error);
        },
        error: (err) => err.message || "Error al registrar la asistencia",
      });
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      const promise = deleteAttendance(attendance.id);
      await toast.promise(promise, {
        loading: "Eliminando registro...",
        success: (result: any) => {
          if (result.success) {
            handleSuccess();
            return "Registro eliminado correctamente";
          }
          throw new Error(result.error);
        },
        error: (err) => err.message || "Error al eliminar el registro",
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
            <AlertDialogTitle>¿Eliminar registro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el registro de asistencia de {attendance?.student?.user?.name} para el día {new Date(attendance?.date).toLocaleDateString()}.
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
            Registrar Asistencia
          </Button>
        ) : (
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Edit2 className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Registrar Asistencia" : "Editar Asistencia"}</DialogTitle>
          <DialogDescription>
            Indique el estado de asistencia del estudiante para la fecha seleccionada.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="studentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estudiante</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={mode === "edit"}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un estudiante" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.studentProfile?.id || ""}>
                          {student.name}
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
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} disabled={mode === "edit"} />
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
                  <FormLabel>Estado</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione el estado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PRESENT">Presente</SelectItem>
                      <SelectItem value="ABSENT">Ausente</SelectItem>
                      <SelectItem value="LATE">Tarde</SelectItem>
                      <SelectItem value="EXCUSED">Excusado</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas / Observaciones</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Ej. El alumno llegó tarde por transporte..." {...field} />
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
                {mode === "add" ? "Registrar" : "Guardar Cambios"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
