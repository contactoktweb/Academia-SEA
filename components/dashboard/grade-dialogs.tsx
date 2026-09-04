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
import { PlusCircle, Edit2, Trash2, Loader2, Award, Calendar, BookOpen } from "lucide-react";
import { GradeForm } from "./grade-form";
import { deleteGrade, GradeType } from "@/app/dashboard/calificaciones/actions";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface GradeDialogProps {
  mode: "add" | "edit" | "delete";
  grade?: any;
  students?: any[];
  exams?: any[];
  courseAssignments?: any[];
  defaultStudentId?: string;
  defaultExamId?: string;
  defaultType?: GradeType;
  title?: string;
  trigger?: React.ReactNode;
}

export function GradeDialog({
  mode,
  grade,
  students = [],
  exams = [],
  defaultStudentId,
  defaultExamId,
  defaultType,
  title,
  trigger,
}: GradeDialogProps) {
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
    const studentName = grade?.student?.user?.name || "el estudiante";
    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          {trigger || (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Anular calificación?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción anulará la calificación de{" "}
              <strong>{studentName}</strong> ({grade?.value?.toFixed?.(1) || grade?.value} pts).
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
              Anular
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ||
          (mode === "add" ? (
            <Button className="gap-1.5 shadow-sm">
              <PlusCircle className="size-4" />
              <span>Registrar Calificación</span>
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <Edit2 className="h-3.5 w-3.5" />
            </Button>
          ))}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[620px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {title || (mode === "add" ? "Registrar Calificación" : "Editar Calificación")}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Selecciona el estudiante y tipo de nota a registrar."
              : "Modifica los datos del registro de calificación seleccionado."}
          </DialogDescription>
        </DialogHeader>
        <GradeForm
          grade={grade}
          students={students}
          exams={exams}
          defaultStudentId={defaultStudentId}
          defaultExamId={defaultExamId}
          defaultType={defaultType}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}

interface StudentGradesDetailDialogProps {
  student: any;
  grades: any[];
  exams: any[];
  studentsList: any[];
  trigger?: React.ReactNode;
}

export function StudentGradesDetailDialog({
  student,
  grades,
  exams,
  studentsList,
  trigger,
}: StudentGradesDetailDialogProps) {
  const [open, setOpen] = useState(false);

  const studentName = student.user?.name || student.name || "Estudiante";
  const studentEmail = student.user?.email || "";
  const courseName = student.enrollments?.[0]?.course?.name || "Curso";
  const groupName = student.enrollments?.[0]?.group?.name || "";

  const average =
    grades.length > 0
      ? (grades.reduce((sum, g) => sum + g.value, 0) / grades.length).toFixed(1)
      : "—";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[650px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-xl flex items-center gap-2">
                <BookOpen className="size-5 text-primary" />
                Historial de Calificaciones
              </DialogTitle>
              <DialogDescription className="mt-1">
                Detalle individual de notas de <strong>{studentName}</strong>
              </DialogDescription>
            </div>
            <div className="text-right">
              <span className="text-xs text-muted-foreground block">Promedio</span>
              <span
                className={`text-xl font-black ${
                  average !== "—" && Number(average) >= 85
                    ? "text-emerald-600 dark:text-emerald-400"
                    : average !== "—" && Number(average) >= 70
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-rose-600 dark:text-rose-400"
                }`}
              >
                {average}
              </span>
            </div>
          </div>
        </DialogHeader>

        <div className="py-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4 pb-2 border-b">
            <span>{studentEmail}</span>
            <span>•</span>
            <Badge variant="outline" className="text-xs font-normal">
              {courseName} {groupName ? `(${groupName})` : ""}
            </Badge>
            <span>•</span>
            <span>{grades.length} calificaciones registradas</span>
          </div>

          {grades.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              <p>Este estudiante aún no tiene calificaciones registradas.</p>
              <div className="mt-3">
                <GradeDialog
                  mode="add"
                  students={studentsList}
                  exams={exams}
                  defaultStudentId={student.id}
                  trigger={
                    <Button size="sm" className="gap-1">
                      <PlusCircle className="size-4" />
                      Registrar primera calificación
                    </Button>
                  }
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2.5">
              {grades.map((g) => {
                const isExam = !!g.exam;
                const conceptTitle = g.exam?.title || g.comment || "Calificación";
                const isAprobado = g.value >= 70;

                return (
                  <div
                    key={g.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/40 transition-colors gap-3"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                          isExam
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {isExam ? <Award className="size-4" /> : <BookOpen className="size-4" />}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm text-foreground truncate">
                            {conceptTitle}
                          </span>
                          {isExam && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                              {g.exam?.type || "Examen"}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="size-3" />
                            {new Date(g.createdAt).toLocaleDateString()}
                          </span>
                          {g.comment && g.comment !== conceptTitle && (
                            <span className="truncate max-w-[220px] italic">
                              "{g.comment}"
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        className={`text-base font-bold px-2 py-0.5 rounded-md ${
                          g.value >= 85
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                            : g.value >= 70
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
                            : "bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300"
                        }`}
                      >
                        {g.value.toFixed(1)}
                      </span>

                      <div className="flex items-center gap-1">
                        <GradeDialog
                          mode="edit"
                          grade={g}
                          students={studentsList}
                          exams={exams}
                        />
                        <GradeDialog mode="delete" grade={g} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-3 border-t mt-2">
          <GradeDialog
            mode="add"
            students={studentsList}
            exams={exams}
            defaultStudentId={student.id}
            trigger={
              <Button size="sm" variant="outline" className="gap-1.5">
                <PlusCircle className="size-3.5" />
                <span>+ Agregar Nota</span>
              </Button>
            }
          />
          <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

