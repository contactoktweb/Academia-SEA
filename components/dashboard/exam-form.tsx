"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTransition, useState, useEffect } from "react";
import { createExam, updateExam, getCoursesWithUnits } from "@/app/dashboard/evaluaciones/actions";
import { toast } from "sonner";
import { Loader2, Award, Percent, BookOpen } from "lucide-react";

const examSchema = z.object({
  courseId: z.string().min(1, "Selecciona un curso"),
  unitName: z.string().min(1, "Escribe el nombre de la unidad (ej. Unidad 1)"),
  title: z.string().min(2, "El título es muy corto"),
  type: z.string().min(1, "Selecciona un tipo"),
  examDate: z.string().optional(),
});

type ExamFormValues = z.infer<typeof examSchema>;

interface ExamFormProps {
  initialData?: any;
  onSuccess: () => void;
}

export function ExamForm({ initialData, onSuccess }: ExamFormProps) {
  const [isPending, startTransition] = useTransition();
  const [courses, setCourses] = useState<any[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  const form = useForm<ExamFormValues>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      courseId: initialData?.unit?.courseId || "",
      unitName: initialData?.unit?.name || "",
      title: initialData?.title || "",
      type: initialData?.type || "EXAM",
      examDate: initialData?.examDate 
        ? new Date(initialData.examDate).toISOString().split('T')[0] 
        : new Date().toISOString().split('T')[0],
    },
  });

  useEffect(() => {
    setLoadingCourses(true);
    getCoursesWithUnits().then((res) => {
      if (res.success && res.data) {
        setCourses(res.data);
        // Si no hay curso seleccionado y el docente solo tiene 1 curso asignado, preseleccionarlo
        const currentCourseId = form.getValues("courseId");
        if (!currentCourseId && res.data.length === 1) {
          form.setValue("courseId", res.data[0].id, { shouldValidate: true });
        }
      }
      setLoadingCourses(false);
    }).catch(() => {
      setLoadingCourses(false);
    });
  }, [form]);

  function onSubmit(values: ExamFormValues) {
    startTransition(async () => {
      const submitData = {
        courseId: values.courseId,
        unitName: values.unitName.trim(),
        title: values.title.trim(),
        type: values.type,
        maxScore: initialData?.maxScore !== undefined ? initialData.maxScore : 100, // Informativo y fijo por requerimiento
        weight: initialData?.weight !== undefined ? initialData.weight : 1.0,  // Ponderación estándar fija
        examDate: values.examDate || undefined,
      };

      const promise = initialData 
        ? updateExam(initialData.id, submitData) 
        : createExam(submitData);

      await toast.promise(promise, {
        loading: initialData ? "Actualizando evaluación..." : "Creando evaluación...",
        success: (result: any) => {
          if (result.success) {
            onSuccess();
            return initialData ? "Evaluación actualizada" : "Evaluación creada";
          }
          throw new Error(result.error);
        },
        error: (err) => err.message || "Error en la operación",
      });
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. Selector de Curso (Solo cursos asignados al profesor) */}
          <FormField
            control={form.control}
            name="courseId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-[#0066cc]" />
                  Curso Asignado
                </FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder={loadingCourses ? "Cargando cursos..." : "Seleccionar curso asignado..."} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {courses.map((c) => (
                      <SelectItem key={c.id} value={c.id} className="text-xs">
                        {c.name}
                      </SelectItem>
                    ))}
                    {courses.length === 0 && (
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

          {/* 2. Unidad como texto a escribir */}
          <FormField
            control={form.control}
            name="unitName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold text-slate-700">
                  Unidad
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Ej. Unidad 1, Unit 1, Parcial 1..." 
                    className="h-9 text-xs"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 3. Título de la Evaluación */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className="text-xs font-bold text-slate-700">
                  Título de la Evaluación
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Ej. Examen Parcial 1, Quiz de Vocabulario..." 
                    className="h-9 text-xs"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 4. Tipo de Evaluación */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold text-slate-700">
                  Tipo
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Tipo de evaluación" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="EXAM" className="text-xs">Examen</SelectItem>
                    <SelectItem value="QUIZ" className="text-xs">Quiz / Prueba corta</SelectItem>
                    <SelectItem value="PROJECT" className="text-xs">Proyecto</SelectItem>
                    <SelectItem value="HOMEWORK" className="text-xs">Tarea</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 5. Fecha de Aplicación */}
          <FormField
            control={form.control}
            name="examDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold text-slate-700">
                  Fecha de Aplicación
                </FormLabel>
                <FormControl>
                  <Input type="date" className="h-9 text-xs" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 6. Puntaje Máximo y Peso en Promedio (Informativo, no editable) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 border border-slate-200/90 rounded-xl p-3.5 shadow-2xs mt-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center text-[#0066cc] shrink-0 font-black text-sm">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-extrabold text-slate-800 block">
                Puntaje Máximo: 100 Pts
              </span>
              <span className="text-[11px] text-slate-500 block">
                Calificación estándar sobre base de 0 a 100.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 font-black text-sm">
              <Percent className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-extrabold text-slate-800 block">
                Peso en Promedio: 1.0 (100%)
              </span>
              <span className="text-[11px] text-slate-500 block">
                Ponderación proporcional automática.
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200/80">
          <Button type="button" variant="outline" onClick={() => onSuccess()} className="h-9 text-xs font-semibold">
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending} className="bg-[#0066cc] hover:bg-[#0055aa] text-white h-9 text-xs font-bold shadow-xs">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Guardar Cambios" : "Crear Evaluación"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
