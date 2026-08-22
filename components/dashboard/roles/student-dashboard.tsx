import { DashboardTopBar } from "@/components/dashboard/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, UserCheck, CreditCard, BookOpen, Calendar, ArrowRight, Star, Lock, AlertCircle, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface StudentDashboardProps {
  user: any;
  access?: any;
}

export function StudentDashboard({ user, access }: StudentDashboardProps) {
  const isPaidAndActive = access?.isPaidAndActive ?? true;
  const activeCount = access?.activeCourses?.length ?? 0;
  const approvedCount = access?.approvedCourses?.length ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <DashboardTopBar title={`Hola, ${user.name.split(' ')[0]}`} />

      {/* ─── Banner de Activación / Pago Pendiente ─── */}
      {!isPaidAndActive && (
        <div className="rounded-2xl border-2 border-amber-300 bg-gradient-to-r from-amber-50 via-orange-50/50 to-amber-50 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-amber-500/20 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
              <Lock className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge className="bg-amber-500 text-white font-bold text-[10px]">
                  Activación Requerida
                </Badge>
                {approvedCount > 0 && (
                  <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                    {approvedCount} Curso(s) Aprobado(s)
                  </Badge>
                )}
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Realiza tu pago para desbloquear tus cursos activos
              </h3>
              <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
                Tus nuevas materias y clases en vivo se habilitarán automáticamente al registrar tu pago inicial mediante Stripe en la sección de Mis Pagos.
              </p>
            </div>
          </div>

          <Link href="/dashboard/mis-pagos" className="shrink-0">
            <Button className="w-full sm:w-auto rounded-xl bg-[#ff6600] hover:bg-[#e65500] text-white font-bold text-xs gap-2 py-4 px-5 shadow-sm">
              <CreditCard className="h-4 w-4" />
              <span>Ir a Mis Pagos</span>
            </Button>
          </Link>
        </div>
      )}
      
      {/* Quick Stats for Students */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/50 backdrop-blur-sm border-slate-200/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Mi Promedio</CardTitle>
            <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-heading">9.5</div>
            <p className="text-xs text-slate-400 mt-1">Global de este ciclo</p>
          </CardContent>
        </Card>
        <Card className="bg-white/50 backdrop-blur-sm border-slate-200/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Asistencia</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-heading">98%</div>
            <p className="text-xs text-slate-400 mt-1">24 días presentes</p>
          </CardContent>
        </Card>
        <Card className="bg-white/50 backdrop-blur-sm border-slate-200/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Estado de Cuenta</CardTitle>
            <CreditCard className="h-4 w-4 text-[#0066cc]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-heading">
              {isPaidAndActive ? "Al Día" : "Pendiente"}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              <Link href="/dashboard/mis-pagos" className="text-[#0066cc] hover:underline font-semibold">
                Ver mensualidades &rarr;
              </Link>
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white/50 backdrop-blur-sm border-slate-200/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Mis Cursos</CardTitle>
            <BookOpen className="h-4 w-4 text-[#0066cc]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-heading">
              {isPaidAndActive ? activeCount : approvedCount}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {isPaidAndActive ? `${activeCount} materias activas` : `${approvedCount} aprobados`}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Academic Performance */}
        <Card className="col-span-4 border-slate-200/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Rendimiento Académico</CardTitle>
              <CardDescription>Tus calificaciones más recientes</CardDescription>
            </div>
            <Link href="/dashboard/mis-calificaciones" className="text-xs font-semibold text-[#0066cc] hover:underline flex items-center gap-1">
              Ver detalle <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Grammar Quiz #1", course: "Inglés Avanzado", grade: 10, weight: "20%", date: "Hace 2 días" },
                { name: "Listening Section", course: "Preparación TOEFL", grade: 8.5, weight: "15%", date: "Hace 5 días" },
                { name: "Vocabulary Test", course: "Inglés Avanzado", grade: 9.8, weight: "10%", date: "Hace 1 semana" },
              ].map((exam, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "h-10 w-10 rounded-xl flex items-center justify-center font-bold text-sm",
                      exam.grade >= 9 ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"
                    )}>
                      {exam.grade}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{exam.name}</p>
                      <p className="text-[11px] text-slate-500">{exam.course} • Peso: {exam.weight}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{exam.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Schedule & Announcements */}
        <Card className="col-span-3 border-slate-200/60 shadow-sm">
          <CardHeader>
            <CardTitle>Mi Agenda</CardTitle>
            <CardDescription>Próximas actividades y avisos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Hoy</p>
              <div className="relative pl-4 border-l-2 border-[#0066cc] py-1">
                <p className="text-sm font-bold text-slate-800">Clase de Inglés</p>
                <p className="text-xs text-slate-500">Aula Virtual / Presencial</p>
              </div>
            </div>
            
            <div className="pt-2">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Avisos</p>
              <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100">
                <p className="text-xs font-bold text-[#ff6600] flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff6600]"></span>
                  </span>
                  Pagos y Colegiaturas
                </p>
                <p className="text-[11px] text-slate-600 mt-1">
                  Recuerda realizar el pago de tus mensualidades para mantener activo tu acceso continuo a las clases en vivo y material de estudio.
                </p>
              </div>
            </div>

            <Link href="/dashboard/calendario" className="flex w-full items-center justify-center gap-2 p-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors mt-2">
              <Calendar className="h-4 w-4" />
              Ver Calendario Completo
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
