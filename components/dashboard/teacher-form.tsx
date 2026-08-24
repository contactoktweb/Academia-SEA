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
import { Switch } from "@/components/ui/switch";
import { useTransition, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
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
  sede: z.string().optional(),
  isActive: z.boolean().optional(),
});

type TeacherFormValues = z.infer<typeof teacherSchema>;

interface TeacherFormProps {
  initialData?: any;
  onSuccess: () => void;
}

export function TeacherForm({ initialData, onSuccess }: TeacherFormProps) {
  const [isPending, startTransition] = useTransition();
  const { data: session } = useSession();
  const activeSede = (session?.user as any)?.sede || "SEAAUTLAN";
  const isEditMode = !!initialData;

  const DRAFT_KEY = "sea_draft_teacher_form";
  const [hasDraft, setHasDraft] = useState(false);

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
      sede: initialData?.sede || activeSede,
      isActive: initialData?.isActive ?? true,
    },
  });

  // 1. Restaurar borrador automáticamente si se cerró por accidente
  useEffect(() => {
    if (isEditMode) return;
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.name || parsed.email || parsed.phone || parsed.specialty)) {
          setHasDraft(true);
          form.reset({
            name: parsed.name || "",
            email: parsed.email || "",
            password: parsed.password || "",
            phone: parsed.phone || "",
            specialty: parsed.specialty || "",
            employeeId: parsed.employeeId || "",
            salary: parsed.salary || "",
            sede: parsed.sede || activeSede,
            isActive: true,
          });
        }
      }
    } catch (err) {
      console.error("Error restoring teacher draft:", err);
    }
  }, [isEditMode, activeSede]);

  // 2. Guardar borrador en tiempo real mientras se escribe
  const watchedAll = form.watch();
  useEffect(() => {
    if (isEditMode) return;
    const timer = setTimeout(() => {
      try {
        if (watchedAll.name || watchedAll.email || watchedAll.phone || watchedAll.specialty) {
          localStorage.setItem(DRAFT_KEY, JSON.stringify(watchedAll));
          setHasDraft(true);
        }
      } catch (err) {
        console.error("Error saving teacher draft:", err);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [watchedAll, isEditMode]);

  const handleClearDraft = () => {
    try {
      localStorage.removeItem(DRAFT_KEY);
      setHasDraft(false);
      form.reset({
        name: "",
        email: "",
        password: "",
        phone: "",
        specialty: "",
        employeeId: "",
        salary: "",
        sede: activeSede,
        isActive: true,
      });
      toast.info("Borrador limpiado");
    } catch (err) {}
  };

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
          try {
            localStorage.removeItem(DRAFT_KEY);
            setHasDraft(false);
          } catch {}
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
        {hasDraft && !isEditMode && (
          <div className="flex items-center justify-between bg-blue-50/90 border border-blue-200/80 rounded-xl px-3.5 py-2 text-xs text-blue-900 mb-1 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 font-medium">
              <span className="h-2 w-2 rounded-full bg-[#0066cc] animate-pulse inline-block" />
              <span>Borrador recuperado automáticamente</span>
            </div>
            <button
              type="button"
              onClick={handleClearDraft}
              className="text-xs text-blue-700 hover:text-red-600 underline font-bold cursor-pointer transition-colors"
            >
              Limpiar formulario
            </button>
          </div>
        )}

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
          {initialData && (
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Estado del Profesor</FormLabel>
                    <p className="text-xs text-muted-foreground">
                      {field.value ? "El profesor está activo" : "El profesor está inactivo"}
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          )}
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
                    <Input placeholder="Automático (Ej: SEA-DOC-1234)" {...field} value={field.value || ""} disabled={!initialData} readOnly={!initialData} />
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
