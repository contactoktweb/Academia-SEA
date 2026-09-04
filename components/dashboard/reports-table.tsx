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
import { GenerateReportDialog } from "./generate-report-dialog";
import { SearchInput } from "./search-input";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { FileText, Printer, Trash2 } from "lucide-react";
import Link from "next/link";
import { ReportDeleteButton } from "./report-delete-button";

export async function ReportsTable({ query = "" }: { query?: string }) {
  const session = await auth();
  const userName = session?.user?.name || "Administrador";
  const userRole = session?.user?.role;

  let whereCondition: any = { type: "REPORT_CARD" };
  if (userRole === "TEACHER" && userName) {
    whereCondition = {
      type: "REPORT_CARD",
      generatedBy: userName,
    };
  }

  const reports = await db.report.findMany({
    where: whereCondition,
    include: {
      cycle: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const serializedReports = reports.map((report) => {
    const data = report.data as any;
    return {
      ...report,
      studentName: data.studentName || "Desconocido",
      courseName: data.courseName || null,
      generalAverage: data.generalAverage || "0.00",
    };
  });

  const filteredReports = query
    ? serializedReports.filter((report) =>
        report.studentName.toLowerCase().includes(query.toLowerCase()) ||
        report.title.toLowerCase().includes(query.toLowerCase())
      )
    : serializedReports;

  return (
    <>
      <div className="flex justify-between items-center mt-2 mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Boletas y Reportes</h2>
          <p className="text-muted-foreground">
            Genera e imprime boletas de calificaciones oficiales.
          </p>
        </div>
        <GenerateReportDialog userName={userName} />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Historial de Boletas Generadas</CardTitle>
            <CardDescription>Total de boletas: {reports.length}</CardDescription>
          </div>
          <div className="w-full max-w-sm">
            <SearchInput placeholder="Buscar por alumno o título..." />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Estudiante</TableHead>
                <TableHead>Ciclo Escolar</TableHead>
                <TableHead>Promedio Gen.</TableHead>
                <TableHead>Generado por</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    {query ? "No se encontraron boletas para esa búsqueda." : "No hay boletas generadas aún."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-500" />
                        {report.title}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold">{report.studentName}</span>
                        {report.courseName && (
                          <span className="text-[11px] text-muted-foreground">{report.courseName}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{report.cycle?.name || "Todos los ciclos"}</TableCell>
                    <TableCell>
                      <span className="font-bold text-sea-blue">{report.generalAverage}</span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{report.generatedBy}</TableCell>
                    <TableCell>
                      {new Date(report.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/dashboard/boletas/print/${report.id}`} target="_blank">
                          <Button variant="outline" size="sm" className="h-8 px-2 text-xs font-medium text-slate-700 hover:text-slate-900">
                            <Printer className="h-3.5 w-3.5 mr-1" />
                            Imprimir
                          </Button>
                        </Link>
                        <ReportDeleteButton reportId={report.id} />
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
  );
}
