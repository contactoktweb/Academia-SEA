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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PlusCircle, Edit2, Trash2 } from "lucide-react"
import Link from "next/link"
import { TableSkeleton } from "./table-skeleton"

interface Student {
  id: string
  name: string
  email: string
  phone?: string
  photoUrl?: string
  studentProfile?: {
    enrollments: Array<{ id: string }>
    familyLinks: Array<{ id: string }>
  }
}

export function StudentsTableClient() {
  const { data: students, loading, error } = useTableData<Student>({
    endpoint: "/api/dashboard/students",
  })

  if (error) {
    return (
      <div className="text-center py-6 text-red-600">
        Error al cargar alumnos: {error.message}
      </div>
    )
  }

  if (loading || !students) {
    return <TableSkeleton rows={5} columns={6} />
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Alumnos</h2>
          <p className="text-muted-foreground">
            Administra los datos y matrícula de estudiantes.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/alumnos/nuevo">
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir Alumno
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Estudiantes Registrados</CardTitle>
          <CardDescription>Total de alumnos: {students.length}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Alumno</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Cursos</TableHead>
                <TableHead>Familia</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No hay alumnos registrados aún.
                  </TableCell>
                </TableRow>
              ) : (
                students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={student.photoUrl || ""}
                          alt={student.name}
                        />
                        <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {student.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{student.phone || "-"}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {student.studentProfile?.enrollments?.length || 0}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {student.studentProfile?.familyLinks?.length || 0}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                        Activo
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
                          <Link href={`/dashboard/alumnos/${student.id}`}>
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
