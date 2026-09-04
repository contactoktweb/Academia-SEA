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
import { PlusCircle, Loader2, FileText, BookOpen, User, Calendar } from "lucide-react";
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
import { 
  getCoursesForReport, 
  getStudentsForReport, 
  getCyclesForSelect, 
  generateReportCard 
} from "@/app/dashboard/boletas/actions";
import { toast } from "sonner";

const generateSchema = z.object({
  courseId: z.string().min(1, "Selecciona un curso"),
  studentProfileId: z.string().min(1, "Selecciona un estudiante"),
  cycleId: z.string().optional(),
});

type GenerateFormValues = z.infer<typeof generateSchema>;

export function GenerateReportDialog({ userName }: { userName: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [courses, setCourses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [cycles, setCycles] = useState<any[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const router = useRouter();

  const form = useForm<GenerateFormValues>({
    resolver: zodResolver(generateSchema),
    defaultValues: {
      courseId: "",
      studentProfileId: "",
      cycleId: "none",
    },
  });

  const selectedCourseId = form.watch("courseId");

  // 1. Cargar cursos al abrir el diálogo
  useEffect(() => {
    if (open) {
      setLoadingCourses(true);
      getCoursesForReport()
        .then((res) => {
          if (res.success && res.data) {
            setCourses(res.data);
            // Si el docente solo tiene 1 curso asignado, preseleccionarlo automáticamente
            if (res.data.length === 1) {
              form.setValue("courseId", res.data[0].id, { shouldValidate: true });
            }
          }
        })
        .finally(() => setLoadingCourses(false));

      getCyclesForSelect().then((res) => {
        if (res.success) setCycles(res.data || []);
      });
    }
  }, [open, form]);

  // 2. Al cambiar el curso, cargar únicamente los alumnos de ese curso
  useEffect(() => {
    if (open && selectedCourseId) {
      setLoadingStudents(true);
      form.setValue("studentProfileId", "");
      getStudentsForReport(selectedCourseId)
        .then((res) => {
          if (res.success) {
            setStudents(res.data || []);
          }
        })
        .finally(() => setLoadingStudents(false));
    }
  }, [open, selectedCourseId, form]);

  function onSubmit(values: GenerateFormValues) {
    startTransition(async () => {
      const promise = generateReportCard({
        courseId: values.courseId === "all" ? undefined : values.courseId,
        studentProfileId: values.studentProfileId,
        cycleId: values.cycleId === "none" ? undefined : values.cycleId,
        authorName: userName,
      });

      await toast.promise(promise, {
        loading: "Compilando calificaciones y generando boleta...",
        success: (result: any) => {
          if (result.success) {
            setOpen(false);
            form.reset();
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
        <Button className="bg-[#0066cc] hover:bg-[#0055aa] text-white font-bold shadow-xs">
          <FileText className="mr-2 h-4 w-4" />
          Generar Boleta
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-900">Generar Boleta de Calificaciones</DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Selecciona el curso asignado y el estudiante para compilar las calificaciones oficiales.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-3">
            {/* 1. Selector de Curso asignado */}
            <FormField
              control={form.control}
              name="courseId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5 text-[#0066cc]" />
                    Curso Asignado
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder={loadingCourses ? "Cargando cursos..." : "Selecciona el curso..."} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {courses.map((c) => (
                        <SelectItem key={c.id} value={c.id} className="text-xs">
                          {c.name} {c.level ? `(${c.level})` : ""}
                        </SelectItem>
                      ))}
                      {!loadingCourses && courses.length === 0 && (
                        <SelectItem value="none" disabled className="text-xs">
                          No tienes cursos asignados actualmente
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 2. Selector de Estudiante (filtrado estrictamente por el curso) */}
            <FormField
              control={form.control}
              name="studentProfileId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-[#0066cc]" />
                    Estudiante del Curso
                  </FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                    disabled={!selectedCourseId || loadingStudents}
                  >
                    <FormControl>
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue 
                          placeholder={
                            !selectedCourseId 
                              ? "Primero selecciona un curso..." 
                              : loadingStudents 
                              ? "Cargando alumnos del curso..." 
                              : "Selecciona un estudiante..."
                          } 
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {students.map((s) => (
                        <SelectItem key={s.id} value={s.id} className="text-xs">
                          {s.displayName || s.name}
                        </SelectItem>
                      ))}
                      {!loadingStudents && students.length === 0 && selectedCourseId && (
                        <SelectItem value="none" disabled className="text-xs">
                          No hay alumnos inscritos en este curso
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 3. Ciclo Escolar */}
            <FormField
              control={form.control}
              name="cycleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    Ciclo Escolar (Opcional)
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Todos los ciclos" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none" className="text-xs">Todos los ciclos (Historial completo)</SelectItem>
                      {cycles.map((c) => (
                        <SelectItem key={c.id} value={c.id} className="text-xs">{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="h-9 text-xs">
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isPending || !selectedCourseId || !form.watch("studentProfileId")}
                className="bg-[#0066cc] hover:bg-[#0055aa] text-white h-9 text-xs font-bold"
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generar Boleta
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
