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
import { TeacherForm } from "./teacher-form";
import { deleteTeacher } from "@/app/dashboard/profesores/actions";
import { toast } from "sonner";

interface TeacherDialogProps {
  mode: "add" | "edit" | "delete";
  teacher?: any;
  trigger?: React.ReactNode;
}

export function TeacherDialog({ mode, teacher, trigger }: TeacherDialogProps) {
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
        const promise = deleteTeacher(teacher.id);
        await toast.promise(promise, {
          loading: "Eliminando profesor...",
          success: (result: any) => {
            if (result.success) {
              handleSuccess();
              return "Profesor eliminado correctamente";
            }
            throw new Error(result.error);
          },
          error: (err) => err.message || "Error al eliminar el profesor",
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
              Esta acción eliminará permanentemente al profesor <strong>{teacher?.name}</strong> y su perfil docente. No se puede deshacer.
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
              Eliminar Profesor
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
              Nuevo Profesor
            </Button>
          ) : (
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Edit2 className="h-4 w-4" />
            </Button>
          )
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Registrar Nuevo Profesor" : "Editar Profesor"}</DialogTitle>
          <DialogDescription>
            {mode === "add" 
              ? "Crea una nueva cuenta de profesor y su perfil académico." 
              : "Actualiza los datos laborales y de contacto del profesor."}
          </DialogDescription>
        </DialogHeader>
        <TeacherForm 
          initialData={mode === "edit" ? teacher : undefined} 
          onSuccess={handleSuccess} 
        />
      </DialogContent>
    </Dialog>
  );
}
