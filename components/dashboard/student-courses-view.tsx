"use client";

import Link from "next/link";
import { 
  BookOpen, 
  Lock, 
  CheckCircle2, 
  CreditCard, 
  Calendar, 
  Users, 
  Award, 
  ArrowRight, 
  Sparkles, 
  GraduationCap, 
  AlertCircle,
  FileCheck,
  ChevronRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface StudentCoursesViewProps {
  access: {
    studentName?: string;
    isPaidAndActive: boolean;
    hasApprovedHistory: boolean;
    activeCourses: any[];
    lockedCourses: any[];
    approvedCourses: any[];
    hasPendingPayment: boolean;
  };
}

export function StudentCoursesView({ access }: StudentCoursesViewProps) {
  const { isPaidAndActive, hasApprovedHistory, activeCourses, lockedCourses, approvedCourses, hasPendingPayment } = access;

  return (
    <div className="space-y-8">
      {/* ─── 1. Bloqueo por Falta de Pago / Activación ─── */}
      {!isPaidAndActive && (
        <Card className="border-2 border-amber-300 bg-gradient-to-br from-amber-50 via-white to-amber-50/40 shadow-md">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 border border-amber-200 px-3 py-1 text-xs font-extrabold text-amber-900 shadow-2xs">
                  <Lock className="h-3.5 w-3.5 text-amber-700" />
                  <span>Pago de Activación Requerido</span>
                </div>

                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  Activa tu curso completando tu colegiatura o inscripción
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed">
                  Para desbloquear el acceso a tus clases en vivo, material de estudio Macmillan, unidades temáticas y exámenes, es necesario liquidar tu pago inicial mediante Stripe o registrar tu comprobante.
                </p>

                {lockedCourses.length > 0 && (
                  <div className="mt-2 rounded-xl bg-white p-3.5 border border-amber-200/80 text-xs text-slate-700 flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 font-semibold block text-[10px] uppercase tracking-wider">Curso por activar:</span>
                      <span className="font-extrabold text-slate-900 text-sm">{lockedCourses[0].name} ({lockedCourses[0].level})</span>
                    </div>
                    <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-800 font-bold">
                      Bloqueado temporalmente
                    </Badge>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
                <Link href="/dashboard/mis-pagos" className="w-full">
                  <Button className="w-full rounded-xl bg-gradient-to-r from-[#ff6600] to-[#ff5000] hover:from-[#ff5500] hover:to-[#e64600] text-white font-extrabold text-sm py-5 px-6 shadow-lg shadow-orange-500/20 transition-all gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span>Pagar con Stripe en Mis Pagos</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <p className="text-[11px] text-center text-slate-500">
                  Aceptamos tarjetas de débito y crédito
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ─── 2. Cursos Activos (Solo si ya pagó y está activo) ─── */}
      {isPaidAndActive && (
        <div className="space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-[#0066cc]" />
              Mis Cursos Activos
            </h3>
            <p className="text-xs text-slate-500">
              Cursos en los que estás inscrito actualmente con acceso completo a clases y contenido.
            </p>
          </div>

          {activeCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeCourses.map((course) => (
                <Card key={course.id} className="border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden">
                  <div className="h-2 bg-[#0066cc]" />
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-1">
                      <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none text-[11px] font-bold">
                        En Curso
                      </Badge>
                      <span className="text-xs font-mono font-bold text-slate-400">
                        {course.code}
                      </span>
                    </div>
                    <CardTitle className="text-lg font-bold text-slate-900">
                      {course.name}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Nivel: <strong className="text-slate-700">{course.level}</strong> • {course.cycleName}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4 pt-0">
                    <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Profesor:</span>
                        <span className="font-semibold text-slate-800">{course.teacherName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Horario:</span>
                        <span className="font-semibold text-slate-800">{course.schedule}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Grupo:</span>
                        <span className="font-semibold text-slate-800">{course.groupName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Unidades:</span>
                        <span className="font-semibold text-slate-800">{course.unitsCount} módulos</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Link href="/dashboard/clases-virtuales" className="w-full">
                        <Button variant="outline" className="w-full border-blue-200 text-[#0066cc] hover:bg-blue-50 text-xs font-bold gap-1.5">
                          <span>Entrar a Clases y Materiales</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-white border border-dashed border-slate-300 text-center text-sm text-slate-500">
              No tienes materias activas asignadas para este ciclo escolar.
            </div>
          )}
        </div>
      )}

      {/* ─── 3. Cursos Aprobados (Historial de Alumno Antiguo) ─── */}
      {hasApprovedHistory && (
        <div className="space-y-4 pt-4">
          <div className="border-b border-slate-200 pb-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <Award className="h-5 w-5 text-emerald-600" />
                  Cursos Aprobados (Historial Académico)
                </h3>
                <p className="text-xs text-slate-500">
                  Cursos completados satisfactoriamente en ciclos anteriores.
                </p>
              </div>
              <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-xs font-bold">
                Alumno Egresado / Reingreso
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {approvedCourses.map((course) => (
              <Card key={course.id} className="border-emerald-200 bg-emerald-50/30 shadow-xs flex flex-col justify-between">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-100 font-bold text-[10px] px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="h-3 w-3" />
                      APROBADO
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {course.code}
                    </span>
                  </div>
                  <CardTitle className="text-lg font-bold text-slate-900">
                    {course.name}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Nivel completado: <strong className="text-emerald-800">{course.level}</strong>
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-emerald-100 space-y-1">
                    <p><strong>Ciclo:</strong> {course.cycleName}</p>
                    <p><strong>Modalidad:</strong> {course.modality}</p>
                    <p className="text-emerald-700 font-semibold flex items-center gap-1 pt-1">
                      <FileCheck className="h-3.5 w-3.5" />
                      Acreditación académica registrada
                    </p>
                  </div>

                  <Link href="/dashboard/boletas" className="w-full">
                    <Button variant="ghost" size="sm" className="w-full text-xs text-slate-600 hover:text-slate-900 gap-1">
                      <span>Ver Calificaciones y Boleta</span>
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
