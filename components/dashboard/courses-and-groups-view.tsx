"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { BookOpen, Users, PlusCircle } from "lucide-react";
import { CourseDialog } from "./course-dialogs";
import { GroupDialog } from "./group-dialogs";
import { GroupsTable } from "./groups-table";

interface CoursesAndGroupsViewProps {
  courses: any[];
  groups: any[];
  isAdmin?: boolean;
  activeSede?: string;
}

export function CoursesAndGroupsView({
  courses,
  groups,
  isAdmin = true,
  activeSede = "SEAAUTLAN",
}: CoursesAndGroupsViewProps) {
  const [activeTab, setActiveTab] = useState<"courses" | "groups">("courses");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Grupos y Cursos
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Administra los programas académicos, niveles y grupos de alumnos de la institución.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <>
              {activeTab === "courses" ? (
                <CourseDialog mode="add" />
              ) : (
                <GroupDialog mode="add" defaultSede={activeSede} />
              )}
            </>
          )}
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as any)}
        className="w-full space-y-4"
      >
        <TabsList className="bg-slate-100 p-1">
          <TabsTrigger
            value="courses"
            className="flex items-center gap-2 text-xs sm:text-sm font-medium"
          >
            <BookOpen className="size-4" />
            <span>Cursos ({courses.length})</span>
          </TabsTrigger>
          <TabsTrigger
            value="groups"
            className="flex items-center gap-2 text-xs sm:text-sm font-medium"
          >
            <Users className="size-4" />
            <span>Grupos ({groups.length})</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab Cursos */}
        <TabsContent value="courses" className="space-y-4">
          <Card className="border border-slate-200 shadow-xs">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
              <div>
                <CardTitle className="text-xl font-bold text-slate-900">
                  Cursos Registrados
                </CardTitle>
                <CardDescription>
                  Total de cursos activos: {courses.length}
                </CardDescription>
              </div>
              {isAdmin && <CourseDialog mode="add" />}
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/80">
                      <TableHead>Curso</TableHead>
                      <TableHead>Código</TableHead>
                      <TableHead>Nivel</TableHead>
                      <TableHead>Profesores</TableHead>
                      <TableHead>Estudiantes</TableHead>
                      <TableHead>Unidades</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-28 text-center text-slate-500">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <BookOpen className="size-8 text-slate-300" />
                            <p className="font-medium text-slate-600">No hay cursos registrados aún.</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      courses.map((course) => (
                        <TableRow key={course.id} className="hover:bg-slate-50/60 transition-colors">
                          <TableCell className="font-bold text-slate-900">{course.name}</TableCell>
                          <TableCell>
                            <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                              {course.code}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-xs font-semibold text-slate-700">{course.level}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-xs font-bold bg-blue-50 text-sea-blue px-2 py-0.5 rounded-full border border-blue-200">
                              {course.assignments?.length || 0}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                              {course.enrollments?.length || 0}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-xs text-slate-600">{course.units?.length || 0}</span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              {isAdmin && (
                                <>
                                  <CourseDialog mode="edit" course={course} />
                                  <CourseDialog mode="delete" course={course} />
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Grupos */}
        <TabsContent value="groups" className="space-y-4">
          <GroupsTable groups={groups} isAdmin={isAdmin} activeSede={activeSede} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
