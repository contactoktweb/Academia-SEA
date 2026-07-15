import { db } from "@/lib/db"
import { getSedeCondition } from "@/lib/multi-tenancy"
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
import { PlusCircle, Edit2, Trash2, FileText } from "lucide-react"
import Link from "next/link"
import { StudentDialog } from "./student-dialogs"

export async function StudentsTable({ query }: { query?: string }) {
  const sedeCondition = await getSedeCondition();
  
  const students = await db.user.findMany({
    where: { 
      role: "STUDENT",
      ...sedeCondition,
      ...(query ? {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } }
        ]
      } : {})
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      photoUrl: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      role: true,
      studentProfile: {
        select: {
          id: true,
          studentId: true,
          gender: true,
          address: true,
          city: true,
          state: true,
          emergencyContact: true,
          emergencyPhone: true,
          contractUrl: true,
          isActive: true,
          birthDate: true,
          enrollmentDate: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: { enrollments: true }
          }
        }
      }
    },
    orderBy: { name: "asc" },
  })

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Estudiantes Registrados</CardTitle>
          <CardDescription>
            {query ? `Mostrando resultados para "${query}" (${students.length})` : `Total de alumnos: ${students.length}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Alumno</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Cursos</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    {query ? "No se encontraron alumnos con esa búsqueda." : "No hay alumnos registrados aún."}
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
                        {student.studentProfile?._count?.enrollments || 0} cursos
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                        Activo
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {student.studentProfile && (
                          <a href={`/api/reports/boleta/${student.studentProfile.id}`} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Descargar Boleta">
                              <FileText className="h-4 w-4 text-blue-600" />
                            </Button>
                          </a>
                        )}
                        <StudentDialog mode="edit" student={student} />
                        <StudentDialog mode="delete" student={student} />
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
