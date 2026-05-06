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
import { Button } from "@/components/ui/button";
import { PlusCircle, CheckCircle2, XCircle, Clock, Edit2, Trash2 } from "lucide-react";
import Link from "next/link";
import { AttendanceDialog } from "./attendance-dialogs";

export async function AttendanceTable() {
  const attendances = await db.attendance.findMany({
    include: {
      student: { include: { user: true } },
    },
    orderBy: { date: "desc" },
    take: 100,
  });

  const presentCount = attendances.filter((a) => a.status === "PRESENT").length;
  const absentCount = attendances.filter((a) => a.status === "ABSENT").length;
  const lateCount = attendances.filter((a) => a.status === "LATE").length;

  const groupedByDate = attendances.reduce((acc: any, att) => {
    const date = att.date.toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(att);
    return acc;
  }, {});

  const dates = Object.keys(groupedByDate).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  return (
    <>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Registros</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendances.length}</div>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Presentes</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{presentCount}</div>
            <p className="text-xs text-muted-foreground">
              {attendances.length > 0
                ? ((presentCount / attendances.length) * 100).toFixed(0)
                : 0}
              %
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Ausentes</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{absentCount}</div>
            <p className="text-xs text-muted-foreground">
              {attendances.length > 0
                ? ((absentCount / attendances.length) * 100).toFixed(0)
                : 0}
              %
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Tarde</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{lateCount}</div>
            <p className="text-xs text-muted-foreground">
              {attendances.length > 0
                ? ((lateCount / attendances.length) * 100).toFixed(0)
                : 0}
              %
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center mt-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Asistencia</h2>
          <p className="text-muted-foreground">
            Registra y gestiona la asistencia diaria de estudiantes.
          </p>
        </div>
        <AttendanceDialog mode="add" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Asistencia</CardTitle>
          <CardDescription>Últimos 100 registros de asistencia</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dates.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No hay registros de asistencia aún.
              </p>
            ) : (
              dates.map((date) => (
                <div key={date} className="border rounded-lg p-4 bg-slate-50/50 dark:bg-slate-900/50">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    {date}
                  </h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Estudiante</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Notas</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {groupedByDate[date].map((att: any) => (
                        <TableRow key={att.id} className="bg-white dark:bg-slate-950">
                          <TableCell className="font-medium">
                            {att.student.user.name}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${
                                att.status === "PRESENT"
                                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                  : att.status === "ABSENT"
                                  ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                  : att.status === "LATE"
                                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                  : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                              }`}
                            >
                              {att.status === "PRESENT"
                                ? "Presente"
                                : att.status === "ABSENT"
                                ? "Ausente"
                                : att.status === "LATE"
                                ? "Tarde"
                                : "Excusado"}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {att.notes || "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <AttendanceDialog mode="edit" attendance={att} />
                              <AttendanceDialog mode="delete" attendance={att} />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
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
