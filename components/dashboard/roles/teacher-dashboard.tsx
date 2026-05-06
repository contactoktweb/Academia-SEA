

import { DashboardTopBar } from "@/components/dashboard/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, UserCheck, BarChart3, Calendar, Users, ArrowRight } from "lucide-react"
import Link from "next/link"

interface TeacherDashboardProps {
  user: any
}

export function TeacherDashboard({ user }: TeacherDashboardProps) {
  return (
    <div className="flex flex-col gap-6">
      <DashboardTopBar title={`Bienvenido, Prof. ${user.name.split(' ')[0]}`} />
      
      {/* Quick Stats for Teachers */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/50 backdrop-blur-sm border-slate-200/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Mis Cursos</CardTitle>
            <BookOpen className="h-4 w-4 text-sea-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-heading">4</div>
            <p className="text-xs text-slate-400 mt-1">Cursos asignados este ciclo</p>
          </CardContent>
        </Card>
        <Card className="bg-white/50 backdrop-blur-sm border-slate-200/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Alumnos</CardTitle>
            <Users className="h-4 w-4 text-sea-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-heading">86</div>
            <p className="text-xs text-slate-400 mt-1">Estudiantes en tus grupos</p>
          </CardContent>
        </Card>
        <Card className="bg-white/50 backdrop-blur-sm border-slate-200/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Asistencia Hoy</CardTitle>
            <UserCheck className="h-4 w-4 text-sea-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-heading">92%</div>
            <p className="text-xs text-slate-400 mt-1">Promedio de asistencia</p>
          </CardContent>
        </Card>
        <Card className="bg-white/50 backdrop-blur-sm border-slate-200/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Pendiente Calificar</CardTitle>
            <BarChart3 className="h-4 w-4 text-sea-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-heading">12</div>
            <p className="text-xs text-slate-400 mt-1">Evaluaciones por procesar</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Course Schedule or List */}
        <Card className="col-span-4 border-slate-200/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Mis Grupos Actuales</CardTitle>
              <CardDescription>Gestión de clases y alumnos</CardDescription>
            </div>
            <Link href="/dashboard/cursos" className="text-xs font-semibold text-sea-blue hover:underline flex items-center gap-1">
              Ver todos <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Inglés Avanzado B2", group: "G-102", students: 22, time: "08:00 - 10:00 AM" },
                { name: "Preparación TOEFL", group: "G-305", students: 15, time: "10:30 - 12:30 PM" },
                { name: "Inglés Intermedio B1", group: "G-201", students: 28, time: "02:00 - 04:00 PM" },
              ].map((course, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-sea-blue/10 flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-sea-blue" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{course.name}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                          <Users className="h-3 w-3" /> {course.students} Alumnos
                        </span>
                        <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {course.group}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-sea-blue">{course.time}</p>
                    <Link href={`/dashboard/asistencia?course=${course.group}`} className="text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-sea-blue mt-1 inline-block">
                      Tomar Asistencia
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions for Teachers */}
        <Card className="col-span-3 border-slate-200/60 shadow-sm">
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>Accesos directos de gestión</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Link href="/dashboard/asistencia" className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200 hover:border-sea-blue hover:shadow-md transition-all group">
              <div className="h-10 w-10 rounded-xl bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
                <UserCheck className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Registrar Asistencia</p>
                <p className="text-xs text-slate-500">Control diario de alumnos</p>
              </div>
            </Link>
            <Link href="/dashboard/calificaciones" className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200 hover:border-sea-blue hover:shadow-md transition-all group">
              <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                <BarChart3 className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Subir Calificaciones</p>
                <p className="text-xs text-slate-500">Resultados de exámenes</p>
              </div>
            </Link>
            <Link href="/dashboard/mensajes" className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200 hover:border-sea-blue hover:shadow-md transition-all group">
              <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Mensajes a Alumnos</p>
                <p className="text-xs text-slate-500">Comunicación directa</p>
              </div>
            </Link>
            <Link href="/dashboard/anuncios" className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200 hover:border-sea-blue hover:shadow-md transition-all group">
              <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Publicar Anuncio</p>
                <p className="text-xs text-slate-500">Avisos generales de clase</p>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
