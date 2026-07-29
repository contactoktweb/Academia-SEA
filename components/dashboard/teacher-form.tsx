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
import { useTransition } from "react";
import { createTeacher, updateTeacher } from "@/app/dashboard/profesores/actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const teacherSchema = z.object({
  name: z.string().min(2, "El nombre es muy corto"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres").optional().or(z.literal("")),
  phone: z.string().optional(),
  specialty: z.string().optional(),
  employeeId: z.string().optional(),
  salary: z.string().optional(),
  sede: z.string().min(1, "La sede es obligatoria"),
});

type TeacherFormValues = z.infer<typeof teacherSchema>;

interface TeacherFormProps {
  initialData?: any;
  onSuccess: () => void;
}

export function TeacherForm({ initialData, onSuccess }: TeacherFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      password: "",
      phone: initialData?.phone || "",
      specialty: initialData?.teacherProfile?.specialty || "",
      employeeId: initialData?.teacherProfile?.employeeId || "",
      salary: initialData?.teacherProfile?.salary ? String(initialData.teacherProfile.salary) : "",
      sede: initialData?.sede || "",
    },
  });

  function onSubmit(values: TeacherFormValues) {
    if (!initialData && !values.password) {
      toast.error("La contraseña es obligatoria para nuevos profesores");
      return;
    }

    startTransition(async () => {
      const formattedValues = {
        ...values,
        salary: values.salary ? parseFloat(values.salary) : undefined,
      };

      try {
        const result = initialData
          ? await updateTeacher(initialData.id, formattedValues as any)
          : await createTeacher(formattedValues as any);

        if (result.success) {
          onSuccess();
          toast.success(initialData ? "Profesor actualizado" : "Profesor creado");
        } else {
          toast.error(result.error || "Error en la operación");
        }
      } catch (error: any) {
        toast.error(error.message || "Error inesperado");
      }
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
              <FormItem>
                <FormLabel>Nombre Completo</FormLabel>
                <FormControl>
                  <Input placeholder="Ej. Prof. Manuel Gomez" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo Electrónico</FormLabel>
                <FormControl>
                  <Input placeholder="manuel@academia.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {!initialData && (
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input placeholder="317..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sede"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sede</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona sede..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="SEAGRULLO">El Grullo</SelectItem>
                    <SelectItem value="SEAAUTLAN">Autlán</SelectItem>
                    <SelectItem value="SEAUNION">Unión de Tula</SelectItem>
                    <SelectItem value="EN_LINEA">En Línea</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium border-b pb-2">Información Laboral</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="employeeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID de Empleado</FormLabel>
                  <FormControl>
                    <Input placeholder="SEA-001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="specialty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Especialidad / Área</FormLabel>
                  <FormControl>
                    <Input placeholder="Inglés Avanzado / TOEFL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="salary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salario (Mensual)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={() => onSuccess()}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Guardar Cambios" : "Crear Profesor"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
