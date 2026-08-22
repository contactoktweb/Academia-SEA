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
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useTransition, useEffect } from "react";
import { useSession } from "next-auth/react";
import { 
  createStudent, 
  updateStudent, 
  getCoursesForEnrollment, 
  getGroupsForEnrollment,
  enrollStudentInCourse,
  uploadContract,
  checkSiblingEmail
} from "@/app/dashboard/alumnos/actions";
import { toast } from "sonner";
import { Loader2, AlertCircle, FileText, Users, Sparkles, ShieldCheck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const studentSchema = z.object({
  name: z.string().min(2, "El nombre es muy corto"),
  email: z.string().email("Email inválido"),
  studentId: z.string().optional(),
  password: z.string().min(6, "Mínimo 6 caracteres").optional().or(z.literal("")),
  phone: z.string().optional(),
  gender: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  sede: z.string().optional(),
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
  isActive: z.boolean().optional(),
});

type StudentFormValues = z.infer<typeof studentSchema>;

interface StudentFormProps {
  initialData?: any;
  onSuccess: () => void;
  onCancel?: () => void;
}

const MEXICAN_STATES = [
  "Aguascalientes",
  "Baja California",
  "Baja California Sur",
  "Campeche",
  "Chiapas",
  "Chihuahua",
  "Coahuila",
  "Colima",
  "Ciudad de México",
  "Durango",
  "Estado de México",
  "Guanajuato",
  "Guerrero",
  "Hidalgo",
  "Jalisco",
  "Michoacán",
  "Morelos",
  "Nayarit",
  "Nuevo León",
  "Oaxaca",
  "Puebla",
  "Querétaro",
  "Quintana Roo",
  "San Luis Potosí",
  "Sinaloa",
  "Sonora",
  "Tabasco",
  "Tamaulipas",
  "Tlaxcala",
  "Veracruz",
  "Yucatán",
  "Zacatecas",
];

const CITIES_BY_STATE: Record<string, string[]> = {
  Jalisco: [
    "Autlán de Navarro",
    "El Grullo",
    "Unión de Tula",
    "Guadalajara",
    "Zapopan",
    "Tlaquepaque",
    "Tonalá",
    "Puerto Vallarta",
    "Ciudad Guzmán",
    "El Limón",
    "Casimiro Castillo",
    "Villa Purificación",
    "Tecolotlán",
    "Tuxcacuesco",
    "Cuautitlán de García Barragán",
    "Cihuatlán",
    "Tepatitlán de Morelos",
    "Lagos de Moreno",
    "Ameca",
    "Arandas",
    "Atotonilco el Alto",
    "Sayula",
    "Tala",
    "Tamazula de Gordiano",
    "Zapotlanejo",
    "Ocotlán",
    "Chapala",
  ],
  Colima: [
    "Colima",
    "Manzanillo",
    "Tecomán",
    "Villa de Álvarez",
    "Armería",
    "Comala",
    "Coquimatlán",
    "Cuauhtémoc",
    "Ixtlahuacán",
    "Minatitlán",
  ],
  "Ciudad de México": [
    "Álvaro Obregón",
    "Azcapotzalco",
    "Benito Juárez",
    "Coyoacán",
    "Cuajimalpa de Morelos",
    "Cuauhtémoc",
    "Gustavo A. Madero",
    "Iztacalco",
    "Iztapalapa",
    "La Magdalena Contreras",
    "Miguel Hidalgo",
    "Milpa Alta",
    "Tláhuac",
    "Tlalpan",
    "Venustiano Carranza",
    "Xochimilco",
  ],
  "Estado de México": [
    "Toluca",
    "Ecatepec de Morelos",
    "Nezahualcóyotl",
    "Naucalpan de Juárez",
    "Tlalnepantla de Baz",
    "Chimalhuacán",
    "Cuautitlán Izcalli",
    "Atizapán de Zaragoza",
    "Huixquilucan",
    "Metepec",
    "Texcoco",
  ],
  Michoacán: [
    "Morelia",
    "Uruapan",
    "Zamora",
    "Lázaro Cárdenas",
    "Apatzingán",
    "La Piedad",
    "Jiquilpan",
    "Sahuayo",
    "Pátzcuaro",
    "Zitácuaro",
  ],
  "Nuevo León": [
    "Monterrey",
    "Guadalupe",
    "San Pedro Garza García",
    "San Nicolás de los Garza",
    "Apodaca",
    "General Escobedo",
    "Santa Catarina",
    "Juárez",
    "García",
  ],
  Nayarit: [
    "Tepic",
    "Bahía de Banderas",
    "Compostela",
    "Ixtlán del Río",
    "San Blas",
    "Tecuala",
    "Tuxpan",
    "Xalisco",
    "Santiago Ixcuintla",
  ],
  Guanajuato: [
    "León",
    "Irapuato",
    "Celaya",
    "Salamanca",
    "Guanajuato",
    "San Miguel de Allende",
    "Silao de la Victoria",
  ],
  Querétaro: [
    "Santiago de Querétaro",
    "San Juan del Río",
    "El Marqués",
    "Corregidora",
    "Tequisquiapan",
  ],
  Sinaloa: [
    "Culiacán",
    "Mazatlán",
    "Los Mochis (Ahome)",
    "Guasave",
    "Guamúchil",
  ],
  Sonora: [
    "Hermosillo",
    "Ciudad Obregón",
    "Nogales",
    "San Luis Río Colorado",
    "Navojoa",
    "Guaymas",
  ],
  "Baja California": [
    "Tijuana",
    "Mexicali",
    "Ensenada",
    "Playas de Rosarito",
    "Tecate",
  ],
  "Baja California Sur": [
    "La Paz",
    "Los Cabos (Cabo San Lucas / San José del Cabo)",
    "Comondú",
    "Loreto",
  ],
  Coahuila: [
    "Saltillo",
    "Torreón",
    "Monclova",
    "Piedras Negras",
    "Acuña",
  ],
  Chihuahua: [
    "Juárez",
    "Chihuahua",
    "Cuauhtémoc",
    "Delicias",
    "Parral",
  ],
  Aguascalientes: [
    "Aguascalientes",
    "Jesús María",
    "Calvillo",
    "Rincón de Romos",
  ],
  Puebla: [
    "Puebla",
    "Tehuacán",
    "San Andrés Cholula",
    "San Pedro Cholula",
    "Atlixco",
  ],
  Veracruz: [
    "Veracruz",
    "Xalapa",
    "Coatzacoalcos",
    "Poza Rica",
    "Córdoba",
    "Orizaba",
  ],
  Yucatán: [
    "Mérida",
    "Kanasín",
    "Valladolid",
    "Tizimín",
    "Progreso",
  ],
  "Quintana Roo": [
    "Cancún",
    "Playa del Carmen",
    "Chetumal",
    "Cozumel",
    "Tulum",
  ],
  Chiapas: [
    "Tuxtla Gutiérrez",
    "Tapachula",
    "San Cristóbal de las Casas",
    "Comitán de Domínguez",
  ],
  Oaxaca: [
    "Oaxaca de Juárez",
    "Tuxtepec",
    "Juchitán de Zaragoza",
    "Puerto Escondido",
    "Huatulco",
  ],
  Tabasco: [
    "Villahermosa",
    "Cárdenas",
    "Comalcalco",
    "Macuspana",
  ],
  Tamaulipas: [
    "Reynosa",
    "Matamoros",
    "Nuevo Laredo",
    "Ciudad Victoria",
    "Tampico",
  ],
  Guerrero: [
    "Acapulco de Juárez",
    "Chilpancingo",
    "Iguala",
    "Zihuatanejo",
    "Taxco",
  ],
  Hidalgo: [
    "Pachuca de Soto",
    "Mineral de la Reforma",
    "Tulancingo",
    "Tula de Allende",
  ],
  Morelos: [
    "Cuernavaca",
    "Jiutepec",
    "Cuautla",
    "Temixco",
  ],
  "San Luis Potosí": [
    "San Luis Potosí",
    "Soledad de Graciano Sánchez",
    "Ciudad Valles",
    "Matehuala",
  ],
  Zacatecas: [
    "Zacatecas",
    "Guadalupe",
    "Fresnillo",
    "Jerez",
  ],
  Durango: [
    "Victoria de Durango",
    "Gómez Palacio",
    "Lerdo",
  ],
  Campeche: [
    "San Francisco de Campeche",
    "Ciudad del Carmen",
    "Champotón",
  ],
  Tlaxcala: [
    "Tlaxcala",
    "Apizaco",
    "Huamantla",
    "Chiautempan",
  ],
};

const DEFAULT_CITIES = [
  "Autlán",
  "Autlán de Navarro",
  "El Grullo",
  "Unión de Tula",
  "Guadalajara",
  "Zapopan",
  "Tlaquepaque",
  "Tonalá",
  "Puerto Vallarta",
  "Ciudad Guzmán",
];

export function StudentForm({ initialData, onSuccess, onCancel }: StudentFormProps) {
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState<1 | 2>(1);
  const [courses, setCourses] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [contractFile, setContractFile] = useState<File | null>(null);
  const [siblingInfo, setSiblingInfo] = useState<{ exists: boolean; count: number; siblings: any[] } | null>(null);

  const { data: session } = useSession();
  const activeSede = (session?.user as any)?.sede || "SEAAUTLAN";

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      studentId: initialData?.studentProfile?.studentId || "",
      password: "",
      phone: initialData?.phone || "",
      gender: initialData?.studentProfile?.gender || "",
      address: initialData?.studentProfile?.address || "",
      city: initialData?.studentProfile?.city || "",
      state: initialData?.studentProfile?.state || "",
      sede: initialData?.sede || activeSede,
      courseId: "",
      groupId: "",
      studentType: "nuevo",
      monthlyConcept: "",
      paymentDate: "",
      monthlyValue: "",
      totalInstallments: "",
      isScholarship: false,
      scholarshipDiscount: "",
      isActive: initialData?.isActive ?? true,
    },
  });

  const isEditMode = !!initialData;
  const watchedEmail = form.watch("email");
  const studentType = form.watch("studentType");
  const monthlyValue = form.watch("monthlyValue");
  const totalInstallments = form.watch("totalInstallments");
  const isScholarship = form.watch("isScholarship");
  const scholarshipDiscount = form.watch("scholarshipDiscount");

  const DRAFT_KEY = "sea_draft_student_form";
  const [hasDraft, setHasDraft] = useState(false);

  // 1. Restaurar borrador automáticamente si el modal se cerró por accidente
  useEffect(() => {
    if (isEditMode) return;
    try {
      const savedDraft = localStorage.getItem(DRAFT_KEY);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed && typeof parsed === "object") {
          const hasContent = parsed.name || parsed.email || parsed.phone || parsed.studentId;
          if (hasContent) {
            setHasDraft(true);
            form.reset({
              name: parsed.name || "",
              email: parsed.email || "",
              studentId: parsed.studentId || "",
              password: parsed.password || "",
              phone: parsed.phone || "",
              gender: parsed.gender || "",
              address: parsed.address || "",
              city: parsed.city || "",
              state: parsed.state || "",
              sede: parsed.sede || activeSede,
              courseId: parsed.courseId || "",
              groupId: parsed.groupId || "",
              studentType: parsed.studentType || "nuevo",
              monthlyConcept: parsed.monthlyConcept || "",
              paymentDate: parsed.paymentDate || "",
              monthlyValue: parsed.monthlyValue || "",
              totalInstallments: parsed.totalInstallments || "",
              isScholarship: parsed.isScholarship || false,
              scholarshipDiscount: parsed.scholarshipDiscount || "",
              isActive: true,
            });
            if (parsed._step && (parsed._step === 1 || parsed._step === 2)) {
              setStep(parsed._step);
            }
          }
        }
      }
    } catch (err) {
      console.error("Error restoring student draft:", err);
    }
  }, [isEditMode, activeSede]);

  // 2. Guardar borrador en tiempo real mientras el usuario escribe
  const watchedAll = form.watch();
  useEffect(() => {
    if (isEditMode) return;
    const timer = setTimeout(() => {
      try {
        const hasContent = watchedAll.name || watchedAll.email || watchedAll.phone || watchedAll.studentId || watchedAll.address;
        if (hasContent) {
          localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...watchedAll, _step: step }));
          setHasDraft(true);
        }
      } catch (err) {
        console.error("Error saving student draft:", err);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [watchedAll, step, isEditMode]);

  const handleClearDraft = () => {
    try {
      localStorage.removeItem(DRAFT_KEY);
      setHasDraft(false);
      form.reset({
        name: "",
        email: "",
        studentId: "",
        password: "",
        phone: "",
        gender: "",
        address: "",
        city: "",
        state: "",
        sede: activeSede,
        courseId: "",
        groupId: "",
        studentType: "nuevo",
        monthlyConcept: "",
        paymentDate: "",
        monthlyValue: "",
        totalInstallments: "",
        isScholarship: false,
        scholarshipDiscount: "",
        isActive: true,
      });
      setStep(1);
      setSiblingInfo(null);
      toast.info("Borrador limpiado");
    } catch (err) {
      console.error("Error clearing draft:", err);
    }
  };

  // Detectar automáticamente si el correo ingresado pertenece a una cuenta familiar / hermanos
  useEffect(() => {
    if (isEditMode) return;
    if (!watchedEmail || !watchedEmail.includes("@") || watchedEmail.length < 5) {
      setSiblingInfo(null);
      return;
    }

    const timer = setTimeout(async () => {
      const res = await checkSiblingEmail(watchedEmail);
      if (res.exists) {
        setSiblingInfo(res);
      } else {
        setSiblingInfo(null);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [watchedEmail, isEditMode]);

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

  async function handleNextStep(e?: React.MouseEvent) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const isValid = await form.trigger(["name", "email", "password"]);
    if (isValid) {
      setStep(2);
      setTimeout(() => {
        const dialogContent = document.querySelector('[role="dialog"]');
        if (dialogContent) {
          dialogContent.scrollTop = 0;
        }
      }, 50);
    }
  }

  function onSubmit(values: StudentFormValues) {
    if (!isEditMode && step === 1) {
      handleNextStep();
      return;
    }

    if (!isEditMode && step !== 2) {
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
          if (!res.success) {
            setStep(1);
            form.setError("email", {
              type: "manual",
              message: res.error || "El correo electrónico ya está registrado.",
            });
            throw new Error(res.error);
          }
          
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
            try {
              localStorage.removeItem(DRAFT_KEY);
              setHasDraft(false);
            } catch {}
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
      <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
            e.preventDefault();
          }
        }}
        className="space-y-4 pt-4"
      >
        {hasDraft && !isEditMode && (
          <div className="flex items-center justify-between bg-blue-50/90 border border-blue-200/80 rounded-xl px-3.5 py-2 text-xs text-blue-900 mb-1 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 font-medium">
              <span className="h-2 w-2 rounded-full bg-[#0066cc] animate-pulse inline-block" />
              <span>Borrador recuperado automáticamente</span>
            </div>
            <button
              type="button"
              onClick={handleClearDraft}
              className="text-xs text-blue-700 hover:text-red-600 underline font-bold cursor-pointer transition-colors"
            >
              Limpiar formulario
            </button>
          </div>
        )}

        {step === 1 && (
          <>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 border-b pb-2 mb-3">Información Personal</h3>
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

              {/* Alerta de Hermanos / Cuenta Familiar Compartida */}
              {siblingInfo?.exists && (
                <div className="md:col-span-2 rounded-2xl bg-blue-50/90 p-4 border border-blue-200/80 text-xs text-blue-950 flex items-start gap-3 shadow-2xs animate-in fade-in zoom-in-95 duration-200">
                  <div className="h-8 w-8 rounded-xl bg-blue-500/20 text-[#0066cc] flex items-center justify-center shrink-0 mt-0.5">
                    <Users className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-extrabold text-[#0066cc] text-sm flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                      Cuenta Familiar / Hermanos Detectada
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                      Este correo ya pertenece a: <strong className="text-slate-900">{siblingInfo.siblings.map((s: any) => s.name).join(", ")}</strong>.
                      Este nuevo alumno se registrará de forma <strong>independiente</strong> con sus propias materias, calificaciones, asistencias y matrícula propia.
                    </p>
                  </div>
                </div>
              )}

              <FormField
                control={form.control}
                name="studentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <span>Matrícula / ID Interno</span>
                      <span className="text-[11px] text-slate-400 font-normal">(Identificador único)</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Ej. SEA-AUT-2026-001 (Auto si se deja vacío)" {...field} />
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
              {isEditMode && (
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm md:col-span-2">
                      <div className="space-y-0.5">
                        <FormLabel>Estado del Alumno</FormLabel>
                        <p className="text-xs text-muted-foreground">
                          {field.value ? "El alumno está activo" : "El alumno está inactivo"}
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="space-y-4 pt-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 border-b pb-2">Ubicación</h3>
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
                  name="state"
                  render={({ field }) => {
                    const currentState = field.value || "";
                    const stateOptions = Array.from(
                      new Set(
                        [...MEXICAN_STATES, currentState].filter(Boolean)
                      )
                    );

                    return (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <Select
                          onValueChange={(val) => {
                            field.onChange(val);
                            // When state changes, reset city or set to the first city of that state
                            const newCities = CITIES_BY_STATE[val];
                            form.setValue("city", newCities && newCities.length > 0 ? newCities[0] : "");
                          }}
                          value={field.value || ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona estado..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-60 overflow-y-auto">
                            {stateOptions.map((st) => (
                              <SelectItem key={st} value={st}>
                                {st}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => {
                    const selectedState = form.watch("state");
                    const currentCity = field.value || "";
                    const availableCities = selectedState && CITIES_BY_STATE[selectedState]
                      ? CITIES_BY_STATE[selectedState]
                      : (selectedState ? [] : DEFAULT_CITIES);

                    const cityOptions = Array.from(
                      new Set(
                        [...availableCities, currentCity].filter(Boolean)
                      )
                    );

                    return (
                      <FormItem>
                        <FormLabel>Ciudad / Municipio</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ""}
                          disabled={!selectedState}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={selectedState ? "Selecciona ciudad..." : "Primero selecciona un estado"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-60 overflow-y-auto">
                            {cityOptions.map((ct) => (
                              <SelectItem key={ct} value={ct}>
                                {ct}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
            </div>

            {!isEditMode && (
              <div className="space-y-4 pt-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 border-b pb-2">Documentos</h3>
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
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 border-b pb-2">Datos de Inscripción</h3>
            
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

            <div className="bg-muted p-4 rounded-lg space-y-2 text-sm mt-4 border border-border">
              <h4 className="font-bold text-base text-slate-900 dark:text-slate-100 border-b pb-2 mb-2">Resumen de Costos</h4>
              <div className="flex justify-between border-b border-border pb-1">
                <span className="text-muted-foreground">Costo de Inscripción:</span>
                <span className="font-semibold text-foreground">
                  ${studentType === "reinscrito" ? "600" : "800"}
                </span>
              </div>
              <div className="flex justify-between border-b border-border pb-1">
                <span className="text-muted-foreground">Costo de Mensualidad:</span>
                <span className="font-semibold text-foreground">
                  {monthlyValue ? (
                    isScholarship && scholarshipDiscount && !isNaN(parseFloat(scholarshipDiscount)) ? (
                      `$${Math.max(0, parseFloat(monthlyValue) - parseFloat(scholarshipDiscount))} ($${monthlyValue} - $${scholarshipDiscount} beca)`
                    ) : (
                      `$${monthlyValue}`
                    )
                  ) : (
                    "Variables por curso (Definir en Pagos)"
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total de Mensualidades:</span>
                <span className="font-semibold text-foreground">
                  {totalInstallments ? `${totalInstallments} mensualidad(es)` : "Definir en Plan de Pagos"}
                </span>
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

        <div className="flex justify-end gap-3 pt-4 border-t mt-6">
          {!isEditMode && step === 2 && (
            <Button 
              key="btn-back"
              type="button" 
              variant="outline" 
              onClick={(e) => {
                e.preventDefault();
                setStep(1);
                setTimeout(() => {
                  const dialogContent = document.querySelector('[role="dialog"]');
                  if (dialogContent) {
                    dialogContent.scrollTop = 0;
                  }
                }, 50);
              }} 
              disabled={isPending}
            >
              Volver Atrás
            </Button>
          )}

          {(isEditMode || step === 1) && (
            <Button 
              key="btn-cancel"
              type="button" 
              variant="outline" 
              onClick={(e) => {
                e.preventDefault();
                if (onCancel) {
                  onCancel();
                } else {
                  onSuccess();
                }
              }} 
              disabled={isPending}
            >
              Cancelar
            </Button>
          )}

          {!isEditMode && step === 1 && (
            <Button 
              key="btn-next"
              type="button" 
              onClick={handleNextStep}
              disabled={isPending}
            >
              Siguiente: Inscripción
            </Button>
          )}

          {(isEditMode || step === 2) && (
            <Button 
              key="btn-submit"
              type="submit" 
              disabled={isPending}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditMode ? "Guardar Cambios" : "Finalizar Registro"}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
