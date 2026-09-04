import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
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
import { XCircle, Clock, ShieldAlert, CheckCircle2, UserCheck } from "lucide-react";
import { AttendanceDialog } from "./attendance-dialogs";

export async function AttendanceTable() {
  const session = await auth();
  const userRole = session?.user?.role;
  const userId = session?.user?.id;
  const sedeCondition = await getSedeCondition();

  let studentFilter: any = {
    user: {
      ...sedeCondition,
      deletedAt: null,
    },
  };

  if (userRole === "TEACHER" && userId) {
    studentFilter = {
      enrollments: {
        some: {
          course: {
            assignments: {
              some: {
                teacher: {
                  userId: userId,
                },
              },
            },
          },
        },
      },
      user: {
        deletedAt: null,
      },
    };
  }

  // Por regla de negocio: solo se consultan inasistencias y retardos
  const attendances = await db.attendance.findMany({
    where: {
      status: { in: ["ABSENT", "EXCUSED", "LATE"] },
      student: studentFilter,
    },
    include: {
      student: {
        include: {
          user: true,
          enrollments: {
            include: {
              course: true,
              group: true,
            },
          },
        },
      },
    },
    orderBy: { date: "desc" },
    take: 100,
  });

  const absentCount = attendances.filter((a) => a.status === "ABSENT").length;
  const excusedCount = attendances.filter((a) => a.status === "EXCUSED").length;
  const lateCount = attendances.filter((a) => a.status === "LATE").length;

  const groupedByDate = attendances.reduce((acc: any, att) => {
    const date = att.date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(att);
    return acc;
  }, {});

  const dates = Object.keys(groupedByDate);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ABSENT":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold bg-red-50 text-red-700 border border-red-200">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            Inasistencia / Falta
          </span>
        );
      case "EXCUSED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            Falta Justificada
          </span>
        );
      case "LATE":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Retardo
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <>
      {/* Resumen de Inasistencias */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200 shadow-2xs">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Inasistencias</CardTitle>
            <ShieldAlert className="h-4 w-4 text-[#0066cc]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-800">{attendances.length}</div>
            <p className="text-xs text-muted-foreground mt-0.5">Faltas y retardos reportados</p>
          </CardContent>
        </Card>

        <Card className="border-red-100 bg-red-50/20 shadow-2xs">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-red-600">Faltas Injustificadas</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-red-600">{absentCount}</div>
            <p className="text-xs text-red-600/70 mt-0.5">Ausencias sin comprobante</p>
          </CardContent>
        </Card>

        <Card className="border-blue-100 bg-blue-50/20 shadow-2xs">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-blue-600">Faltas Justificadas</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-blue-600">{excusedCount}</div>
            <p className="text-xs text-blue-600/70 mt-0.5">Permisos y justificantes médicos</p>
          </CardContent>
        </Card>

        <Card className="border-amber-100 bg-amber-50/20 shadow-2xs">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-amber-600">Retardos</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-amber-600">{lateCount}</div>
            <p className="text-xs text-amber-600/70 mt-0.5">Llegadas con demora</p>
          </CardContent>
        </Card>
      </div>

      {/* Encabezado y Acción */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">Control de Asistencia e Inasistencias</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Registro de faltas y retardos por fecha (asistencia por excepción). Los alumnos que asisten no requieren registro.
          </p>
        </div>
        <AttendanceDialog mode="add" />
      </div>

      {/* Tabla agrupada por fecha */}
      <Card className="border-slate-200/90 shadow-2xs">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-base font-bold text-slate-800">Historial de Inasistencias</CardTitle>
          <CardDescription className="text-xs">
            Mostrando las últimas {attendances.length} inasistencias y retardos registrados en el sistema.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-6">
            {dates.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-3">
                  <UserCheck className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">No hay inasistencias registradas</h3>
                <p className="text-xs text-muted-foreground max-w-sm mt-1">
                  ¡Todos los alumnos cuentan con asistencia completa! Solo registra inasistencias cuando algún estudiante falte a clase.
                </p>
              </div>
            ) : (
              dates.map((date) => (
                <div key={date} className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs bg-white">
                  <div className="bg-slate-50/80 px-4 py-2.5 border-b border-slate-200/80 flex items-center justify-between">
                    <h3 className="font-extrabold text-xs capitalize text-slate-700 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#0066cc]" />
                      {date}
                    </h3>
                    <span className="text-[11px] font-semibold text-slate-500">
                      {groupedByDate[date].length} {groupedByDate[date].length === 1 ? "registro" : "registros"}
                    </span>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50/40 text-[11px] uppercase font-bold text-slate-500">
                        <TableHead>Estudiante</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Motivo / Observaciones</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {groupedByDate[date].map((att: any) => {
                        const enrollments = att.student?.enrollments || [];
                        const courseInfo = enrollments.length > 0
                          ? `${enrollments[0].course?.name || "Curso"}${enrollments[0].group?.name ? ` - ${enrollments[0].group.name}` : ""}`
                          : null;

                        return (
                          <TableRow key={att.id} className="hover:bg-slate-50/60">
                            <TableCell className="font-semibold text-xs text-slate-800">
                              <div className="flex flex-col">
                                <span>{att.student?.user?.name || "Estudiante"}</span>
                                {courseInfo && (
                                  <span className="text-[11px] font-normal text-slate-400">
                                    {courseInfo}
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{getStatusBadge(att.status)}</TableCell>
                            <TableCell className="text-xs text-slate-600 max-w-xs truncate">
                              {att.notes || <span className="text-slate-400 italic">Sin observaciones</span>}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <AttendanceDialog mode="edit" attendance={att} />
                                <AttendanceDialog mode="delete" attendance={att} />
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
