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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PlusCircle, Edit2, Trash2 } from "lucide-react"
import Link from "next/link"
import { TeacherDialog } from "./teacher-dialogs"

export async function TeachersTable() {
  const rawTeachers = await db.user.findMany({
    where: { role: "TEACHER" },
    include: {
      teacherProfile: {
        include: {
          courses: {
            include: {
              course: true,
              group: true,
            },
          },
        },
      },
    },
    orderBy: { name: "asc" },
  })

  // Serialize Decimal objects for Client Components
  const teachers = rawTeachers.map(teacher => ({
    ...teacher,
    teacherProfile: teacher.teacherProfile ? {
      ...teacher.teacherProfile,
      salary: teacher.teacherProfile.salary ? Number(teacher.teacherProfile.salary) : null,
    } : null,
  })) as any;

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Profesores</h2>
          <p className="text-muted-foreground">
            Administra a los docentes, sus perfiles y materias asignadas.
          </p>
        </div>
        <TeacherDialog mode="add" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Docentes Registrados</CardTitle>
          <CardDescription>Total de profesores: {teachers.length}</CardDescription>
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
                      {teacher.teacherProfile?.specialty || "-"}
                    </TableCell>
                    <TableCell>{teacher.phone || "-"}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {teacher.teacherProfile?.courses?.length || 0} asignados
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                        Activo
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <TeacherDialog mode="edit" teacher={teacher} />
                        <TeacherDialog mode="delete" teacher={teacher} />
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
