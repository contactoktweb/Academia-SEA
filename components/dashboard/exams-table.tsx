import { db } from "@/lib/db";
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
import { ExamDialog } from "./exam-dialogs";
import { SearchInput } from "./search-input";

export async function ExamsTable({ query = "" }: { query?: string }) {
  const exams = await db.exam.findMany({
    include: {
      unit: {
        include: {
          course: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const serializedExams = exams.map((exam) => ({
    ...exam,
    // Max score & weight might need to be converted to plain numbers if they were decimals,
    // but they are Float in Prisma which is just a number in JS. So this is safe.
  }));

  const filteredExams = query
    ? serializedExams.filter((exam) =>
        exam.title.toLowerCase().includes(query.toLowerCase()) ||
        exam.unit.course.name.toLowerCase().includes(query.toLowerCase())
      )
    : serializedExams;

  const getExamTypeLabel = (type: string) => {
    switch (type) {
      case "EXAM": return "Examen";
      case "QUIZ": return "Quiz";
      case "PROJECT": return "Proyecto";
      case "HOMEWORK": return "Tarea";
      default: return type;
    }
  };

  const getExamTypeColor = (type: string) => {
    switch (type) {
      case "EXAM": return "bg-red-50 text-red-700 border-red-200";
      case "QUIZ": return "bg-orange-50 text-orange-700 border-orange-200";
      case "PROJECT": return "bg-blue-50 text-blue-700 border-blue-200";
      case "HOMEWORK": return "bg-green-50 text-green-700 border-green-200";
      default: return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mt-2 mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Exámenes y Evaluaciones</h2>
          <p className="text-muted-foreground">
            Administra las evaluaciones de cada unidad y curso.
          </p>
        </div>
        <ExamDialog mode="add" />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Listado de Evaluaciones</CardTitle>
            <CardDescription>Total de evaluaciones: {exams.length}</CardDescription>
          </div>
          <div className="w-full max-w-sm">
            <SearchInput placeholder="Buscar por título o curso..." />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Curso / Unidad</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Puntaje Max.</TableHead>
                <TableHead>Peso</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExams.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    {query ? "No se encontraron evaluaciones para esa búsqueda." : "No hay evaluaciones registradas."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredExams.map((exam) => (
                  <TableRow key={exam.id}>
                    <TableCell className="font-medium">{exam.title}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold">{exam.unit.course.name}</span>
                        <span className="text-xs text-muted-foreground">{exam.unit.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getExamTypeColor(exam.type)}`}>
                        {getExamTypeLabel(exam.type)}
                      </span>
                    </TableCell>
                    <TableCell>{exam.maxScore}</TableCell>
                    <TableCell>{(exam.weight * 100).toFixed(0)}%</TableCell>
                    <TableCell>
                      {exam.examDate ? new Date(exam.examDate).toLocaleDateString() : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <ExamDialog mode="edit" exam={exam} />
                        <ExamDialog mode="delete" exam={exam} />
                      </div>
                    </TableCell>
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
