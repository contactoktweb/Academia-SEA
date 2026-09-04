"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2, Award, BookOpen, MessageSquare, UserCheck, FolderKanban, HelpCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createGrade, updateGrade, GradeType } from "@/app/dashboard/calificaciones/actions";

const gradeFormSchema = z.object({
  studentId: z.string().min(1, "Selecciona un estudiante"),
  gradeType: z.enum(["EVALUATION", "HOMEWORK", "PARTICIPATION", "ATTENDANCE", "PROJECT", "OTHER"]),
  examId: z.string().optional(),
  customConcept: z.string().optional(),
  value: z.coerce.number().min(0, "Mínimo 0").max(100, "Máximo 100"),
  comment: z.string().optional(),
});

type GradeFormValues = z.infer<typeof gradeFormSchema>;

interface GradeFormProps {
  grade?: any;
  students: any[];
  exams: any[];
  defaultStudentId?: string;
  defaultExamId?: string;
  defaultType?: GradeType;
  onSuccess: () => void;
}

const TYPE_OPTIONS: { type: GradeType; label: string; icon: any; placeholder: string }[] = [
  { type: "EVALUATION", label: "Evaluación / Examen", icon: Award, placeholder: "" },
  { type: "HOMEWORK", label: "Tarea / Tarea en clase", icon: BookOpen, placeholder: "Ej. Tarea 1: Reading Comprehension" },
  { type: "PARTICIPATION", label: "Participación", icon: MessageSquare, placeholder: "Ej. Speaking en clase semana 3" },
  { type: "ATTENDANCE", label: "Asistencia", icon: UserCheck, placeholder: "Ej. Asistencia y puntualidad mensual" },
  { type: "PROJECT", label: "Proyecto / Exposición", icon: FolderKanban, placeholder: "Ej. Presentación oral final" },
  { type: "OTHER", label: "Otro Concepto", icon: HelpCircle, placeholder: "Ej. Trabajo adicional / Taller" },
];

export function GradeForm({
  grade,
  students,
  exams,
  defaultStudentId,
  defaultExamId,
  defaultType,
  onSuccess,
}: GradeFormProps) {
  const [isPending, startTransition] = useTransition();

  // Extraer concepto y comentario previo si aplica
  let initialType: GradeType = "EVALUATION";
  let initialConcept = "";
  let initialComment = grade?.comment || "";

  if (grade) {
    if (grade.examId) {
      initialType = "EVALUATION";
    } else if (grade.comment?.startsWith("[")) {
      const match = grade.comment.match(/^\[(.*?):\s*(.*?)\]\s*(.*)$/);
      if (match) {
        const typeStr = match[1].toLowerCase();
        if (typeStr.includes("tarea")) initialType = "HOMEWORK";
        else if (typeStr.includes("participaci")) initialType = "PARTICIPATION";
        else if (typeStr.includes("asistencia")) initialType = "ATTENDANCE";
        else if (typeStr.includes("proyecto")) initialType = "PROJECT";
        else initialType = "OTHER";

        initialConcept = match[2];
        initialComment = match[3];
      }
    } else if (grade.participationScore) {
      initialType = "PARTICIPATION";
    } else if (grade.attendanceScore) {
      initialType = "ATTENDANCE";
    }
  } else if (defaultType) {
    initialType = defaultType;
  } else if (exams.length === 0) {
    initialType = "HOMEWORK";
  }

  const form = useForm<GradeFormValues>({
    resolver: zodResolver(gradeFormSchema),
    defaultValues: {
      studentId: grade?.studentId || defaultStudentId || (students.length === 1 ? students[0].id : ""),
      gradeType: initialType,
      examId: grade?.examId || defaultExamId || (exams.length > 0 ? exams[0].id : ""),
      customConcept: initialConcept,
      value: grade?.value !== undefined ? grade.value : 100,
      comment: initialComment,
    },
  });

  const selectedType = form.watch("gradeType");
  const selectedExamId = form.watch("examId");
  const selectedStudentId = form.watch("studentId");

  const selectedStudent = students.find((s) => s.id === selectedStudentId);
  const selectedExam = exams.find((e) => e.id === selectedExamId);

  const onSubmit = async (values: GradeFormValues) => {
    if (values.gradeType === "EVALUATION" && (!values.examId || values.examId === "none")) {
      form.setError("examId", { message: "Selecciona una evaluación de la lista" });
      return;
    }

    if (values.gradeType !== "EVALUATION" && !values.customConcept?.trim()) {
      form.setError("customConcept", { message: "Ingresa el nombre o concepto de la calificación" });
      return;
    }

    startTransition(async () => {
      const promise = grade
        ? updateGrade(grade.id, {
            value: values.value,
            gradeType: values.gradeType,
            customConcept: values.customConcept,
            comment: values.comment,
            studentId: values.studentId,
            examId: values.gradeType === "EVALUATION" ? values.examId : undefined,
          })
        : createGrade({
            studentId: values.studentId,
            gradeType: values.gradeType,
            value: values.value,
            examId: values.gradeType === "EVALUATION" ? values.examId : undefined,
            customConcept: values.customConcept,
            comment: values.comment,
          });

      await toast.promise(promise, {
        loading: grade ? "Actualizando calificación..." : "Registrando calificación...",
        success: (res: any) => {
          if (res.success) {
            onSuccess();
            return grade
              ? "Calificación actualizada correctamente"
              : res.updated
              ? "Calificación previa actualizada para esta evaluación"
              : "Calificación registrada con éxito";
          }
          throw new Error(res.error);
        },
        error: (err) => err.message || "Ocurrió un error al guardar",
      });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
        {/* Selector de Estudiante */}
        <FormField
          control={form.control}
          name="studentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-foreground">Estudiante</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona un estudiante..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-60">
                  {students.map((student) => {
                    const studentName = student.user?.name || student.name || "Estudiante";
                    const courseGroup = student.enrollments?.[0]?.course?.name 
                      ? ` (${student.enrollments[0].course.name}${student.enrollments[0].group?.name ? ` - ${student.enrollments[0].group.name}` : ""})`
                      : "";
                    return (
                      <SelectItem key={student.id} value={student.id}>
                        {studentName}{courseGroup}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {selectedStudent && (
                <FormDescription className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                  <CheckCircle2 className="size-3 text-emerald-600" />
                  Alumno asignado en:{" "}
                  <span className="font-medium text-foreground">
                    {selectedStudent.enrollments?.[0]?.course?.name || "Curso activo"}
                  </span>
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tipo de Nota */}
        <FormField
          control={form.control}
          name="gradeType"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="font-semibold text-foreground">Tipo de Calificación</FormLabel>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {TYPE_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = field.value === opt.type;
                  return (
                    <button
                      type="button"
                      key={opt.type}
                      onClick={() => {
                        field.onChange(opt.type);
                        if (opt.type === "EVALUATION" && exams.length > 0 && !form.getValues("examId")) {
                          form.setValue("examId", exams[0].id);
                        }
                      }}
                      className={`flex items-center gap-2 p-2.5 rounded-lg border text-left text-xs font-medium transition-all ${
                        isSelected
                          ? "border-primary bg-primary/10 text-primary ring-1 ring-primary shadow-sm"
                          : "border-border hover:bg-muted/60 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Icon className={`size-4 shrink-0 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                      <span className="truncate">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Condicional: Si es Evaluación, seleccionar de las creadas anteriormente */}
        {selectedType === "EVALUATION" ? (
          <FormField
            control={form.control}
            name="examId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-foreground">
                  Evaluación Creada Previamente
                </FormLabel>
                {exams.length === 0 ? (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/30 p-3 text-xs text-amber-800 dark:text-amber-300">
                    <p className="font-semibold mb-1">No hay evaluaciones registradas aún</p>
                    <p>
                      Puedes crear evaluaciones en la sección de <strong>Evaluaciones</strong> del menú lateral, o seleccionar <strong>Tarea</strong> o <strong>Participación</strong> para rellenar una nota directamente.
                    </p>
                  </div>
                ) : (
                  <>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una evaluación..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-60">
                        {exams.map((exam) => (
                          <SelectItem key={exam.id} value={exam.id}>
                            {exam.title} {exam.unit?.course?.name ? `(${exam.unit.course.name})` : ""}{" "}
                            — Max: {exam.maxScore || 100} pts
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedExam && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Ponderación: {selectedExam.weight || 1}x | Tipo: {selectedExam.type || "EXAM"}
                      </p>
                    )}
                  </>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          /* Condicional: Las demás si se pueden rellenar */
          <FormField
            control={form.control}
            name="customConcept"
            render={({ field }) => {
              const currentOption = TYPE_OPTIONS.find((o) => o.type === selectedType);
              return (
                <FormItem>
                  <FormLabel className="font-semibold text-foreground">
                    Concepto o Título de la Nota
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={currentOption?.placeholder || "Nombre o descripción de la actividad..."}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Ingresa el nombre de la tarea, actividad o aspecto evaluado.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        )}

        {/* Calificación (Puntaje) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-foreground">Calificación (0 - 100)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      step="0.1"
                      min={0}
                      max={100}
                      {...field}
                      className="pr-10 text-lg font-bold"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-semibold">
                      / 100
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col justify-center rounded-lg border bg-muted/30 p-3 text-xs">
            <span className="text-muted-foreground">Estado del resultado:</span>
            <span
              className={`text-sm font-bold mt-0.5 ${
                (form.watch("value") || 0) >= 85
                  ? "text-emerald-600 dark:text-emerald-400"
                  : (form.watch("value") || 0) >= 70
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-rose-600 dark:text-rose-400"
              }`}
            >
              {(form.watch("value") || 0) >= 85
                ? "Sobresaliente (Aprobado)"
                : (form.watch("value") || 0) >= 70
                ? "Satisfactorio (Aprobado)"
                : "Insuficiente (En riesgo)"}
            </span>
          </div>
        </div>

        {/* Comentarios / Observaciones */}
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-foreground">
                Observaciones o Comentarios (Opcional)
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={2}
                  placeholder="Retroalimentación para el alumno o notas pedagógicas..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-2 border-t">
          <Button type="submit" disabled={isPending} className="font-medium">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {grade ? "Actualizar Calificación" : "Registrar Calificación"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

