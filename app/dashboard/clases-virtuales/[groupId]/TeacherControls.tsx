'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from 'sonner'
import { Video, StopCircle, Users, Check, X, Loader2 } from 'lucide-react'
import { getGroupStudents } from '../actions'
import { recordAttendance } from '@/app/dashboard/asistencia/actions'

interface TeacherControlsProps {
  groupId: string
  courseAssignmentId?: string
}

export function TeacherControls({ groupId, courseAssignmentId }: TeacherControlsProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isRecordingLoading, setIsRecordingLoading] = useState(false)
  const [egressId, setEgressId] = useState<string | null>(null)
  
  const [students, setStudents] = useState<any[]>([])
  const [isStudentsLoading, setIsStudentsLoading] = useState(false)

  const handleToggleRecording = async () => {
    setIsRecordingLoading(true)
    try {
      const action = isRecording ? 'stop' : 'start'
      const response = await fetch('/api/livekit/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomName: groupId,
          action,
          egressId
        })
      })

      const data = await response.json()
      if (data.error) throw new Error(data.error)

      if (action === 'start') {
        setIsRecording(true)
        setEgressId(data.egressId)
        toast.success("Grabación iniciada")
      } else {
        setIsRecording(false)
        setEgressId(null)
        toast.success("Grabación finalizada")
      }
    } catch (error: any) {
      toast.error(error.message || "Error con la grabación")
    } finally {
      setIsRecordingLoading(false)
    }
  }

  const loadStudents = async () => {
    setIsStudentsLoading(true)
    const result = await getGroupStudents(groupId)
    if (result.success && result.students) {
      setStudents(result.students)
    } else {
      toast.error(result.error || "Error al cargar alumnos")
    }
    setIsStudentsLoading(false)
  }

  const handleMarkAttendance = async (studentId: string, status: string) => {
    try {
      const today = new Date().toISOString().split('T')[0]
      const result = await recordAttendance({
        studentId,
        date: today,
        status,
        courseAssignmentId
      })

      if (result.success) {
        toast.success(`Asistencia (${status}) registrada`)
        setStudents(prev => prev.map(s => 
          s.profileId === studentId ? { ...s, attendanceStatus: status } : s
        ))
      } else {
        toast.error(result.error || "Error al registrar asistencia")
      }
    } catch (error: any) {
      toast.error(error.message || "Error al registrar asistencia")
    }
  }

  return (
    <div className="absolute top-4 right-4 z-50 flex gap-2">
      <Button
        variant={isRecording ? 'destructive' : 'default'}
        size="sm"
        onClick={handleToggleRecording}
        disabled={isRecordingLoading}
        className="shadow-md"
      >
        {isRecordingLoading ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : isRecording ? (
          <StopCircle className="h-4 w-4 mr-2" />
        ) : (
          <Video className="h-4 w-4 mr-2" />
        )}
        {isRecording ? "Detener Grabación" : "Grabar Clase"}
      </Button>

      <Dialog>
        <DialogTrigger asChild>
          <Button 
            variant="secondary" 
            size="sm" 
            className="shadow-md"
            onClick={loadStudents}
          >
            <Users className="h-4 w-4 mr-2" />
            Asistencia
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Toma de Asistencia (En Vivo)</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {isStudentsLoading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
              </div>
            ) : students.length === 0 ? (
              <p className="text-center text-slate-500 py-8">No hay alumnos inscritos activos en este grupo.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Alumno</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-right">Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.profileId}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end items-center gap-2">
                          {student.attendanceStatus ? (
                            <>
                              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                student.attendanceStatus === 'PRESENT' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {student.attendanceStatus === 'PRESENT' ? 'Asistió' : 'Faltó'}
                              </span>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-slate-500 hover:text-slate-700 h-8 px-2 text-xs"
                                onClick={() => {
                                  // Clear local state to show buttons again
                                  setStudents(prev => prev.map(s => 
                                    s.profileId === student.profileId ? { ...s, attendanceStatus: null } : s
                                  ))
                                }}
                              >
                                Editar
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-green-200 hover:bg-green-100 hover:text-green-800 transition-colors bg-green-50 text-green-700"
                                onClick={() => handleMarkAttendance(student.profileId, 'PRESENT')}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Asistió
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-200 hover:bg-red-100 hover:text-red-800 transition-colors bg-red-50 text-red-700"
                                onClick={() => handleMarkAttendance(student.profileId, 'ABSENT')}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Faltó
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
