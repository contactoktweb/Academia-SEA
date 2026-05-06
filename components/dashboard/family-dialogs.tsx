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
import { FamilyForm } from "./family-form";
import { deleteFamily } from "@/app/dashboard/familias/actions";
import { toast } from "sonner";

interface FamilyDialogProps {
  mode: "add" | "edit" | "delete";
  family?: any;
  trigger?: React.ReactNode;
}

export function FamilyDialog({ mode, family, trigger }: FamilyDialogProps) {
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
        const promise = deleteFamily(family.id);
        await toast.promise(promise, {
          loading: "Eliminando familia...",
          success: (result: any) => {
            if (result.success) {
              handleSuccess();
              return "Familia eliminada correctamente";
            }
            throw new Error(result.error);
          },
          error: (err) => err.message || "Error al eliminar la familia",
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
              Esta acción eliminará permanentemente la familia <strong>{family?.name}</strong> y sus vínculos. No se puede deshacer.
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
              Eliminar Familia
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
              Nueva Familia
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
          <DialogTitle>{mode === "add" ? "Registrar Nueva Familia" : "Editar Familia"}</DialogTitle>
          <DialogDescription>
            {mode === "add" 
              ? "Crea un perfil familiar para agrupar alumnos y gestionar contactos." 
              : "Actualiza la información de contacto de la familia."}
          </DialogDescription>
        </DialogHeader>
        <FamilyForm 
          initialData={mode === "edit" ? family : undefined} 
          onSuccess={handleSuccess} 
        />
      </DialogContent>
    </Dialog>
  );
}
