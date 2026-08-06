"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RotateCcw, Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { restoreUser, hardDeleteUser } from "@/app/dashboard/papelera/actions";
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
import { Badge } from "@/components/ui/badge";

export function PapeleraTable({ users }: { users: any[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRestore = (userId: string) => {
    startTransition(async () => {
      const promise = restoreUser(userId);
      toast.promise(promise, {
        loading: "Restaurando usuario...",
        success: (res) => {
          if (res.success) {
            router.refresh();
            return "Usuario restaurado correctamente";
          }
          throw new Error(res.error);
        },
        error: (err) => err.message || "Error al restaurar",
      });
    });
  };

  const handleHardDelete = (userId: string) => {
    startTransition(async () => {
      const promise = hardDeleteUser(userId);
      toast.promise(promise, {
        loading: "Eliminando definitivamente...",
        success: (res) => {
          if (res.success) {
            router.refresh();
            return "Usuario eliminado permanentemente";
          }
          throw new Error(res.error);
        },
        error: (err) => err.message || "Error al eliminar",
      });
    });
  };

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Sede</TableHead>
            <TableHead>Fecha Eliminación</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                La papelera está vacía
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={user.role === "TEACHER" ? "text-blue-600" : "text-emerald-600"}>
                    {user.role === "TEACHER" ? "Profesor" : "Alumno"}
                  </Badge>
                </TableCell>
                <TableCell>{user.sede}</TableCell>
                <TableCell>{new Date(user.deletedAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleRestore(user.id)}
                      disabled={isPending}
                      className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200"
                    >
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Restaurar
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                            <AlertTriangle className="h-5 w-5" />
                            Eliminar Permanentemente
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            ¿Estás seguro que deseas eliminar permanentemente a <strong>{user.name}</strong>? Esta acción no se puede deshacer y borrará todos sus registros, calificaciones e historial asociados de forma definitiva.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleHardDelete(user.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
