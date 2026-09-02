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
import { PlusCircle, Edit2, Trash2, HelpCircle, BookOpen } from "lucide-react"
import Link from "next/link"
import { TeacherDialog } from "./teacher-dialogs"
import { AssignTeacherDialog } from "./assign-teacher-dialog"

export async function TeachersTable() {
  const sedeCondition = await getSedeCondition();

  const rawTeachers = await db.user.findMany({
    where: { role: "TEACHER", ...sedeCondition, deletedAt: null },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      photoUrl: true,
      isActive: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      teacherProfile: {
        select: {
          id: true,
          employeeId: true,
          specialty: true,
          hireDate: true,
          salary: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          courses: {
            select: {
              id: true,
              customMonthlyFee: true,
              course: { select: { name: true } },
              group: { select: { name: true } },
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
      courses: teacher.teacherProfile.courses.map(c => ({
        ...c,
        customMonthlyFee: c.customMonthlyFee ? Number(c.customMonthlyFee) : null,
      })),
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
                              <BookOpen className="h-4 w-4" /> 
                              <span>Asignar curso a profesor</span>
                            </li>
                            <li className="flex items-center gap-2 text-slate-700 font-medium">
                              <Edit2 className="h-4 w-4" /> 
                              <span>Editar información</span>
                            </li>
                            <li className="flex items-center gap-2 text-red-600 font-medium">
                              <Trash2 className="h-4 w-4" /> 
                              <span>Eliminar profesor</span>
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
              {teachers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No hay profesores registrados aún.
                  </TableCell>
                </TableRow>
              ) : (
                teachers.map((teacher: any) => (
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
                      <div className="flex flex-wrap gap-1">
                        {teacher.teacherProfile?.courses?.length ? (
                          teacher.teacherProfile.courses.map((assignment: any) => (
                            <span key={assignment.id} className="inline-flex flex-col items-start rounded-md bg-slate-100 px-2 py-1 text-xs">
                              <span className="font-medium">{assignment.course?.name} ({assignment.group?.name || "Sin grupo"})</span>
                              {assignment.customMonthlyFee && (
                                <span className="text-green-600 font-semibold">Precio Personalizado: ${Number(assignment.customMonthlyFee).toFixed(2)}</span>
                              )}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground">0 asignados</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                        Activo
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {teacher.teacherProfile && (
                          <AssignTeacherDialog 
                            teacherProfileId={teacher.teacherProfile.id} 
                            teacherName={teacher.name} 
                          />
                        )}
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
