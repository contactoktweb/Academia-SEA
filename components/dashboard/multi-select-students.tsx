"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface MultiSelectStudentsProps {
  students: { id: string; name: string }[];
  value: string[];
  onChange: (value: string[]) => void;
}

export function MultiSelectStudents({ students, value, onChange }: MultiSelectStudentsProps) {
  const [search, setSearch] = useState("");

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStudent = (studentId: string, checked: boolean) => {
    if (checked) {
      onChange([...value, studentId]);
    } else {
      onChange(value.filter(id => id !== studentId));
    }
  };

  return (
    <div className="border rounded-md mt-2">
      <div className="p-2 border-b flex items-center gap-2">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Buscar estudiante..." 
          className="h-8 border-none shadow-none focus-visible:ring-0 px-0" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <ScrollArea className="h-[200px] p-2">
        {filteredStudents.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No se encontraron estudiantes.</p>
        ) : (
          <div className="space-y-2">
            {filteredStudents.map((student) => (
              <div key={student.id} className="flex items-center space-x-2 p-1 hover:bg-slate-50 rounded">
                <Checkbox 
                  id={`student-${student.id}`} 
                  checked={value.includes(student.id)}
                  onCheckedChange={(checked) => toggleStudent(student.id, checked as boolean)}
                />
                <Label htmlFor={`student-${student.id}`} className="text-sm font-normal cursor-pointer flex-1">
                  {student.name}
                </Label>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
