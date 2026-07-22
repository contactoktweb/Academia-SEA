'use client'

import React, { useState } from "react"
import { startOfWeek, addDays, format, isSameDay, getHours } from "date-fns"
import { es } from "date-fns/locale"
import { ScheduleClassDialog } from "@/app/dashboard/clases-virtuales/ScheduleClassDialog"
import { Video } from "lucide-react"
import Link from "next/link"

interface VirtualClassesCalendarProps {
  groups: any[];
  isTeacherOrAdmin: boolean;
}

export function VirtualClassesCalendar({ groups, isTeacherOrAdmin }: VirtualClassesCalendarProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedTime, setSelectedTime] = useState<string>("")

  const hours = Array.from({ length: 15 }, (_, i) => i + 7); // 7:00 to 21:00
  const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfCurrentWeek, i));

  const handleCellDoubleClick = (day: Date, hour: number) => {
    if (!isTeacherOrAdmin) return;
    
    // Format date as YYYY-MM-DD
    const d = new Date(day);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    const dateStr = d.toISOString().split("T")[0];
    
    // Format time as HH:mm
    const timeStr = `${hour.toString().padStart(2, "0")}:00`;

    setSelectedDate(dateStr);
    setSelectedTime(timeStr);
    setDialogOpen(true);
  }

  // Group events by day and hour for easy lookup
  const getEventsForSlot = (day: Date, hour: number) => {
    return groups.filter(g => {
      if (!g.nextClassAt) return false;
      const classDate = new Date(g.nextClassAt);
      return isSameDay(classDate, day) && getHours(classDate) === hour;
    });
  }

  const getSuggestedEventsForSlot = (day: Date, hour: number) => {
    return groups.filter(g => {
      if (!g.schedule) return false;
      // If there's already an actual scheduled class for this group today, don't show suggestion
      const hasActualClassToday = g.nextClassAt && isSameDay(new Date(g.nextClassAt), day);
      if (hasActualClassToday) return false;

      const s = g.schedule.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // remove accents
      const dayIndex = day.getDay();
      const days = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
      const dayName = days[dayIndex];

      let hasDay = s.includes(dayName);
      if (s.includes('lunes a viernes') && dayIndex >= 1 && dayIndex <= 5) hasDay = true;
      if (s.includes('fines de semana') && (dayIndex === 0 || dayIndex === 6)) hasDay = true;
      
      if (!hasDay) return false;

      const hour12 = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
      const ampm = hour >= 12 ? 'pm' : 'am';
      
      const v1 = `${hour}:`;
      const v2 = `${hour12}:`;
      const v3 = `${hour12}${ampm}`;
      const v4 = `${hour12} ${ampm}`;
      const v5 = `${hour12} a`; // e.g. "10 a 11"
      const v6 = ` ${hour} `;
      
      return s.includes(v1) || s.includes(v2) || s.includes(v3) || s.includes(v4) || s.includes(v5) || s.includes(v6);
    });
  }

  return (
    <div className="bg-white dark:bg-slate-950 rounded-lg border shadow-sm overflow-hidden">
      <div className="grid grid-cols-8 gap-[1px] bg-slate-200 dark:bg-slate-800 border-b">
        <div className="bg-slate-50 dark:bg-slate-900 p-3 flex items-center justify-center text-xs font-medium text-slate-500">
          Hora
        </div>
        {weekDays.map(day => (
          <div key={day.toISOString()} className="bg-slate-50 dark:bg-slate-900 p-3 text-center">
            <div className="text-xs font-semibold text-slate-500 uppercase">
              {format(day, 'EEEE', { locale: es })}
            </div>
            <div className={`text-lg mt-1 ${isSameDay(day, new Date()) ? 'text-blue-600 font-bold' : 'text-slate-700 dark:text-slate-300 font-medium'}`}>
              {format(day, 'd')}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-8 gap-[1px] bg-slate-100 dark:bg-slate-800">
        {hours.map(hour => (
          <React.Fragment key={hour}>
            <div className="bg-white dark:bg-slate-950 p-2 text-right text-xs text-slate-400 font-medium border-r relative h-20">
              <span className="absolute top-2 right-2">{hour}:00</span>
            </div>
            {weekDays.map(day => {
              const slotEvents = getEventsForSlot(day, hour);
              const suggestedEvents = getSuggestedEventsForSlot(day, hour);
              
              return (
                <div 
                  key={`${day.toISOString()}-${hour}`} 
                  className="bg-white dark:bg-slate-950 p-1 h-20 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer relative group border-b border-r border-slate-100 dark:border-slate-800/50"
                  onDoubleClick={() => handleCellDoubleClick(day, hour)}
                  title={isTeacherOrAdmin ? "Doble clic para agendar clase" : undefined}
                >
                  {/* Render Suggested Events (Ghost blocks) */}
                  {suggestedEvents.map((event, i) => (
                    <div 
                      key={`suggested-${event.id}`}
                      className="block absolute left-1 right-1 bg-slate-100 dark:bg-slate-800/50 border border-dashed border-slate-300 dark:border-slate-700 rounded-md p-1.5 overflow-hidden transition-colors z-0"
                      style={{ top: `${(i * 30) + 4}px`, height: '28px' }}
                    >
                      <div className="flex items-center justify-between font-semibold text-slate-500 dark:text-slate-400 text-[9px] leading-tight opacity-70">
                        <span className="truncate flex items-center gap-1"><Video className="w-2.5 h-2.5 flex-shrink-0" /> {event.name}</span>
                        <span>(Sugerido)</span>
                      </div>
                    </div>
                  ))}

                  {/* Render Actual Events */}
                  {slotEvents.map((event, i) => (
                    <Link 
                      href={`/dashboard/clases-virtuales/${event.id}`} 
                      key={event.id}
                      className="block absolute left-1 right-1 bg-blue-100/80 hover:bg-blue-200 dark:bg-blue-900/40 dark:hover:bg-blue-800/60 border border-blue-200 dark:border-blue-800 rounded-md p-1.5 overflow-hidden transition-colors z-10"
                      style={{ top: `${(i * 30) + 4}px`, bottom: slotEvents.length === 1 ? '4px' : 'auto', height: slotEvents.length === 1 ? 'auto' : '28px' }}
                    >
                      <div className="flex items-center gap-1 font-semibold text-blue-800 dark:text-blue-300 text-[10px] leading-tight">
                        <Video className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{event.name}</span>
                      </div>
                      {slotEvents.length === 1 && event.nextClassTopic && (
                        <div className="text-[9px] font-medium text-blue-700 dark:text-blue-300 mt-0.5 truncate italic">
                          {event.nextClassTopic}
                        </div>
                      )}
                      {slotEvents.length === 1 && (
                        <div className="text-[8px] text-blue-600 dark:text-blue-400 mt-0.5 truncate">
                          {event.level} - {event.modality}
                        </div>
                      )}
                    </Link>
                  ))}
                  
                  {/* Invisible plus icon on hover for teachers */}
                  {isTeacherOrAdmin && slotEvents.length === 0 && suggestedEvents.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                      <span className="text-2xl text-slate-300 font-light">+</span>
                    </div>
                  )}
                </div>
              )
            })}
          </React.Fragment>
        ))}
      </div>

      <ScheduleClassDialog 
        groups={groups}
        initialDate={selectedDate}
        initialTime={selectedTime}
        isOpen={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  )
}
