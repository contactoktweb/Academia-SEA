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
import { useTransition } from "react";
import { createCourse, updateCourse } from "@/app/dashboard/cursos/actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const courseSchema = z.object({
  name: z.string().min(2, "El nombre es muy corto"),
  code: z.string().min(2, "El código es obligatorio"),
  description: z.string().optional(),
  level: z.string().min(1, "El nivel es obligatorio"),
});

type CourseFormValues = z.infer<typeof courseSchema>;

interface CourseFormProps {
  initialData?: any;
  onSuccess: () => void;
}

export function CourseForm({ initialData, onSuccess }: CourseFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: initialData?.name || "",
      code: initialData?.code || "",
      description: initialData?.description || "",
      level: initialData?.level || "",
    },
  });

  function onSubmit(values: CourseFormValues) {
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
