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
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit2, Trash2, Loader2 } from "lucide-react";
import { CourseForm } from "./course-form";
import { deleteCourse } from "@/app/dashboard/cursos/actions";
import { toast } from "sonner";

interface CourseDialogProps {
  mode: "add" | "edit" | "delete";
  course?: any;
  trigger?: React.ReactNode;
}

export function CourseDialog({ mode, course, trigger }: CourseDialogProps) {
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

  if (mode === "delete") {
    const handleDelete = () => {
      startTransition(async () => {
        const promise = deleteCourse(course.id);
        await toast.promise(promise, {
          loading: "Eliminando curso...",
          success: (result: any) => {
            if (result.success) {
              handleSuccess();
              return "Curso eliminado correctamente";
            }
            throw new Error(result.error);
          },
          error: (err) => err.message || "Error al eliminar el curso",
        });
      });
    };

    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          {trigger || (
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente el curso <strong>{course?.name}</strong> y todas sus asignaciones. No se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Eliminar Curso
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          mode === "add" ? (
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nuevo Curso
            </Button>
          ) : (
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Edit2 className="h-4 w-4" />
            </Button>
          )
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Crear Nuevo Curso" : "Editar Curso"}</DialogTitle>
          <DialogDescription>
            {mode === "add" 
              ? "Define un nuevo programa académico en la institución." 
              : "Modifica los detalles del programa académico."}
          </DialogDescription>
        </DialogHeader>
        <CourseForm 
          initialData={mode === "edit" ? course : undefined} 
          onSuccess={handleSuccess} 
        />
      </DialogContent>
    </Dialog>
  );
}
