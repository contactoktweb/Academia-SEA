"use client";

import { useState, useMemo } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { GroupDialog } from "./group-dialogs";
import { Users, Search, BookOpen, Clock, MapPin, Sparkles } from "lucide-react";

interface GroupsTableProps {
  groups: any[];
  isAdmin?: boolean;
  activeSede?: string;
}

export function GroupsTable({
  groups: initialGroups,
  isAdmin = true,
  activeSede = "SEAAUTLAN",
}: GroupsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredGroups = useMemo(() => {
    if (!searchTerm.trim()) return initialGroups;
    const term = searchTerm.toLowerCase();
    return initialGroups.filter(
      (g) =>
        g.name.toLowerCase().includes(term) ||
        g.level.toLowerCase().includes(term) ||
        (g.schedule && g.schedule.toLowerCase().includes(term)) ||
        (g.location && g.location.toLowerCase().includes(term))
    );
  }, [initialGroups, searchTerm]);

  return (
    <Card className="border border-slate-200 shadow-xs">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
        <div>
          <CardTitle className="text-xl font-bold text-slate-900">
            Grupos Registrados
          </CardTitle>
          <CardDescription>
            Total de grupos: {initialGroups.length}
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative min-w-[220px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar grupo o nivel..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 text-xs sm:text-sm"
            />
          </div>
          {isAdmin && (
            <GroupDialog mode="add" defaultSede={activeSede} />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80">
                <TableHead>Nombre del Grupo</TableHead>
                <TableHead>Nivel</TableHead>
                <TableHead>Modalidad / Sede</TableHead>
                <TableHead>Horario</TableHead>
                <TableHead>Alumnos Activos</TableHead>
                <TableHead>Aula / Ubicación</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGroups.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Users className="size-8 text-slate-300" />
                      <p className="font-medium text-slate-600">No hay grupos registrados</p>
                      <p className="text-xs text-slate-400">
                        {searchTerm
                          ? "No hay grupos que coincidan con la búsqueda."
                          : "Crea tu primer grupo con el botón 'Nuevo Grupo'."}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredGroups.map((group) => {
                  const enrollmentsCount = group.enrollments?.length || 0;
                  const maxCap = group.maxStudents || 30;

                  return (
                    <TableRow key={group.id} className="hover:bg-slate-50/60 transition-colors">
                      <TableCell className="font-bold text-slate-900">
                        {group.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-medium text-slate-700 bg-slate-50">
                          {group.level}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <Badge
                            variant="secondary"
                            className={
                              group.modality === "VIRTUAL"
                                ? "bg-purple-50 text-purple-700 border-purple-200"
                                : group.modality === "MIXTA"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-blue-50 text-[#0066cc] border-blue-200"
                            }
                          >
                            {group.modality}
                          </Badge>
                          <span className="text-xs text-slate-400 font-medium">
                            {group.sede === "SEAAUTLAN"
                              ? "Autlán"
                              : group.sede === "SEAGRULLO"
                              ? "El Grullo"
                              : group.sede === "SEAUNION"
                              ? "Unión de Tula"
                              : "En Línea"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-slate-600">
                        {group.schedule ? (
                          <div className="flex items-center gap-1">
                            <Clock className="size-3 text-slate-400" />
                            <span>{group.schedule}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Por definir</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-800">
                            {enrollmentsCount} / {maxCap}
                          </span>
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-sea-blue rounded-full transition-all"
                              style={{
                                width: `${Math.min(100, (enrollmentsCount / maxCap) * 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-slate-600">
                        {group.location ? (
                          <div className="flex items-center gap-1">
                            <MapPin className="size-3 text-slate-400" />
                            <span>{group.location}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">N/A</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {isAdmin && (
                            <>
                              <GroupDialog mode="edit" group={group} />
                              <GroupDialog mode="delete" group={group} />
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
