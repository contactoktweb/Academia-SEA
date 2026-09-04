import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { PrintButton } from "@/components/dashboard/print-button";

export default async function PrintReportPage({
  params,
}: {
  params: Promise<{ reportId: string }>;
}) {
  const { reportId } = await params;

  const report = await db.report.findUnique({
    where: { id: reportId },
    include: { cycle: true },
  });

  if (!report || report.type !== "REPORT_CARD") {
    notFound();
  }

  const data = report.data as any;
  const courseAverages = data.courseAverages || [];

  return (
    <div className="min-h-screen bg-white text-black p-8 font-sans print:p-0">
      <div className="max-w-4xl mx-auto border border-slate-200 p-10 print:border-none print:p-4">
        {/* Header */}
        <div className="flex justify-between items-center border-b-2 border-[#0066cc] pb-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-[#0066cc] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">SEA</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#0066cc] uppercase tracking-wide">Academia SEA</h1>
              <p className="text-sm text-slate-600">Boleta Oficial de Calificaciones</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold">Fecha de Expedición:</p>
            <p className="text-sm">{new Date(report.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Student Info */}
        <div className="bg-slate-50 p-6 rounded-lg mb-8 border border-slate-200">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold">Nombre del Estudiante</p>
              <p className="text-lg font-bold text-slate-900">{data.studentName}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold">Matrícula / ID</p>
              <p className="text-lg font-medium text-slate-700">{data.studentId}</p>
            </div>
            {data.courseName && (
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">Curso Asignado</p>
                <p className="text-lg font-bold text-[#0066cc]">{data.courseName}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold">Ciclo Escolar</p>
              <p className="text-lg font-medium text-slate-700">{report.cycle?.name || "Historial Completo"}</p>
            </div>
          </div>
        </div>

        {/* Grades Table */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-[#0066cc] mb-4 uppercase">Desglose de Calificaciones</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b-2 border-slate-300">
                <th className="py-3 px-4 font-bold text-sm uppercase">Asignatura / Curso</th>
                <th className="py-3 px-4 font-bold text-sm uppercase text-center">Evaluaciones</th>
                <th className="py-3 px-4 font-bold text-sm uppercase text-right">Promedio Final</th>
              </tr>
            </thead>
            <tbody>
              {courseAverages.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-4 text-center text-slate-500 italic border-b border-slate-200">
                    No hay calificaciones registradas para mostrar.
                  </td>
                </tr>
              ) : (
                courseAverages.map((course: any, idx: number) => (
                  <tr key={idx} className="border-b border-slate-200">
                    <td className="py-3 px-4 font-medium">{course.name}</td>
                    <td className="py-3 px-4 text-center text-slate-600">{course.gradeCount}</td>
                    <td className="py-3 px-4 text-right font-bold text-lg">{course.average}</td>
                  </tr>
                ))
              )}
            </tbody>
            {courseAverages.length > 0 && (
              <tfoot>
                <tr className="bg-slate-50 border-t-2 border-[#0066cc]">
                  <td colSpan={2} className="py-4 px-4 text-right font-bold uppercase">Promedio General</td>
                  <td className="py-4 px-4 text-right font-bold text-2xl text-[#0066cc]">{data.generalAverage}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* Signatures */}
        <div className="mt-24 grid grid-cols-2 gap-12 text-center">
          <div>
            <div className="border-t border-black pt-2">
              <p className="font-bold">Dirección Académica</p>
              <p className="text-xs text-slate-500">Academia SEA</p>
            </div>
          </div>
          <div>
            <div className="border-t border-black pt-2">
              <p className="font-bold">Sello Escolar</p>
            </div>
          </div>
        </div>

        {/* Print Button (hidden on print) */}
        <div className="mt-12 text-center print:hidden flex flex-col items-center gap-4">
          <PrintButton />
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} Academia SEA.{" "}
            <a
              href="https://www.kytcode.lat"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline inline-flex items-center gap-1 text-slate-500"
            >
              Desarrollado por K&T <span className="text-black">🖤</span>
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
