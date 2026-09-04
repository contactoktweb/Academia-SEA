"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createGrade, updateGrade } from "@/app/dashboard/calificaciones/actions";

const gradeSchema = z.object({
  examScore: z.coerce.number().min(0).max(100).optional(),
  participationScore: z.coerce.number().min(0).max(100).optional(),
  attendanceScore: z.coerce.number().min(0).max(100).optional(),
  comment: z.string().optional(),
  studentId: z.string().min(1, "Selecciona un estudiante"),
  examId: z.string().optional(),
  courseAssignmentId: z.string().min(1, "Selecciona una asignación de curso"),
});

type GradeFormValues = z.infer<typeof gradeSchema>;

interface GradeFormProps {
  grade?: any;
  students: any[];
  exams: any[];
  courseAssignments: any[];
  onSuccess: () => void;
}

export function GradeForm({
  grade,
  students,
  exams,
  courseAssignments,
  onSuccess,
}: GradeFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<GradeFormValues>({
    resolver: zodResolver(gradeSchema),
    defaultValues: {
      examScore: grade?.examScore || 0,
      participationScore: grade?.participationScore || 0,
      attendanceScore: grade?.attendanceScore || 0,
      comment: grade?.comment || "",
      studentId: grade?.studentId || "",
      examId: grade?.examId || "",
      courseAssignmentId: grade?.courseAssignmentId || "",
    },
  });

  const onSubmit = async (values: GradeFormValues) => {
    startTransition(async () => {
      const promise = grade
        ? updateGrade(grade.id, values)
        : createGrade(values);

      await toast.promise(promise, {
        loading: grade ? "Actualizando calificación..." : "Registrando calificación...",
        success: (res: any) => {
          if (res.success) {
            onSuccess();
            return grade ? "Calificación actualizada" : "Calificación registrada";
          }
          throw new Error(res.error);
        },
        error: (err) => err.message || "Ocurrió un error",
      });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
        <FormField
          control={form.control}
          name="studentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estudiante</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un estudiante" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.user?.name || "Estudiante"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="courseAssignmentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Curso / Asignación</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un curso" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {courseAssignments.map((ca) => {
                    const courseName = ca.course?.name || "Curso";
                    const groupPart = ca.group?.name ? ` - ${ca.group.name}` : "";
                    const teacherPart = ca.teacher?.user?.name ? ` (${ca.teacher.user.name})` : "";
                    return (
                      <SelectItem key={ca.id} value={ca.id}>
                        {courseName}{groupPart}{teacherPart}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="examId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Examen / Evaluación (Opcional)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="General / Ninguno" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">Ninguno</SelectItem>
                  {exams.map((exam) => (
                    <SelectItem key={exam.id} value={exam.id}>
                      {exam.title} {exam.unit?.course?.name ? `(${exam.unit.course.name})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="examScore"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Examen (70%)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="participationScore"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Participación (20%)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="attendanceScore"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Asistencia (10%)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comentarios</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Observaciones sobre el desempeño..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {grade ? "Actualizar" : "Registrar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
