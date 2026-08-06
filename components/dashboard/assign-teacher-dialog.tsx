"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BookOpen, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { getCoursesForEnrollment, getGroupsForEnrollment } from "@/app/dashboard/alumnos/actions";
import { createCourseAssignment } from "@/app/dashboard/cursos/actions";

const assignSchema = z.object({
  courseId: z.string().min(1, "Selecciona un curso"),
  groupId: z.string().optional(),
  customMonthlyFee: z.string().optional(),
});

type AssignFormValues = z.infer<typeof assignSchema>;

interface AssignTeacherDialogProps {
  teacherProfileId: string;
  teacherName: string;
}

export function AssignTeacherDialog({ teacherProfileId, teacherName }: AssignTeacherDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [courses, setCourses] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const router = useRouter();

  const form = useForm<AssignFormValues>({
    resolver: zodResolver(assignSchema),
    defaultValues: {
      courseId: "",
      groupId: "",
      customMonthlyFee: "",
    },
  });

  useEffect(() => {
    if (open) {
      getCoursesForEnrollment().then((res) => {
        if (res.success) setCourses(res.data || []);
      });
      getGroupsForEnrollment().then((res) => {
        if (res.success) setGroups(res.data || []);
      });
    }
  }, [open]);

  function onSubmit(values: AssignFormValues) {
    if (!teacherProfileId) {
      toast.error("El profesor no tiene un perfil configurado");
      return;
    }

    startTransition(async () => {
      const promise = createCourseAssignment({
        teacherId: teacherProfileId,
        courseId: values.courseId,
        groupId: values.groupId,
        customMonthlyFee: values.customMonthlyFee ? parseFloat(values.customMonthlyFee) : undefined,
      });

      await toast.promise(promise, {
        loading: "Asignando...",
        success: (result: any) => {
          if (result.success) {
            setOpen(false);
            form.reset();
            router.refresh();
            return "Asignación exitosa";
          }
          throw new Error(result.error);
        },
        error: (err) => err.message || "Error al asignar grupo",
      });
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div>
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Asignar Curso">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Asignar curso</p></TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Asignar Curso / Grupo</DialogTitle>
          <DialogDescription>
            Asigna a <strong>{teacherName}</strong> a un curso y grupo específico.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="courseId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Curso</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un curso..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {courses.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="groupId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grupo</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un grupo..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {groups.map((g) => (
                        <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customMonthlyFee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio de Mensualidad Personalizado (Opcional)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="Ej. 1500.00" {...field} />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    Si se establece, este precio aparecerá como "precio personalizado" para este maestro en este grupo.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Asignar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
