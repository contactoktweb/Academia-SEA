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
import { GradeForm } from "./grade-form";
import { deleteGrade } from "@/app/dashboard/calificaciones/actions";
import { toast } from "sonner";

interface GradeDialogProps {
  mode: "add" | "edit" | "delete";
  grade?: any;
  students?: any[];
  exams?: any[];
  courseAssignments?: any[];
  trigger?: React.ReactNode;
}

export function GradeDialog({
  mode,
  grade,
  students = [],
  exams = [],
  courseAssignments = [],
  trigger,
}) {
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

  const handleDelete = async () => {
    startTransition(async () => {
      const promise = deleteGrade(grade.id);
      
      await toast.promise(promise, {
        loading: "Eliminando calificación...",
        success: (res: any) => {
          if (res.success) {
            handleSuccess();
            return "Calificación eliminada";
          }
          throw new Error(res.error);
        },
        error: (err) => err.message || "Error al eliminar",
      });
    });
  };

  if (mode === "delete") {
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
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente el registro de calificación de{" "}
              <strong>{grade.student.user.name}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isPending}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Eliminar
            </AlertDialogAction>
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
              Nueva Calificación
            </Button>
          ) : (
            <Button variant="outline" size="sm">
              <Edit2 className="h-4 w-4" />
            </Button>
          )
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Registrar Calificación" : "Editar Calificación"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Ingresa los datos de la nueva evaluación para el estudiante."
              : "Modifica los datos del registro de calificación seleccionado."}
          </DialogDescription>
        </DialogHeader>
        <GradeForm
          grade={grade}
          students={students}
          exams={exams}
          courseAssignments={courseAssignments}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}
