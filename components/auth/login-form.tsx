'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { signIn, useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Shield, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function LoginForm({ logoUrl }: { logoUrl?: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { status } = useSession()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [sede, setSede] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Redirect if already logged in
  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/dashboard')
    }
  }, [status, router])

  // Check for error in URL (e.g., from callback)
  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam) {
      if (errorParam === 'CredentialsSignin') {
        setError('Credenciales incorrectas. Verifica tu correo y contraseña.')
      } else if (errorParam === 'AccessDenied') {
        setError('No tienes acceso a esta cuenta.')
      } else {
        setError('Ha ocurrido un error. Intenta de nuevo.')
      }
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (!sede) {
      setError('Por favor selecciona una sede para ingresar.')
      return
    }

    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        sede,
        redirect: false,
      })

      if (result?.error) {
        setError('Credenciales incorrectas. Verifica tu correo y contraseña.')
        setIsLoading(false)
        return
      }

      if (result?.ok) {
        router.replace('/dashboard')
      }
    } catch {
      setError('Ha ocurrido un error de conexion. Intenta de nuevo.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 h-96 w-96 rounded-full bg-sea-blue/[0.03] blur-3xl" />
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-72 w-72 rounded-full bg-coral/[0.03] blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-sea-blue/[0.02] blur-3xl" />

      {/* Top navigation */}
      <div className="absolute top-8 left-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-sea-blue transition-all group">
          <span className="flex items-center justify-center h-8 w-8 rounded-full bg-white border border-slate-200 shadow-sm group-hover:border-sea-blue/30 group-hover:bg-sea-blue/5 transition-all">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </span>
          Volver al inicio
        </Link>
      </div>

      {/* Card */}
      <div className="relative w-full max-w-md mt-6">
        {/* Branding header */}
        <div className="text-center mb-0">
          <div className="flex flex-col items-center">
            {logoUrl ? (
              <Image 
                src={logoUrl} 
                alt="Academia SEA" 
                width={600} 
                height={200} 
                className="h-32 md:h-40 w-64 md:w-80 lg:w-96 object-cover"
                priority
              />
            ) : (
              <>
                <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-sea-blue shadow-lg shadow-sea-blue/20 mb-4">
                  <Shield className="h-10 w-10 text-white" />
                </div>
                <h1 className="text-3xl font-black text-heading tracking-tight">
                  Academia SEA
                </h1>
                <p className="text-base text-slate-500 mt-1">
                  Panel de Administración
                </p>
              </>
            )}
          </div>
        </div>

        {/* Login card */}
        <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/40 p-8 backdrop-blur-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-heading">
              Iniciar Sesión
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Ingresa tus credenciales para acceder al panel
            </p>
          </div>

          {/* Error alert */}
          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-coral/20 bg-coral/5 px-4 py-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-coral" />
              <p className="text-sm text-coral font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email field */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-sm font-semibold text-slate-700"
              >
                Correo electrónico
              </label>
              <Input
                id="email"
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                disabled={isLoading}
                className="h-11"
              />
            </div>

            {/* Sede field */}
            <div className="space-y-1.5">
              <label
                htmlFor="sede"
                className="text-sm font-semibold text-slate-700"
              >
                Sede
              </label>
              <Select value={sede} onValueChange={setSede} disabled={isLoading}>
                <SelectTrigger className="h-11 bg-white">
                  <SelectValue placeholder="Selecciona tu sede" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SEAGRULLO">SEA El Grullo</SelectItem>
                  <SelectItem value="SEAAUTLAN">SEA Autlán</SelectItem>
                  <SelectItem value="SEAUNION">SEA Unión de Tula</SelectItem>
                  <SelectItem value="EN_LINEA">SEA En Línea</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-slate-700"
              >
                Contraseña
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  disabled={isLoading}
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              className="w-full h-11 bg-sea-blue hover:bg-sea-blue-light text-white font-bold shadow-md shadow-sea-blue/20 transition-all active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Ingresando...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 space-y-2">
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} Academia SEA. Todos los derechos reservados.
          </p>
          <a 
            href="https://www.kytcode.lat" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-300 hover:text-sea-blue transition-colors"
          >
            Desarrollado por K&T <span className="text-black">❤️</span>
          </a>
        </div>
      </div>
    </div>
  )
}
