import { db } from "@/lib/db"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { PlusCircle, Edit2, Trash2 } from "lucide-react"
import Link from "next/link"
import { CourseDialog } from "./course-dialogs"

export async function CoursesTable({ isAdmin = true }: { isAdmin?: boolean }) {
  const rawCourses = await db.course.findMany({
    include: {
      cycle: true,
      assignments: {
        include: {
          teacher: { include: { user: true } },
          group: true,
        },
      },
      enrollments: true,
      units: true,
    },
    orderBy: { name: "asc" },
  })

  // Serialize Decimal objects for Client Components
  const courses = rawCourses.map(course => ({
    ...course,
    assignments: course.assignments.map(as => ({
      ...as,
      teacher: as.teacher ? {
        ...as.teacher,
        salary: as.teacher.salary ? Number(as.teacher.salary) : null,
      } : null,
    })),
  })) as any;

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Cursos</h2>
          <p className="text-muted-foreground">
            Administra los cursos, asignaturas y su contenido académico.
          </p>
        </div>
        {isAdmin && <CourseDialog mode="add" />}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cursos Registrados</CardTitle>
          <CardDescription>Total de cursos: {courses.length}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Curso</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Nivel</TableHead>
                <TableHead>Profesores</TableHead>
                <TableHead>Estudiantes</TableHead>
                <TableHead>Unidades</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No hay cursos registrados aún.
                  </TableCell>
                </TableRow>
              ) : (
                courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.name}</TableCell>
                    <TableCell>
                      <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                        {course.code}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{course.level}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {course.assignments.length}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded">
                        {course.enrollments.length}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{course.units.length}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {isAdmin && (
                          <>
                            <CourseDialog mode="edit" course={course} />
                            <CourseDialog mode="delete" course={course} />
                          </>
                        )}
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
  )
}
