"use client";

import { useState } from "react";
import { Search, Mail, Phone, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface PlacementTest {
  id: string;
  name: string;
  ageCategory: string;
  email: string | null;
  phone: string | null;
  sede: string;
  score: number;
  totalQuestions: number;
  level: string;
  percentage: number;
  status: string;
  createdAt: Date;
}

export function PlacementTestsTable({ initialData }: { initialData: PlacementTest[] }) {
  const [search, setSearch] = useState("");
  const [sedeFilter, setSedeFilter] = useState("ALL");

  const filteredData = initialData.filter((test) => {
    const matchesSearch = test.name.toLowerCase().includes(search.toLowerCase()) || 
                          (test.email && test.email.toLowerCase().includes(search.toLowerCase()));
    const matchesSede = sedeFilter === "ALL" || test.sede === sedeFilter;
    
    return matchesSearch && matchesSede;
  });

  const getSedeName = (sede: string) => {
    const sedes: Record<string, string> = {
      SEAGRULLO: "El Grullo",
      SEAAUTLAN: "Autlán",
      SEAUNION: "Unión de Tula",
      EN_LINEA: "En Línea",
    };
    return sedes[sede] || sede;
  };

  const getLevelColor = (percentage: number) => {
    if (percentage < 20) return "bg-slate-100 text-slate-700 border-slate-200"; // A1
    if (percentage < 45) return "bg-blue-50 text-blue-700 border-blue-200"; // A2
    if (percentage < 70) return "bg-green-50 text-green-700 border-green-200"; // B1
    if (percentage < 85) return "bg-purple-50 text-purple-700 border-purple-200"; // B2
    return "bg-amber-50 text-amber-700 border-amber-200"; // C1
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50/50">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Buscar por nombre o correo..." 
            className="pl-9 bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={sedeFilter} onValueChange={setSedeFilter}>
            <SelectTrigger className="w-full sm:w-[180px] bg-white">
              <SelectValue placeholder="Todas las sedes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todas las sedes</SelectItem>
              <SelectItem value="SEAGRULLO">El Grullo</SelectItem>
              <SelectItem value="SEAAUTLAN">Autlán</SelectItem>
              <SelectItem value="SEAUNION">Unión de Tula</SelectItem>
              <SelectItem value="EN_LINEA">En Línea</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50/80 border-b border-slate-100 font-semibold">
            <tr>
              <th className="px-6 py-4">Prospecto</th>
              <th className="px-6 py-4">Contacto</th>
              <th className="px-6 py-4">Sede / Edad</th>
              <th className="px-6 py-4 text-center">Nivel Asignado</th>
              <th className="px-6 py-4 text-center">Puntuación</th>
              <th className="px-6 py-4 text-right">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredData.length > 0 ? (
              filteredData.map((test) => (
                <tr key={test.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{test.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      {test.email && (
                        <a href={`mailto:${test.email}`} className="text-slate-500 hover:text-sea-blue flex items-center gap-1.5 text-xs">
                          <Mail className="h-3 w-3" /> {test.email}
                        </a>
                      )}
                      {test.phone && (
                        <a href={`https://wa.me/${test.phone.replace(/\\D/g,'')}`} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-green-600 flex items-center gap-1.5 text-xs">
                          <Phone className="h-3 w-3" /> {test.phone}
                        </a>
                      )}
                      {!test.email && !test.phone && (
                        <span className="text-slate-400 text-xs italic">Sin contacto</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-slate-900 font-medium">{getSedeName(test.sede)}</div>
                    <div className="text-slate-500 text-xs">{test.ageCategory}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge variant="outline" className={`${getLevelColor(test.percentage)} whitespace-nowrap`}>
                      {test.level.split(" ")[0]}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="font-bold text-slate-800">{test.score}/{test.totalQuestions}</div>
                    <div className="text-xs text-slate-500">{Math.round(test.percentage)}%</div>
                  </td>
                  <td className="px-6 py-4 text-right text-slate-500 whitespace-nowrap">
                    {new Date(test.createdAt).toLocaleDateString("es-MX", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                  No se encontraron resultados de exámenes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
