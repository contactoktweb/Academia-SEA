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

interface Teacher {
  id: string
  name: string
  email: string
  phone?: string
  photoUrl?: string
  teacherProfile?: {
    specialization?: string
    courses: Array<{ id: string }>
  }
}

export function TeachersTableClient() {
  const { data: teachers, loading, error } = useTableData<Teacher>({
    endpoint: "/api/dashboard/teachers",
  })

  if (error) {
    return (
      <div className="text-center py-6 text-red-600">
        Error al cargar profesores: {error.message}
      </div>
    )
  }

  if (loading || !teachers) {
    return <TableSkeleton rows={5} columns={6} />
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Profesores</h2>
          <p className="text-muted-foreground">
            Administra a los docentes, sus perfiles y materias asignadas.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/profesores/nuevo">
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir Profesor
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Docentes Registrados</CardTitle>
          <CardDescription>
            Total de profesores: {teachers.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Profesor</TableHead>
                <TableHead>Especialidad</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Cursos Asignados</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No hay profesores registrados aún.
                  </TableCell>
                </TableRow>
              ) : (
                teachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={teacher.photoUrl || ""}
                          alt={teacher.name}
                        />
                        <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{teacher.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {teacher.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {teacher.teacherProfile?.specialization || "-"}
                    </TableCell>
                    <TableCell>{teacher.phone || "-"}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {teacher.teacherProfile?.courses?.length || 0}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
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
                          <Link href={`/dashboard/profesores/${teacher.id}`}>
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
