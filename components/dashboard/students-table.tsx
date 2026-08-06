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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { PlusCircle, Edit2, Trash2, FileText, HelpCircle } from "lucide-react"
import Link from "next/link"
import { StudentDialog } from "./student-dialogs"

export async function StudentsTable({ query, isAdmin = true }: { query?: string, isAdmin?: boolean }) {
  const sedeCondition = await getSedeCondition();
  
  const students = await db.user.findMany({
    where: { 
      role: "STUDENT",
      deletedAt: null,
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
                <TableHead className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    Acciones
                    <TooltipProvider delayDuration={100}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-slate-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent side="top" align="end" className="bg-white border border-slate-200 text-slate-800 shadow-xl p-4 text-base rounded-xl z-50">
                          <p className="font-bold text-sea-blue border-b border-slate-100 pb-2 mb-2">Explicación de Botones:</p>
                          <ul className="space-y-2">
                            <li className="flex items-center gap-2 text-blue-600 font-medium">
                              <FileText className="h-4 w-4" /> 
                              <span>Descargar boleta PDF</span>
                            </li>
                            <li className="flex items-center gap-2 text-slate-700 font-medium">
                              <Edit2 className="h-4 w-4" /> 
                              <span>Editar información</span>
                            </li>
                            <li className="flex items-center gap-2 text-red-600 font-medium">
                              <Trash2 className="h-4 w-4" /> 
                              <span>Eliminar alumno</span>
                            </li>
                          </ul>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableHead>
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
                        <TooltipProvider delayDuration={100}>
                          {student.studentProfile && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <a href={`/api/reports/boleta/${student.studentProfile.id}`} target="_blank" rel="noopener noreferrer">
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Descargar Boleta">
                                    <FileText className="h-4 w-4 text-blue-600" />
                                  </Button>
                                </a>
                              </TooltipTrigger>
                              <TooltipContent><p>Descargar boleta</p></TooltipContent>
                            </Tooltip>
                          )}
                          {isAdmin && (
                            <>
                              <StudentDialog mode="edit" student={student} />
                              <StudentDialog mode="delete" student={student} />
                            </>
                          )}
                        </TooltipProvider>
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
