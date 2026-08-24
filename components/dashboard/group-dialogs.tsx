"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit2, Trash2, Loader2, Users } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createGroup, updateGroup, deleteGroup } from "@/app/dashboard/cursos/actions";
import { toast } from "sonner";
import { ScheduleSelector } from "./schedule-selector";

const groupSchema = z.object({
  name: z.string().min(2, "El nombre del grupo es obligatorio"),
  level: z.string().min(1, "El nivel es obligatorio"),
  sede: z.string().min(1, "Selecciona una sede"),
  modality: z.enum(["PRESENCIAL", "VIRTUAL", "MIXTA"]),
  schedule: z.string().optional(),
  location: z.string().optional(),
  maxStudents: z.string().optional(),
});

type GroupFormValues = z.infer<typeof groupSchema>;

interface GroupDialogProps {
  mode: "add" | "edit" | "delete";
  group?: any;
  defaultSede?: string;
  trigger?: React.ReactNode;
  onSuccessCallback?: () => void;
}

export function GroupDialog({
  mode,
  group,
  defaultSede = "SEAAUTLAN",
  trigger,
  onSuccessCallback,
}: GroupDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<GroupFormValues>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: group?.name || "",
      level: group?.level || "Básico",
      sede: group?.sede || defaultSede,
      modality: group?.modality || "PRESENCIAL",
      schedule: group?.schedule || "",
      location: group?.location || "",
      maxStudents: group?.maxStudents ? String(group.maxStudents) : "30",
    },
  });

  function handleSuccess() {
    setOpen(false);
    if (onSuccessCallback) {
      onSuccessCallback();
    } else {
      startTransition(() => {
        router.refresh();
      });
    }
  }

  if (mode === "delete") {
    const handleDelete = () => {
      startTransition(async () => {
        const promise = deleteGroup(group.id);
        await toast.promise(promise, {
          loading: "Eliminando grupo...",
          success: (result: any) => {
            if (result.success) {
              handleSuccess();
              return "Grupo eliminado correctamente";
            }
            throw new Error(result.error);
          },
          error: (err) => err.message || "Error al eliminar el grupo",
        });
      });
    };

    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          {trigger || (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar este grupo?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción deshabilitará el grupo <strong>{group?.name}</strong>. No se perderán las calificaciones ni historial de alumnos previos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Eliminar Grupo
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  const onSubmit = (values: GroupFormValues) => {
    startTransition(async () => {
      const dataToSubmit = {
        name: values.name,
        level: values.level,
        sede: values.sede,
        modality: values.modality,
        schedule: values.schedule,
        location: values.location,
        maxStudents: values.maxStudents ? parseInt(values.maxStudents) : 30,
      };

      const promise = mode === "edit"
        ? updateGroup(group.id, dataToSubmit)
        : createGroup(dataToSubmit);

      await toast.promise(promise, {
        loading: mode === "edit" ? "Actualizando grupo..." : "Creando grupo...",
        success: (result: any) => {
          if (result.success) {
            handleSuccess();
            return mode === "edit" ? "Grupo actualizado" : "Grupo creado con éxito";
          }
          throw new Error(result.error);
        },
        error: (err) => err.message || "Error al procesar el grupo",
      });
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          mode === "add" ? (
            <Button className="bg-sea-blue hover:bg-sea-blue-dark text-white">
              <PlusCircle className="mr-2 h-4 w-4" />
              Nuevo Grupo
            </Button>
          ) : (
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Edit2 className="h-4 w-4" />
            </Button>
          )
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Crear Nuevo Grupo" : "Editar Grupo"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Define un grupo o sección para inscribir y agrupar alumnos."
              : "Modifica los datos del grupo seleccionado."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Grupo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej. Grupo A - Matutino / Secundaria 1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nivel / Categoría</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej. Básico / Intermedio / Niños" {...field} />
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
                          <SelectValue placeholder="Selecciona sede" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="SEAAUTLAN">Autlán</SelectItem>
                        <SelectItem value="SEAGRULLO">El Grullo</SelectItem>
                        <SelectItem value="SEAUNION">Unión de Tula</SelectItem>
                        <SelectItem value="EN_LINEA">En Línea</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="modality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modalidad</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Modalidad" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PRESENCIAL">Presencial</SelectItem>
                        <SelectItem value="VIRTUAL">Virtual</SelectItem>
                        <SelectItem value="MIXTA">Mixta</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxStudents"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cupo Máximo</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" max="100" placeholder="30" {...field} />
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
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ubicación / Aula (Opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej. Aula 2 / Salón Principal" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-sea-blue hover:bg-sea-blue-dark text-white"
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === "edit" ? "Guardar Cambios" : "Crear Grupo"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
