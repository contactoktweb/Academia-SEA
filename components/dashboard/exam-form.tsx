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
import { Loader2 } from "lucide-react";

const examSchema = z.object({
  courseId: z.string().min(1, "Selecciona un curso"),
  unitId: z.string().min(1, "Selecciona una unidad"),
  title: z.string().min(2, "El título es muy corto"),
  type: z.string().min(1, "Selecciona un tipo"),
  maxScore: z.coerce.number().min(1, "El puntaje debe ser mayor a 0"),
  weight: z.coerce.number().min(0, "El peso debe ser 0 o mayor"),
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
  const [selectedCourseId, setSelectedCourseId] = useState<string>(initialData?.unit?.courseId || "");

  useEffect(() => {
    getCoursesWithUnits().then(res => {
      if (res.success && res.data) {
        setCourses(res.data);
      }
    });
  }, []);

  const form = useForm<ExamFormValues>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      courseId: initialData?.unit?.courseId || "",
      unitId: initialData?.unitId || "",
      title: initialData?.title || "",
      type: initialData?.type || "EXAM",
      maxScore: initialData?.maxScore || 100,
      weight: initialData?.weight || 1,
      examDate: initialData?.examDate ? new Date(initialData.examDate).toISOString().split('T')[0] : "",
    },
  });

  const selectedCourse = courses.find(c => c.id === selectedCourseId);
  const units = selectedCourse?.units || [];

  function onSubmit(values: ExamFormValues) {
    startTransition(async () => {
      // Omit courseId as it's not in the schema for Exam (only unitId is)
      const { courseId, ...submitData } = values;
      
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
          <FormField
            control={form.control}
            name="courseId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Curso</FormLabel>
                <Select 
                  onValueChange={(val) => {
                    field.onChange(val);
                    setSelectedCourseId(val);
                    form.setValue("unitId", ""); // reset unit when course changes
                  }} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar curso..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {courses.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="unitId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unidad</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedCourseId}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar unidad..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {units.map((u: any) => (
                      <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                    ))}
                    {units.length === 0 && <SelectItem value="none" disabled>No hay unidades en este curso</SelectItem>}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Título de la Evaluación</FormLabel>
                <FormControl>
                  <Input placeholder="Ej. Examen Parcial 1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo de evaluación" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="EXAM">Examen</SelectItem>
                    <SelectItem value="QUIZ">Quiz / Prueba corta</SelectItem>
                    <SelectItem value="PROJECT">Proyecto</SelectItem>
                    <SelectItem value="HOMEWORK">Tarea</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="examDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de Aplicación</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maxScore"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Puntaje Máximo</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Peso en Promedio (ej. 1.0 = 100%)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={() => onSuccess()}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Guardar Cambios" : "Crear Evaluación"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
