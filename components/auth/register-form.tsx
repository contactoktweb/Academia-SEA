"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { Loader2, ArrowRight, ArrowLeft, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { toast } from 'sonner'
import Image from 'next/image'
import Link from 'next/link'

const baseSchema = z.object({
  name: z.string().min(2, "El nombre completo es requerido"),
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  phone: z.string().min(10, "Teléfono inválido").optional().or(z.literal('')),
  birthDate: z.string().min(1, "Fecha de nacimiento requerida"),
  sede: z.string().min(1, "Sede es obligatoria"),
})

const studentSchema = baseSchema.extend({
  curp: z.string().min(18, "CURP debe tener 18 caracteres").max(18),
  emergencyContact: z.string().min(2, "Contacto de emergencia requerido"),
  emergencyPhone: z.string().min(10, "Teléfono de emergencia inválido"),
  emergencyContact2: z.string().optional(),
  emergencyPhone2: z.string().optional(),
})

const teacherSchema = baseSchema

type StudentFormValues = z.infer<typeof studentSchema>
type TeacherFormValues = z.infer<typeof teacherSchema>

export function RegisterForm({ logoUrl }: { logoUrl?: string }) {
  const router = useRouter()
  const [role, setRole] = useState<'STUDENT' | 'TEACHER'>('STUDENT')
  const [step, setStep] = useState<'FORM' | 'OTP'>('FORM')
  const [isLoading, setIsLoading] = useState(false)
  const [otp, setOtp] = useState('')
  const [registeredData, setRegisteredData] = useState<any>(null)

  const {
    register: registerStudent,
    handleSubmit: handleSubmitStudent,
    setValue: setStudentValue,
    formState: { errors: errorsStudent },
  } = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: { sede: '' }
  })

  const {
    register: registerTeacher,
    handleSubmit: handleSubmitTeacher,
    setValue: setTeacherValue,
    formState: { errors: errorsTeacher },
  } = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherSchema),
    defaultValues: { sede: '' }
  })

  const onSubmitForm = async (data: any) => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email }),
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || 'Error al enviar código')
      }

      setRegisteredData({ ...data, role })
      setStep('OTP')
      toast.success('Código enviado. Revisa tu correo electrónico.')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const onVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error('Ingresa el código completo de 6 dígitos')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/verify-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...registeredData, code: otp }),
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || 'Error al verificar')
      }

      toast.success('Cuenta creada exitosamente. Iniciando sesión...')

      // Iniciar sesión automáticamente
      const signInResult = await signIn('credentials', {
        email: registeredData.email,
        password: registeredData.password,
        sede: registeredData.sede,
        redirect: false,
      })

      if (signInResult?.error) {
        router.push('/login')
      } else {
        router.push('/dashboard/configuracion')
        router.refresh()
      }
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950">
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 w-full lg:w-1/2">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 flex justify-center lg:justify-start">
            {logoUrl ? (
              <Image src={logoUrl} alt="Logo" width={180} height={70} className="h-16 w-auto object-contain" />
            ) : (
              <div className="text-3xl font-bold text-sea-blue">Academia SEA</div>
            )}
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {step === 'FORM' ? 'Crear una cuenta' : 'Verifica tu correo'}
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {step === 'FORM' ? 'Regístrate para acceder a tu plataforma' : 'Ingresa el código que enviamos a ' + registeredData?.email}
          </p>

          <div className="mt-8">
            {step === 'FORM' && (
              <Tabs defaultValue="STUDENT" onValueChange={(v) => setRole(v as 'STUDENT' | 'TEACHER')} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="STUDENT">Soy Alumno</TabsTrigger>
                  <TabsTrigger value="TEACHER">Soy Profesor</TabsTrigger>
                </TabsList>
                
                <TabsContent value="STUDENT">
                  <form onSubmit={handleSubmitStudent(onSubmitForm)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Nombre completo</Label>
                        <Input {...registerStudent("name")} placeholder="Juan Pérez" />
                        {errorsStudent.name && <p className="text-xs text-red-500">{errorsStudent.name.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label>Sede (Obligatorio)</Label>
                        <Select onValueChange={(v) => setStudentValue("sede", v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SEAGRULLO">El Grullo</SelectItem>
                            <SelectItem value="SEAAUTLAN">Autlán</SelectItem>
                            <SelectItem value="SEAUNION">Unión de Tula</SelectItem>
                          </SelectContent>
                        </Select>
                        {errorsStudent.sede && <p className="text-xs text-red-500">{errorsStudent.sede.message}</p>}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Correo electrónico</Label>
                        <Input type="email" {...registerStudent("email")} placeholder="correo@ejemplo.com" />
                        {errorsStudent.email && <p className="text-xs text-red-500">{errorsStudent.email.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label>Contraseña</Label>
                        <Input type="password" {...registerStudent("password")} placeholder="••••••••" />
                        {errorsStudent.password && <p className="text-xs text-red-500">{errorsStudent.password.message}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Teléfono</Label>
                        <Input type="tel" {...registerStudent("phone")} placeholder="317..." />
                        {errorsStudent.phone && <p className="text-xs text-red-500">{errorsStudent.phone.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label>Fecha de nacimiento</Label>
                        <Input type="date" {...registerStudent("birthDate")} />
                        {errorsStudent.birthDate && <p className="text-xs text-red-500">{errorsStudent.birthDate.message}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>CURP</Label>
                      <Input {...registerStudent("curp")} placeholder="ABCD123456EFGHIJ78" className="uppercase" />
                      {errorsStudent.curp && <p className="text-xs text-red-500">{errorsStudent.curp.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Nombre Contacto Emergencia 1</Label>
                        <Input {...registerStudent("emergencyContact")} />
                        {errorsStudent.emergencyContact && <p className="text-xs text-red-500">{errorsStudent.emergencyContact.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label>Teléfono Emergencia 1</Label>
                        <Input type="tel" {...registerStudent("emergencyPhone")} />
                        {errorsStudent.emergencyPhone && <p className="text-xs text-red-500">{errorsStudent.emergencyPhone.message}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Nombre Contacto Emergencia 2 (Opcional)</Label>
                        <Input {...registerStudent("emergencyContact2")} />
                      </div>
                      <div className="space-y-2">
                        <Label>Teléfono Emergencia 2 (Opcional)</Label>
                        <Input type="tel" {...registerStudent("emergencyPhone2")} />
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-sea-blue hover:bg-sea-blue/90 mt-4" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Registrarme <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="TEACHER">
                  <form onSubmit={handleSubmitTeacher(onSubmitForm)} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label>Nombre completo</Label>
                        <Input {...registerTeacher("name")} placeholder="Prof. Juan Pérez" />
                        {errorsTeacher.name && <p className="text-xs text-red-500">{errorsTeacher.name.message}</p>}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Correo electrónico</Label>
                          <Input type="email" {...registerTeacher("email")} placeholder="profesor@ejemplo.com" />
                          {errorsTeacher.email && <p className="text-xs text-red-500">{errorsTeacher.email.message}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label>Sede (Obligatorio)</Label>
                          <Select onValueChange={(v) => setTeacherValue("sede", v)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="SEAGRULLO">El Grullo</SelectItem>
                              <SelectItem value="SEAAUTLAN">Autlán</SelectItem>
                              <SelectItem value="SEAUNION">Unión de Tula</SelectItem>
                            </SelectContent>
                          </Select>
                          {errorsTeacher.sede && <p className="text-xs text-red-500">{errorsTeacher.sede.message}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Contraseña</Label>
                          <Input type="password" {...registerTeacher("password")} placeholder="••••••••" />
                          {errorsTeacher.password && <p className="text-xs text-red-500">{errorsTeacher.password.message}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label>Teléfono</Label>
                          <Input type="tel" {...registerTeacher("phone")} placeholder="317..." />
                          {errorsTeacher.phone && <p className="text-xs text-red-500">{errorsTeacher.phone.message}</p>}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Fecha de nacimiento</Label>
                        <Input type="date" {...registerTeacher("birthDate")} />
                        {errorsTeacher.birthDate && <p className="text-xs text-red-500">{errorsTeacher.birthDate.message}</p>}
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-sea-blue hover:bg-sea-blue/90 mt-4" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Registrarme <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            )}

            {step === 'OTP' && (
              <div className="flex flex-col items-center justify-center space-y-6">
                <div className="rounded-full bg-blue-50 p-4">
                  <Mail className="h-8 w-8 text-sea-blue" />
                </div>
                
                <div className="space-y-2 text-center">
                  <InputOTP 
                    maxLength={6} 
                    value={otp} 
                    onChange={setOtp}
                    disabled={isLoading}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <div className="flex flex-col space-y-3 w-full max-w-sm">
                  <Button onClick={onVerifyOTP} className="w-full bg-sea-blue hover:bg-sea-blue/90" disabled={isLoading || otp.length !== 6}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Verificar código
                  </Button>
                  <Button variant="ghost" onClick={() => setStep('FORM')} disabled={isLoading} className="text-slate-500">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Volver atrás
                  </Button>
                </div>
              </div>
            )}
            
            {step === 'FORM' && (
              <p className="mt-8 text-center text-sm text-slate-500">
                ¿Ya tienes una cuenta?{' '}
                <Link href="/login" className="font-semibold text-sea-blue hover:text-sea-blue/80 transition-colors">
                  Inicia sesión aquí
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="hidden lg:block relative w-1/2 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-sea-blue/80 to-slate-900/90 mix-blend-multiply" />
        <Image
          src="/images/auth-bg.jpg" // Using an existing image or fallback gracefully if 404
          alt="Authentication background"
          fill
          className="object-cover opacity-60 transition-transform duration-1000 hover:scale-105"
          sizes="50vw"
          priority
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-12 text-white">
          <h2 className="text-4xl font-bold mb-4 drop-shadow-md">Comienza tu viaje académico</h2>
          <p className="text-lg opacity-90 drop-shadow-sm max-w-xl">
            Únete a nuestra plataforma educativa integral diseñada para estudiantes y profesores. Gestiona todo tu progreso en un solo lugar.
          </p>
        </div>
      </div>
    </div>
  )
}
