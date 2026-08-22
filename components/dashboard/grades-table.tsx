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
import { GradeDialog } from "./grade-dialogs";
import { auth } from "@/lib/auth";
import { SearchInput } from "./search-input";

export async function GradesTable({ query = "" }: { query?: string }) {
  const sedeCondition = await getSedeCondition();
  const session = await auth();

  const [grades, students, exams, courseAssignments] = await Promise.all([
    db.grade.findMany({
      where: {
        student: {
          user: {
            ...sedeCondition,
            deletedAt: null,
          }
        }
      },
      include: {
        student: { include: { user: true } },
        exam: { include: { unit: { include: { course: true } } } },
        courseAssignment: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    db.studentProfile.findMany({
      where: {
        isActive: true,
        user: {
          ...sedeCondition,
          deletedAt: null,
        }
      },
      include: { user: true },
    }),
    db.exam.findMany({
      where: {
        unit: {
          course: {
            ...sedeCondition,
          }
        }
      },
      include: { unit: { include: { course: true } } },
    }),
    db.courseAssignment.findMany({
      where: {
        ...sedeCondition,
      },
      include: {
        course: true,
        group: true,
        teacher: { include: { user: true } },
      },
    }),
  ]);

  const userRole = session?.user?.role || "STUDENT";

  // Serializar campos Decimal para componentes de cliente
  const serializedAssignments = courseAssignments.map(ca => ({
    ...ca,
    teacher: ca.teacher ? {
      ...ca.teacher,
      salary: ca.teacher.salary ? Number(ca.teacher.salary) : null,
    } : null,
  }));

  const serializedGrades = grades.map(grade => ({
    ...grade,
    courseAssignment: grade.courseAssignment ? {
      ...grade.courseAssignment,
      // Aunque no incluimos teacher explícitamente, nos aseguramos de que sea un objeto plano
    } : null,
  }));

  const filteredGrades = query 
    ? serializedGrades.filter(grade => 
        grade.student.user.name.toLowerCase().includes(query.toLowerCase()) ||
        grade.student.user.email?.toLowerCase().includes(query.toLowerCase())
      )
    : serializedGrades;

  const serializedStudents = students.map(student => ({
    ...student,
    // No hay Decimal conocidos aquí, pero aseguramos objeto plano
  }));

  const serializedExams = exams.map(exam => ({
    ...exam,
    // maxScore y weight son Float, no Decimal, pero aseguramos objeto plano
  }));

  const averageGrade = grades.length > 0
    ? (grades.reduce((sum, g) => sum + g.value, 0) / grades.length).toFixed(2)
    : 0;

  const topStudents = grades
    .reduce((acc: any[], grade) => {
      const existing = acc.find((g) => g.studentId === grade.studentId);
      if (existing) {
        existing.grades.push(grade.value);
      } else {
        acc.push({ studentId: grade.studentId, grades: [grade.value], student: grade.student });
      }
      return acc;
    }, [])
    .map((g: any) => ({
      ...g,
      average: (g.grades.reduce((a: number, b: number) => a + b, 0) / g.grades.length).toFixed(2),
    }))
    .sort((a: any, b: any) => parseFloat(b.average) - parseFloat(a.average))
    .slice(0, 5);

  return (
    <>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Calificaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{grades.length}</div>
            <p className="text-xs text-muted-foreground">Registradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Promedio General</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageGrade}</div>
            <p className="text-xs text-muted-foreground">De 100</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Exámenes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exams.length}</div>
            <p className="text-xs text-muted-foreground">Creados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Mejores Alumnos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topStudents.length}</div>
            <p className="text-xs text-muted-foreground">Top 5</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center mt-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Calificaciones</h2>
          <p className="text-muted-foreground">
            Registra y gestiona las calificaciones de estudiantes.
          </p>
        </div>
        {userRole !== "ADMIN" && (
          <GradeDialog 
            mode="add" 
            students={serializedStudents} 
            exams={serializedExams} 
            courseAssignments={serializedAssignments} 
          />
        )}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Registro de Calificaciones</CardTitle>
            <CardDescription>Todas las calificaciones registradas</CardDescription>
          </div>
          <div className="w-full max-w-sm">
            <SearchInput placeholder="Buscar alumno por nombre o correo..." />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Estudiante</TableHead>
                <TableHead>Examen / Evaluación</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Calificación</TableHead>
                <TableHead>Comentario</TableHead>
                <TableHead>Fecha</TableHead>
                {userRole !== "ADMIN" && (
                  <TableHead className="text-right">Acciones</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGrades.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    {query ? "No se encontraron calificaciones para esa búsqueda." : "No hay calificaciones registradas aún."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredGrades.map((grade) => (
                  <TableRow key={grade.id}>
                    <TableCell className="font-medium">
                      {grade.student.user.name}
                    </TableCell>
                    <TableCell>{grade.exam?.title || "General"}</TableCell>
                    <TableCell>
                      {grade.exam?.unit.course.name || "N/A"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`font-bold text-lg ${
                          grade.value >= 85
                            ? "text-green-600"
                            : grade.value >= 70
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {grade.value.toFixed(1)}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {grade.comment || "-"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {grade.createdAt.toLocaleDateString()}
                    </TableCell>
                    {userRole !== "ADMIN" && (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <GradeDialog 
                            mode="edit" 
                            grade={grade}
                            students={serializedStudents} 
                            exams={serializedExams} 
                            courseAssignments={serializedAssignments} 
                          />
                          <GradeDialog 
                            mode="delete" 
                            grade={grade} 
                          />
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}

