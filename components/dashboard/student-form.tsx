"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useTransition, useEffect } from "react";
import { 
  createStudent, 
  updateStudent, 
  getCoursesForEnrollment, 
  getGroupsForEnrollment,
  enrollStudentInCourse,
  uploadContract
} from "@/app/dashboard/alumnos/actions";
import { toast } from "sonner";
import { Loader2, AlertCircle, FileText } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const studentSchema = z.object({
  name: z.string().min(2, "El nombre es muy corto"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres").optional().or(z.literal("")),
  phone: z.string().optional(),
  gender: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  sede: z.string().min(1, "La sede es obligatoria"),
  // Step 2 fields
  courseId: z.string().optional(),
  groupId: z.string().optional(),
  studentType: z.enum(["nuevo", "reinscrito"]).optional(),
  monthlyConcept: z.string().optional(),
  paymentDate: z.string().optional(),
  monthlyValue: z.string().optional(),
  totalInstallments: z.string().optional(),
  isScholarship: z.boolean().default(false).optional(),
  scholarshipDiscount: z.string().optional(),
});

type StudentFormValues = z.infer<typeof studentSchema>;

interface StudentFormProps {
  initialData?: any;
  onSuccess: () => void;
}

export function StudentForm({ initialData, onSuccess }: StudentFormProps) {
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState<1 | 2>(1);
  const [courses, setCourses] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [contractFile, setContractFile] = useState<File | null>(null);

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      password: "",
      phone: initialData?.phone || "",
      gender: initialData?.studentProfile?.gender || "",
      address: initialData?.studentProfile?.address || "",
      city: initialData?.studentProfile?.city || "",
      state: initialData?.studentProfile?.state || "",
      sede: initialData?.sede || "",
      courseId: "",
      groupId: "",
      studentType: "nuevo",
      monthlyConcept: "",
      paymentDate: "",
      monthlyValue: "",
      totalInstallments: "",
      isScholarship: false,
      scholarshipDiscount: "",
    },
  });

  const isEditMode = !!initialData;
  const studentType = form.watch("studentType");

  useEffect(() => {
    if (!isEditMode) {
      // Load courses and groups for new student enrollment
      getCoursesForEnrollment().then((res) => {
        if (res.success) setCourses(res.data || []);
      });
      getGroupsForEnrollment().then((res) => {
        if (res.success) setGroups(res.data || []);
      });
    }
  }, [isEditMode]);

  function handleNextStep() {
    form.trigger(["name", "email", "password", "sede"]).then((isValid) => {
      if (isValid) setStep(2);
    });
  }

  function onSubmit(values: StudentFormValues) {
    if (!isEditMode && step === 1) {
      handleNextStep();
      return;
    }

    startTransition(async () => {
      if (isEditMode) {
        const promise = updateStudent(initialData.id, values);
        await toast.promise(promise, {
          loading: "Actualizando alumno...",
          success: (result: any) => {
            if (result.success) {
              onSuccess();
              return "Alumno actualizado";
            }
            throw new Error(result.error);
          },
          error: (err) => err.message || "Error al actualizar",
        });
      } else {
        // Create student and then enroll
        let contractUrl = undefined;
        if (contractFile) {
          toast.info("Subiendo contrato...");
          const formData = new FormData();
          formData.append("file", contractFile);
          const uploadRes = await uploadContract(formData);
          if (uploadRes.success) {
            contractUrl = uploadRes.url;
          } else {
            toast.error("No se pudo subir el contrato, se continuará el registro sin él.");
          }
        }

        const dataToSubmit = { ...values, contractUrl };
        const promise = createStudent(dataToSubmit as any).then(async (res) => {
          if (!res.success) throw new Error(res.error);
          
          const newStudent = res.data;
          const studentProfileId = newStudent.studentProfile?.id;
          
          if (studentProfileId && values.courseId) {
            const enrollRes = await enrollStudentInCourse(
              studentProfileId,
              values.courseId,
              values.groupId || "",
              "", // cycleId placeholder, if needed later
              {
                monthlyConcept: values.monthlyConcept,
                paymentDate: values.paymentDate ? parseInt(values.paymentDate) : undefined,
                monthlyValue: values.monthlyValue ? parseFloat(values.monthlyValue) : undefined,
                totalInstallments: values.totalInstallments ? parseInt(values.totalInstallments) : undefined,
                isScholarship: values.isScholarship,
                scholarshipDiscount: values.scholarshipDiscount ? parseFloat(values.scholarshipDiscount) : undefined,
              }
            );
            if (!enrollRes.success) throw new Error(enrollRes.error);
          }
          return newStudent;
        });

        await toast.promise(promise, {
          loading: "Creando alumno e inscribiendo...",
          success: () => {
            onSuccess();
            return "Alumno registrado e inscrito con éxito";
          },
          error: (err) => err.message || "Error en el registro",
        });
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
        {step === 1 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej. Juan Pérez" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo Electrónico</FormLabel>
                    <FormControl>
                      <Input placeholder="juan@ejemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!initialData && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input placeholder="317..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Género</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MALE">Masculino</SelectItem>
                        <SelectItem value="FEMALE">Femenino</SelectItem>
                        <SelectItem value="OTHER">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sede"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sede</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona sede..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="SEAGRULLO">El Grullo</SelectItem>
                        <SelectItem value="SEAAUTLAN">Autlán</SelectItem>
                        <SelectItem value="SEAUNION">Unión de Tula</SelectItem>
                        <SelectItem value="EN_LINEA">En Línea</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium border-b pb-2">Ubicación</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Dirección</FormLabel>
                      <FormControl>
                        <Input placeholder="Calle y número" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ciudad</FormLabel>
                      <FormControl>
                        <Input placeholder="Autlán" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <Input placeholder="Jalisco" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {!isEditMode && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium border-b pb-2">Documentos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormItem>
                    <FormLabel>Contrato PDF</FormLabel>
                    <FormControl>
                      <Input 
                        type="file" 
                        accept="application/pdf"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setContractFile(e.target.files[0]);
                          }
                        }}
                      />
                    </FormControl>
                    <p className="text-[0.8rem] text-muted-foreground">Opcional. Se guardará en la nube.</p>
                  </FormItem>
                </div>
              </div>
            )}
          </>
        )}

        {!isEditMode && step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-medium border-b pb-2">Datos de Inscripción</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                name="studentType"
                render={({ field }) => (
                  <FormItem className="md:col-span-2 space-y-3">
                    <FormLabel>Tipo de Ingreso</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1 md:flex-row md:space-x-4 md:space-y-0"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="nuevo" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Alumno Nuevo (Inscripción: $800)
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="reinscrito" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Alumno Reinscrito (Inscripción: $600)
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <FormField
                control={form.control}
                name="monthlyConcept"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Concepto Mensualidad</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej. Colegiatura Mensual" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="paymentDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Día de Pago (1-31)</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" max="31" placeholder="Ej. 5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="monthlyValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor de Mensualidad ($)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Ej. 800" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="totalInstallments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cant. de Mensualidades a Cobrar</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" placeholder="Ej. 10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 bg-muted/50 p-4 rounded-lg border">
              <FormField
                control={form.control}
                name="isScholarship"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm bg-background">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Alumno Becado
                      </FormLabel>
                      <p className="text-[0.8rem] text-muted-foreground">
                        Aplicar descuento o beca a la mensualidad.
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              {form.watch("isScholarship") && (
                <FormField
                  control={form.control}
                  name="scholarshipDiscount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor de Descuento ($ o %)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Ej. 50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="bg-muted p-4 rounded-lg space-y-2 text-sm mt-4">
              <h4 className="font-semibold mb-2">Resumen de Costos</h4>
              <div className="flex justify-between border-b border-border pb-1">
                <span className="text-muted-foreground">Costo de Inscripción:</span>
                <span className="font-medium">${studentType === "nuevo" ? "800" : "600"}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-1">
                <span className="text-muted-foreground">Costo de Mensualidad:</span>
                <span className="font-medium">Variables por curso (Definir en Pagos)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total de Mensualidades:</span>
                <span className="font-medium">Definir en Plan de Pagos</span>
              </div>
            </div>

            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Aviso Importante</AlertTitle>
              <AlertDescription>
                Si la mensualidad no se paga entre el día 1 y 10 del mes, se agregará una multa automática al costo de la mensualidad.
              </AlertDescription>
            </Alert>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          {!isEditMode && step === 2 && (
            <Button type="button" variant="outline" onClick={() => setStep(1)} disabled={isPending}>
              Volver Atrás
            </Button>
          )}
          {isEditMode || step === 1 ? (
            <Button type="button" variant="outline" onClick={() => onSuccess()} disabled={isPending}>
              Cancelar
            </Button>
          ) : null}

          {(!isEditMode && step === 1) ? (
            <Button type="button" onClick={handleNextStep}>
              Siguiente: Inscripción
            </Button>
          ) : (
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditMode ? "Guardar Cambios" : "Finalizar Registro"}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
