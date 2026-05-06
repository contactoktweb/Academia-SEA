"use client"

import { useTableData } from "@/hooks/use-table-data"
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
import { TableSkeleton } from "./table-skeleton"

interface Course {
  id: string
  name: string
  code: string
  level: string
  assignments: Array<{ id: string }>
  enrollments: Array<{ id: string }>
  units: Array<{ id: string }>
}

export function CoursesTableClient() {
  const { data: courses, loading, error } = useTableData<Course>({
    endpoint: "/api/dashboard/courses",
  })

  if (error) {
    return (
      <div className="text-center py-6 text-red-600">
        Error al cargar cursos: {error.message}
      </div>
    )
  }

  if (loading || !courses) {
    return <TableSkeleton rows={5} columns={7} />
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Cursos</h2>
          <p className="text-muted-foreground">
            Administra los cursos, asignaturas y su contenido académico.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/cursos/nuevo">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nuevo Curso
          </Link>
        </Button>
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
                      <span className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded">
                        {course.units.length}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="h-8 w-8 p-0"
                        >
                          <Link href={`/dashboard/cursos/${course.id}`}>
                            <Edit2 className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
