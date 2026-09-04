import { db } from "@/lib/db";
import { getSedeCondition } from "@/lib/multi-tenancy";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { GradeDialog, StudentGradesDetailDialog } from "./grade-dialogs";
import { auth } from "@/lib/auth";
import { SearchInput } from "./search-input";
import { PlusCircle, BookOpen, TrendingUp, Users, ClipboardList } from "lucide-react";

export async function GradesTable({ query = "" }: { query?: string }) {
  const sedeCondition = await getSedeCondition();
  const session = await auth();

  const userRole = session?.user?.role || "STUDENT";
  const userId = session?.user?.id;

  // ─── Perfil del profesor si aplica ───────────────────────────────────────────
  let teacherProfile: { id: string } | null = null;
  if (userRole === "TEACHER" && userId) {
    teacherProfile = await db.teacherProfile.findUnique({
      where: { userId },
      select: { id: true },
    });
  }

  // ─── Filtro de estudiantes: solo los alumnos del profesor ────────────────────
  let studentFilter: any = {
    isActive: true,
    user: { ...sedeCondition, deletedAt: null },
  };

  if (teacherProfile) {
    studentFilter = {
      isActive: true,
      user: { deletedAt: null },
      enrollments: {
        some: {
          course: {
            assignments: {
              some: { teacherId: teacherProfile.id },
            },
          },
        },
      },
    };
  }

  // ─── Filtro de exámenes: solo del profesor ────────────────────────────────────
  let examFilter: any = {
    isActive: true,
    unit: { course: { ...sedeCondition } },
  };

  if (teacherProfile) {
    examFilter = {
      isActive: true,
      unit: {
        course: {
          assignments: { some: { teacherId: teacherProfile.id } },
        },
      },
    };
  }

  // ─── Consultas paralelas ──────────────────────────────────────────────────────
  const [students, exams, allGrades] = await Promise.all([
    db.studentProfile.findMany({
      where: studentFilter,
      include: {
        user: true,
        enrollments: {
          include: { course: true, group: true },
          take: 1,
        },
      },
      orderBy: { user: { name: "asc" } },
    }),
    db.exam.findMany({
      where: examFilter,
      include: { unit: { include: { course: true } } },
      orderBy: { createdAt: "asc" },
    }),
    db.grade.findMany({
      where: {
        student: studentFilter,
        comment: { not: { startsWith: "[CALIFICACIÓN ANULADA" } },
      },
      include: {
        student: { include: { user: true } },
        exam: { include: { unit: { include: { course: true } } } },
        courseAssignment: { include: { course: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  // ─── Serializar datos ─────────────────────────────────────────────────────────
  const serializedStudents = students.map((s) => ({
    ...s,
    user: { ...s.user },
    enrollments: s.enrollments.map((e) => ({
      ...e,
      course: e.course,
      group: e.group,
    })),
  }));

  const serializedExams = exams.map((e) => ({ ...e }));

  // Agrupar calificaciones por alumno
  const gradesByStudent = allGrades.reduce((acc: Record<string, any[]>, grade) => {
    if (!acc[grade.studentId]) acc[grade.studentId] = [];
    acc[grade.studentId].push(grade);
    return acc;
  }, {});

  // Calificaciones de evaluaciones específicas por alumno y examen
  const evalByStudentExam = allGrades.reduce(
    (acc: Record<string, Record<string, any>>, grade) => {
      if (!grade.examId) return acc;
      if (!acc[grade.studentId]) acc[grade.studentId] = {};
      acc[grade.studentId][grade.examId] = grade;
      return acc;
    },
    {}
  );

  // Estadísticas generales
  const totalGrades = allGrades.length;
  const avgGeneral =
    totalGrades > 0
      ? (allGrades.reduce((sum, g) => sum + g.value, 0) / totalGrades).toFixed(1)
      : "—";

  const aprobados = serializedStudents.filter((s) => {
    const sg = gradesByStudent[s.id] || [];
    if (sg.length === 0) return false;
    const avg = sg.reduce((sum: number, g: any) => sum + g.value, 0) / sg.length;
    return avg >= 70;
  }).length;

  // ─── Filtro de búsqueda ───────────────────────────────────────────────────────
  const filteredStudents = query
    ? serializedStudents.filter(
        (s) =>
          s.user.name.toLowerCase().includes(query.toLowerCase()) ||
          s.user.email?.toLowerCase().includes(query.toLowerCase())
      )
    : serializedStudents;

  return (
    <>
      {/* ── Resumen ─────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="size-4 text-primary" />
              Alumnos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-xs text-muted-foreground">En mis cursos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ClipboardList className="size-4 text-primary" />
              Evaluaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exams.length}</div>
            <p className="text-xs text-muted-foreground">Creadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="size-4 text-primary" />
              Promedio General
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgGeneral}</div>
            <p className="text-xs text-muted-foreground">De 100 pts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BookOpen className="size-4 text-primary" />
              Calificaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalGrades}</div>
            <p className="text-xs text-muted-foreground">Registradas</p>
          </CardContent>
        </Card>
      </div>

      {/* ── Header + Botón ──────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Calificaciones</h2>
          <p className="text-muted-foreground text-sm">
            {teacherProfile
              ? "Vista de mis alumnos y sus calificaciones"
              : "Registro de calificaciones de todos los alumnos"}
          </p>
        </div>
        {userRole !== "ADMIN" && (
          <GradeDialog
            mode="add"
            students={serializedStudents}
            exams={serializedExams}
          />
        )}
      </div>

      {/* ── Tabla Gradebook (Sábana de Notas) ──────────────────────────────── */}
      <Card className="mt-2">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle>
              Sábana de Calificaciones
            </CardTitle>
            <CardDescription>
              {filteredStudents.length} alumno{filteredStudents.length !== 1 ? "s" : ""} ·{" "}
              {exams.length} evaluaci{exams.length !== 1 ? "ones" : "ón"} registrada{exams.length !== 1 ? "s" : ""}
            </CardDescription>
          </div>
          <div className="w-full max-w-xs">
            <SearchInput placeholder="Buscar alumno..." />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredStudents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-6">
              <Users className="size-10 text-muted-foreground/40 mb-3" />
              <p className="font-semibold text-foreground">
                {query ? "No se encontraron alumnos" : "Sin alumnos asignados"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {query
                  ? "Intenta con otro término de búsqueda."
                  : "Aún no tienes alumnos inscritos en tus cursos."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    {/* Columna fija: Alumno */}
                    <TableHead className="min-w-[200px] font-semibold sticky left-0 bg-muted/50 z-10">
                      Estudiante
                    </TableHead>

                    {/* Columnas dinámicas: una por evaluación */}
                    {exams.map((exam) => (
                      <TableHead
                        key={exam.id}
                        className="text-center min-w-[110px] font-medium"
                      >
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="text-xs font-semibold truncate max-w-[100px]" title={exam.title}>
                            {exam.title}
                          </span>
                          <Badge variant="secondary" className="text-[9px] px-1 py-0 h-3.5 font-normal">
                            {exam.type === "EXAM"
                              ? "Examen"
                              : exam.type === "QUIZ"
                              ? "Quiz"
                              : exam.type === "HOMEWORK"
                              ? "Tarea"
                              : exam.type === "PROJECT"
                              ? "Proyecto"
                              : exam.type}
                          </Badge>
                        </div>
                      </TableHead>
                    ))}

                    {/* Otras notas */}
                    <TableHead className="text-center min-w-[90px] font-medium">
                      Otras notas
                    </TableHead>

                    {/* Promedio */}
                    <TableHead className="text-center min-w-[90px] font-semibold">
                      Promedio
                    </TableHead>

                    {/* Acciones */}
                    {userRole !== "ADMIN" && (
                      <TableHead className="text-center min-w-[120px]">
                        Acciones
                      </TableHead>
                    )}
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredStudents.map((student) => {
                    const studentGrades = gradesByStudent[student.id] || [];
                    const evalGrades = evalByStudentExam[student.id] || {};
                    const otherGrades = studentGrades.filter((g) => !g.examId);
                    const otherAvg =
                      otherGrades.length > 0
                        ? otherGrades.reduce((s: number, g: any) => s + g.value, 0) / otherGrades.length
                        : null;

                    // Promedio general del alumno
                    const overallAvg =
                      studentGrades.length > 0
                        ? studentGrades.reduce((sum: number, g: any) => sum + g.value, 0) / studentGrades.length
                        : null;

                    const courseName =
                      student.enrollments?.[0]?.course?.name || "";
                    const groupName =
                      student.enrollments?.[0]?.group?.name || "";

                    return (
                      <TableRow key={student.id} className="hover:bg-muted/30 transition-colors">
                        {/* Columna Alumno */}
                        <TableCell className="sticky left-0 bg-background z-10 border-r">
                          <div className="flex flex-col gap-0.5 min-w-0">
                            <span className="font-semibold text-sm text-foreground truncate">
                              {student.user.name}
                            </span>
                            {(courseName || groupName) && (
                              <span className="text-[10px] text-muted-foreground truncate">
                                {courseName}
                                {groupName ? ` · ${groupName}` : ""}
                              </span>
                            )}
                          </div>
                        </TableCell>

                        {/* Columnas de evaluaciones */}
                        {exams.map((exam) => {
                          const gradeForExam = evalGrades[exam.id];
                          return (
                            <TableCell key={exam.id} className="text-center px-2">
                              {gradeForExam ? (
                                <span
                                  className={`inline-block font-bold text-sm px-2 py-0.5 rounded-md ${
                                    gradeForExam.value >= 85
                                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                                      : gradeForExam.value >= 70
                                      ? "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
                                      : "bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300"
                                  }`}
                                >
                                  {gradeForExam.value.toFixed(1)}
                                </span>
                              ) : userRole !== "ADMIN" ? (
                                <GradeDialog
                                  mode="add"
                                  students={serializedStudents}
                                  exams={serializedExams}
                                  defaultStudentId={student.id}
                                  defaultExamId={exam.id}
                                  defaultType="EVALUATION"
                                  trigger={
                                    <button
                                      className="inline-flex items-center justify-center size-7 rounded-md border border-dashed border-muted-foreground/30 text-muted-foreground/50 hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all"
                                      title={`Calificar ${exam.title} para ${student.user.name}`}
                                    >
                                      <PlusCircle className="size-3.5" />
                                    </button>
                                  }
                                />
                              ) : (
                                <span className="text-muted-foreground/40 text-xs">—</span>
                              )}
                            </TableCell>
                          );
                        })}

                        {/* Otras notas */}
                        <TableCell className="text-center px-2">
                          {otherGrades.length > 0 ? (
                            <StudentGradesDetailDialog
                              student={student}
                              grades={otherGrades}
                              exams={serializedExams}
                              studentsList={serializedStudents}
                              trigger={
                                <button className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium">
                                  {otherGrades.length} nota{otherGrades.length !== 1 ? "s" : ""}
                                  {otherAvg !== null && (
                                    <span className="text-muted-foreground font-normal">
                                      ({otherAvg.toFixed(1)})
                                    </span>
                                  )}
                                </button>
                              }
                            />
                          ) : (
                            <span className="text-muted-foreground/40 text-xs">—</span>
                          )}
                        </TableCell>

                        {/* Promedio */}
                        <TableCell className="text-center">
                          {overallAvg !== null ? (
                            <span
                              className={`font-black text-base ${
                                overallAvg >= 85
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : overallAvg >= 70
                                  ? "text-amber-600 dark:text-amber-400"
                                  : "text-rose-600 dark:text-rose-400"
                              }`}
                            >
                              {overallAvg.toFixed(1)}
                            </span>
                          ) : (
                            <span className="text-muted-foreground/40 text-sm">—</span>
                          )}
                        </TableCell>

                        {/* Acciones */}
                        {userRole !== "ADMIN" && (
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              {/* Ver historial completo */}
                              <StudentGradesDetailDialog
                                student={student}
                                grades={studentGrades}
                                exams={serializedExams}
                                studentsList={serializedStudents}
                                trigger={
                                  <button
                                    className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground border rounded-md px-2 py-1 hover:bg-muted/60 transition-colors"
                                    title="Ver todas las calificaciones"
                                  >
                                    <BookOpen className="size-3.5" />
                                    <span>Ver</span>
                                  </button>
                                }
                              />

                              {/* Agregar nota rápida */}
                              <GradeDialog
                                mode="add"
                                students={serializedStudents}
                                exams={serializedExams}
                                defaultStudentId={student.id}
                                trigger={
                                  <button
                                    className="inline-flex items-center gap-1 text-xs font-medium text-primary border border-primary/40 rounded-md px-2 py-1 hover:bg-primary/10 transition-colors"
                                    title="Agregar calificación"
                                  >
                                    <PlusCircle className="size-3.5" />
                                    <span>+ Calificar</span>
                                  </button>
                                }
                              />
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
