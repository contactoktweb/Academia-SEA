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
import { ExamForm } from "./exam-form";
import { deleteExam } from "@/app/dashboard/evaluaciones/actions";
import { toast } from "sonner";

interface ExamDialogProps {
  mode: "add" | "edit" | "delete";
  exam?: any;
}

export function ExamDialog({ mode, exam }: ExamDialogProps) {
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
        const promise = deleteExam(exam.id);
        await toast.promise(promise, {
          loading: "Eliminando evaluación...",
          success: (result: any) => {
            if (result.success) {
              handleSuccess();
              return "Evaluación eliminada correctamente";
            }
            throw new Error(result.error);
          },
          error: (err) => err.message || "Error al eliminar la evaluación",
        });
      });
    };

    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente la evaluación <strong>{exam?.title}</strong> y no se puede deshacer. Las calificaciones registradas podrían verse afectadas.
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
              Eliminar Evaluación
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === "add" ? (
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nueva Evaluación
          </Button>
        ) : (
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Edit2 className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Crear Nueva Evaluación" : "Editar Evaluación"}</DialogTitle>
          <DialogDescription>
            {mode === "add" 
              ? "Define un nuevo examen, quiz o tarea para un curso específico." 
              : "Modifica los detalles de la evaluación."}
          </DialogDescription>
        </DialogHeader>
        <ExamForm 
          initialData={mode === "edit" ? exam : undefined} 
          onSuccess={handleSuccess} 
        />
      </DialogContent>
    </Dialog>
  );
}
