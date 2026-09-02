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
import { Textarea } from "@/components/ui/textarea";
import { useTransition, useState, useEffect } from "react";
import { createCourse, updateCourse, getTeachersForSelect } from "@/app/dashboard/cursos/actions";
import { getStudentsForSelect } from "@/app/dashboard/boletas/actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { ScheduleSelector } from "./schedule-selector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelectStudents } from "./multi-select-students";

const courseSchema = z.object({
  name: z.string().min(2, "El nombre es muy corto"),
  code: z.string().min(2, "El código es obligatorio"),
  description: z.string().optional(),
  level: z.string().min(1, "El nivel es obligatorio"),
  schedule: z.string().optional(),
  teacherId: z.string().optional(),
  studentIds: z.array(z.string()).optional(),
});

type CourseFormValues = z.infer<typeof courseSchema>;

interface CourseFormProps {
  initialData?: any;
  onSuccess: () => void;
}

export function CourseForm({ initialData, onSuccess }: CourseFormProps) {
  const [isPending, startTransition] = useTransition();
  const [teachers, setTeachers] = useState<Array<{id: string, name: string}>>([]);
  const [students, setStudents] = useState<Array<{id: string, name: string}>>([]);

  useEffect(() => {
    getTeachersForSelect().then(res => {
      if (res.success && res.data) {
        setTeachers(res.data as Array<{id: string, name: string}>);
      }
    });
    getStudentsForSelect().then(res => {
      if (res.success && res.data) {
        setStudents(res.data);
      }
    });
  }, []);

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: initialData?.name || "",
      code: initialData?.code || "",
      description: initialData?.description || "",
      level: initialData?.level || "",
      schedule: initialData?.schedule || "",
      teacherId: initialData?.assignments?.[0]?.teacherId || "",
      studentIds: initialData?.enrollments?.map((e: any) => e.studentId) || [],
    },
  });

  function onSubmit(values: CourseFormValues) {
    if (values.teacherId === "none") {
      values.teacherId = undefined;
    }
    startTransition(async () => {
      const promise = initialData 
        ? updateCourse(initialData.id, values) 
        : createCourse(values);

      await toast.promise(promise, {
        loading: initialData ? "Actualizando curso..." : "Creando curso...",
        success: (result: any) => {
          if (result.success) {
            onSuccess();
            return initialData ? "Curso actualizado" : "Curso creado";
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
            name="name"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Nombre del Curso</FormLabel>
                <FormControl>
                  <Input placeholder="Ej. Inglés Básico 1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código</FormLabel>
                <FormControl>
                  <Input placeholder="IB1-2024" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nivel</FormLabel>
                <FormControl>
                  <Input placeholder="Básico / Intermedio / Avanzado" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="schedule"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Horario</FormLabel>
              <FormControl>
                <ScheduleSelector value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="teacherId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profesor Asignado (Opcional)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value || "none"}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar un profesor..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">Sin profesor asignado</SelectItem>
                  {teachers.map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="studentIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estudiantes Matriculados</FormLabel>
              <FormControl>
                <MultiSelectStudents 
                  students={students} 
                  value={field.value || []} 
                  onChange={field.onChange} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Objetivos del curso, pre-requisitos..." 
                  className="resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={() => onSuccess()}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Guardar Cambios" : "Crear Curso"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
