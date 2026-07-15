"use client";

import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

interface ScheduleSelectorProps {
  value?: string;
  onChange: (value: string) => void;
}

export function ScheduleSelector({ value = "", onChange }: ScheduleSelectorProps) {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // Parse initial value (e.g. "Lunes, Miércoles 4:00 PM - 6:00 PM")
  useEffect(() => {
    if (value && selectedDays.length === 0 && !startTime && !endTime) {
      // Basic heuristic to parse the string
      const daysInValue = DAYS.filter(d => value.includes(d));
      if (daysInValue.length > 0) {
        setSelectedDays(daysInValue);
      }
      
      const timeMatch = value.match(/(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)?)\s*-\s*(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)?)/);
      if (timeMatch) {
        // Try to convert "4:00 PM" to "16:00" for input type="time"
        const parseTime = (timeStr: string) => {
          if (!timeStr.toLowerCase().includes('m')) return timeStr.trim();
          const [time, modifier] = timeStr.trim().split(/\s+/);
          let [hours, minutes] = time.split(':');
          if (hours === '12') hours = '00';
          if (modifier && modifier.toUpperCase() === 'PM') {
            hours = (parseInt(hours, 10) + 12).toString();
          }
          return `${hours.padStart(2, '0')}:${minutes}`;
        };
        setStartTime(parseTime(timeMatch[1]));
        setEndTime(parseTime(timeMatch[2]));
      } else {
        // Look for HH:mm - HH:mm
        const simpleTimeMatch = value.match(/(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/);
        if (simpleTimeMatch) {
          setStartTime(simpleTimeMatch[1]);
          setEndTime(simpleTimeMatch[2]);
        }
      }
    }
  }, [value]);

  // Update parent when state changes
  useEffect(() => {
    if (selectedDays.length === 0 && !startTime && !endTime) {
      return;
    }

    const formatTime = (time24: string) => {
      if (!time24) return "";
      const [h, m] = time24.split(":");
      let hours = parseInt(h, 10);
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      return `${hours}:${m} ${ampm}`;
    };

    let daysStr = selectedDays.join(", ");
    // Replace last comma with " y "
    if (selectedDays.length > 1) {
      const lastComma = daysStr.lastIndexOf(", ");
      daysStr = daysStr.substring(0, lastComma) + " y " + daysStr.substring(lastComma + 2);
    }

    const timeStr = (startTime && endTime) 
      ? `${formatTime(startTime)} - ${formatTime(endTime)}`
      : "";

    const combined = [daysStr, timeStr].filter(Boolean).join(" ");
    
    if (combined !== value && combined.trim() !== "") {
        onChange(combined);
    }
  }, [selectedDays, startTime, endTime]);

  const toggleDay = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort((a, b) => DAYS.indexOf(a) - DAYS.indexOf(b))
    );
  };

  return (
    <div className="space-y-4 border rounded-md p-4 bg-slate-50/50">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Días de la semana</Label>
        <div className="flex flex-wrap gap-4">
          {DAYS.map(day => (
            <div key={day} className="flex items-center space-x-2">
              <Checkbox 
                id={`day-${day}`} 
                checked={selectedDays.includes(day)}
                onCheckedChange={() => toggleDay(day)}
              />
              <label 
                htmlFor={`day-${day}`} 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none"
              >
                {day}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start-time" className="text-sm font-medium">Hora de inicio</Label>
          <Input 
            id="start-time" 
            type="time" 
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end-time" className="text-sm font-medium">Hora de fin</Label>
          <Input 
            id="end-time" 
            type="time" 
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
      </div>
      
      {/* Hidden input to show what it generates */}
      {selectedDays.length > 0 && startTime && endTime && (
        <p className="text-xs text-muted-foreground pt-1">
          Horario generado: <span className="font-semibold text-slate-700">{value}</span>
        </p>
      )}
    </div>
  );
}
