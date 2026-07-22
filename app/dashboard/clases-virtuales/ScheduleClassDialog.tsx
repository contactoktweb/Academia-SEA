'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CalendarClock, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { scheduleNextClass } from "./actions"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ScheduleClassDialogProps {
  groupId?: string;
  groups?: any[];
  currentNextClassAt?: Date | null;
  initialDate?: string;
  initialTime?: string;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export function ScheduleClassDialog({ 
  groupId: initialGroupId, 
  groups, 
  currentNextClassAt, 
  initialDate, 
  initialTime,
  isOpen,
  onOpenChange,
  trigger
}: ScheduleClassDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const [selectedGroupId, setSelectedGroupId] = useState(initialGroupId || "")
  const [topic, setTopic] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  
  const router = useRouter()
  const open = isOpen !== undefined ? isOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  // Sincronizar propiedades iniciales cuando se abre el modal
  useEffect(() => {
    if (open) {
      setSelectedGroupId(initialGroupId || "")
      setTopic("")
      if (initialDate) {
        setSelectedDate(initialDate)
      } else if (currentNextClassAt) {
        const d = new Date(currentNextClassAt)
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
        setSelectedDate(d.toISOString().split("T")[0])
      } else {
        setSelectedDate("")
      }

      if (initialTime) {
        setSelectedTime(initialTime)
      } else if (currentNextClassAt) {
        const d = new Date(currentNextClassAt)
        setSelectedTime(`${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`)
      } else {
        setSelectedTime("")
      }
    }
  }, [open, initialGroupId, initialDate, initialTime, currentNextClassAt])

  const handleSave = async () => {
    if (!selectedGroupId) {
      toast.error("Por favor, selecciona un grupo")
      return
    }
    if (!selectedDate || !selectedTime) {
      toast.error("Por favor, selecciona una fecha y hora")
      return
    }

    setLoading(true)
    try {
      const finalDateTime = new Date(`${selectedDate}T${selectedTime}`)
      const result = await scheduleNextClass(selectedGroupId, finalDateTime, topic)

      if (result.success) {
        toast.success("Clase agendada correctamente")
        setOpen(false)
        router.refresh()
      } else {
        toast.error(result.error || "Error al agendar la clase")
      }
    } catch (error) {
      toast.error("Ocurrió un error inesperado")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
      ) : !isOpen && (
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="h-7 px-2 text-xs text-blue-600 border-blue-200 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-900 dark:hover:bg-blue-900/40">
            <CalendarClock className="h-3 w-3 mr-1" />
            Agendar Nueva Clase
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Agendar Nueva Clase</DialogTitle>
          <p className="text-sm text-muted-foreground">Recuerda que las sesiones estándar tienen una duración de 1 hora.</p>
        </DialogHeader>
        <div className="py-4 flex flex-col gap-4">
          {(!initialGroupId && groups && groups.length > 0) && (
            <div>
              <label className="text-sm font-medium mb-2 block">Seleccionar Grupo Virtual</label>
              <Select value={selectedGroupId} onValueChange={setSelectedGroupId}>
                <SelectTrigger>
                  <SelectValue placeholder="Elige un grupo" />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((g) => (
                    <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <label className="text-sm font-medium mb-2 block">Tema o Título de la Clase (Opcional)</label>
            <Input 
              placeholder="Ej. Introducción a React, Sesión de Repaso..." 
              value={topic} 
              onChange={(e) => setTopic(e.target.value)} 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Fecha de la Clase</label>
              <Input 
                type="date" 
                value={selectedDate} 
                onChange={(e) => setSelectedDate(e.target.value)} 
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Hora de Inicio</label>
              <Input 
                type="time" 
                value={selectedTime} 
                onChange={(e) => setSelectedTime(e.target.value)} 
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Confirmar y Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
