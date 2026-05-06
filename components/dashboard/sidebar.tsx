"use client"

import { useState, createContext, useContext } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  BarChart3,
  CreditCard,
  Calendar,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  FileText,
  TrendingUp,
  ClipboardList,
  UserCheck,
  Shield,
  Megaphone,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type Role = 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT'

interface SidebarContextType {
  collapsed: boolean
  setCollapsed: (v: boolean) => void
}

const SidebarContext = createContext<SidebarContextType>({
  collapsed: false,
  setCollapsed: () => {},
})

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  roles: Role[]
  badge?: string
}

const navItems: NavItem[] = [
  // Admin & Teacher
  {
    label: 'Panel Principal',
    href: '/dashboard',
    icon: <LayoutDashboard className="size-5" />,
    roles: ['ADMIN', 'TEACHER'],
  },
  {
    label: 'Métricas',
    href: '/dashboard/metricas',
    icon: <TrendingUp className="size-5" />,
    roles: ['ADMIN'],
  },
  // School Management
  {
    label: 'Alumnos',
    href: '/dashboard/alumnos',
    icon: <GraduationCap className="size-5" />,
    roles: ['ADMIN', 'TEACHER'],
  },
  {
    label: 'Familias',
    href: '/dashboard/familias',
    icon: <Users className="size-5" />,
    roles: ['ADMIN'],
  },
  {
    label: 'Profesores',
    href: '/dashboard/profesores',
    icon: <UserCheck className="size-5" />,
    roles: ['ADMIN'],
  },
  {
    label: 'Grupos y Cursos',
    href: '/dashboard/cursos',
    icon: <BookOpen className="size-5" />,
    roles: ['ADMIN', 'TEACHER'],
  },
  // Academic
  {
    label: 'Calificaciones',
    href: '/dashboard/calificaciones',
    icon: <BarChart3 className="size-5" />,
    roles: ['ADMIN', 'TEACHER'],
  },
  {
    label: 'Evaluaciones',
    href: '/dashboard/evaluaciones',
    icon: <ClipboardList className="size-5" />,
    roles: ['ADMIN', 'TEACHER'],
  },
  {
    label: 'Asistencia',
    href: '/dashboard/asistencia',
    icon: <UserCheck className="size-5" />,
    roles: ['ADMIN', 'TEACHER'],
  },
  {
    label: 'Boletas PDF',
    href: '/dashboard/boletas',
    icon: <FileText className="size-5" />,
    roles: ['ADMIN', 'TEACHER'],
  },
  // Financial
  {
    label: 'Pagos',
    href: '/dashboard/pagos',
    icon: <CreditCard className="size-5" />,
    roles: ['ADMIN'],
  },
  {
    label: 'Becas',
    href: '/dashboard/becas',
    icon: <Shield className="size-5" />,
    roles: ['ADMIN'],
  },
  {
    label: 'Estados de Cuenta',
    href: '/dashboard/estados-cuenta',
    icon: <FileText className="size-5" />,
    roles: ['ADMIN'],
  },
  // Communication
  {
    label: 'Anuncios',
    href: '/dashboard/anuncios',
    icon: <Megaphone className="size-5" />,
    roles: ['ADMIN', 'TEACHER'],
  },
  {
    label: 'Mensajes',
    href: '/dashboard/mensajes',
    icon: <MessageSquare className="size-5" />,
    roles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
  },
  // Calendar
  {
    label: 'Calendario',
    href: '/dashboard/calendario',
    icon: <Calendar className="size-5" />,
    roles: ['ADMIN', 'TEACHER', 'STUDENT'],
  },
  // Student
  {
    label: 'Mis Calificaciones',
    href: '/dashboard/mis-calificaciones',
    icon: <BarChart3 className="size-5" />,
    roles: ['STUDENT'],
  },
  {
    label: 'Mi Asistencia',
    href: '/dashboard/mi-asistencia',
    icon: <UserCheck className="size-5" />,
    roles: ['STUDENT'],
  },
  {
    label: 'Mis Pagos',
    href: '/dashboard/mis-pagos',
    icon: <CreditCard className="size-5" />,
    roles: ['STUDENT', 'PARENT'],
  },
  // Settings
  {
    label: 'Configuración',
    href: '/dashboard/configuracion',
    icon: <Settings className="size-5" />,
    roles: ['ADMIN'],
  },
]

function NavGroup({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  const { collapsed } = useContext(SidebarContext)
  if (collapsed) return <>{children}</>
  return (
    <div className="px-3 pb-2">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">
        {label}
      </p>
      <div className="space-y-0.5">{children}</div>
    </div>
  )
}

function NavLink({
  item,
  currentPath,
}: {
  item: NavItem
  currentPath: string
}) {
  const { collapsed } = useContext(SidebarContext)
  const isActive =
    currentPath === item.href ||
    (item.href !== '/dashboard' && currentPath.startsWith(item.href))

  return (
    <Link
      href={item.href}
      className={cn(
        'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 group relative',
        isActive
          ? 'bg-sea-blue text-white shadow-md shadow-sea-blue/20'
          : 'text-slate-600 hover:bg-slate-100 hover:text-sea-blue',
        collapsed && 'justify-center px-2'
      )}
      title={collapsed ? item.label : undefined}
    >
      <span
        className={cn(
          'flex-shrink-0 transition-colors',
          isActive ? 'text-white' : 'text-slate-400 group-hover:text-sea-blue'
        )}
      >
        {item.icon}
      </span>
      {!collapsed && (
        <span className="flex-1 truncate">{item.label}</span>
      )}
      {!collapsed && item.badge && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-coral px-1.5 text-[10px] font-bold text-white">
          {item.badge}
        </span>
      )}
    </Link>
  )
}

export function DashboardSidebar({
  userRole,
  userName,
  logoUrl,
}: {
  userRole: Role
  userName: string
  logoUrl?: string
}) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  const filteredItems = navItems.filter((item) =>
    item.roles.includes(userRole)
  )

  const sections = filteredItems.reduce<Record<string, NavItem[]>>(
    (acc, item) => {
      if (item.href === '/dashboard') {
        if (!acc['Principal']) acc['Principal'] = []
        acc['Principal'].push(item)
      } else if (['/dashboard/alumnos', '/dashboard/familias', '/dashboard/profesores', '/dashboard/cursos'].includes(item.href)) {
        if (!acc['Escolar']) acc['Escolar'] = []
        acc['Escolar'].push(item)
      } else if (['/dashboard/calificaciones', '/dashboard/evaluaciones', '/dashboard/asistencia', '/dashboard/boletas'].includes(item.href)) {
        if (!acc['Académico']) acc['Académico'] = []
        acc['Académico'].push(item)
      } else if (['/dashboard/pagos', '/dashboard/becas', '/dashboard/estados-cuenta'].includes(item.href)) {
        if (!acc['Financiero']) acc['Financiero'] = []
        acc['Financiero'].push(item)
      } else if (['/dashboard/anuncios', '/dashboard/mensajes'].includes(item.href)) {
        if (!acc['Comunicación']) acc['Comunicación'] = []
        acc['Comunicación'].push(item)
      } else if (['/dashboard/calendario'].includes(item.href)) {
        if (!acc['Herramientas']) acc['Herramientas'] = []
        acc['Herramientas'].push(item)
      } else if (['/dashboard/mis-calificaciones', '/dashboard/mi-asistencia', '/dashboard/mis-pagos'].includes(item.href)) {
        if (!acc['Mi Panel']) acc['Mi Panel'] = []
        acc['Mi Panel'].push(item)
      } else if (['/dashboard/configuracion', '/dashboard/metricas'].includes(item.href)) {
        if (!acc['Sistema']) acc['Sistema'] = []
        acc['Sistema'].push(item)
      }
      return acc
    },
    {}
  )

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      <aside
        className={cn(
          'z-40 h-screen flex-shrink-0 hidden md:flex flex-col bg-white border-r border-slate-200 transition-all duration-300',
          collapsed ? 'w-[72px]' : 'w-64'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-center h-32 border-b border-slate-100 px-4">
          <Link href="/dashboard" className="flex items-center justify-center w-full">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt="Academia SEA"
                width={240}
                height={100}
                className={cn(
                  "h-20 w-auto object-cover transition-all duration-300",
                  collapsed ? "w-12" : "w-56"
                )}
              />
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-sea-blue">
                  <Shield className="size-4 text-white" />
                </div>
                {!collapsed && (
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-heading leading-tight">Panel</span>
                    <span className="text-[10px] text-slate-400 leading-tight">Academia SEA</span>
                  </div>
                )}
              </div>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin">
          {Object.entries(sections).map(([sectionLabel, items]) => (
            <NavGroup key={sectionLabel} label={sectionLabel}>
              {items.map((item) => (
                <NavLink key={item.href} item={item} currentPath={pathname} />
              ))}
            </NavGroup>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-100 p-3">
          {!collapsed ? (
            <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 bg-slate-50 mb-2">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-sea-blue text-white text-xs font-bold">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-semibold text-slate-800">{userName}</p>
                <p className="text-[10px] text-slate-400">{userRole === 'ADMIN' ? 'Administrador' : userRole === 'TEACHER' ? 'Profesor' : userRole === 'STUDENT' ? 'Estudiante' : 'Padre/Tutor'}</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center mb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sea-blue text-white text-xs font-bold">
                {userName.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            {!collapsed && (
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="flex flex-1 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
              >
                <LogOut className="size-4" />
                <span>Cerrar sesión</span>
              </button>
            )}
            {collapsed && (
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="flex flex-1 justify-center rounded-xl px-3 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
                title="Cerrar sesión"
              >
                <LogOut className="size-4" />
              </button>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="flex items-center justify-center rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              title={collapsed ? 'Expandir' : 'Colapsar'}
            >
              {collapsed ? (
                <ChevronRight className="size-4" />
              ) : (
                <ChevronLeft className="size-4" />
              )}
            </button>
          </div>
        </div>
      </aside>
    </SidebarContext.Provider>
  )
}

export function DashboardTopBar({ title }: { title: string }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 -mt-4 md:-mt-8 lg:-mt-10 -mx-4 md:-mx-8 lg:-mx-10 mb-2 flex h-16 items-center gap-4 border-b border-slate-200 bg-white/80 backdrop-blur-md px-6 md:px-10">
      <button
        className="lg:hidden rounded-lg p-2 text-slate-500 hover:bg-slate-100"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <Menu className="size-5" />
      </button>
      <h1 className="text-lg font-bold text-heading">{title}</h1>
      <div className="ml-auto flex items-center gap-3">
        <button className="relative rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
          <Bell className="size-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-coral" />
        </button>
        <Link
          href="/"
          className="hidden sm:flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          Ver sitio
        </Link>
      </div>
    </header>
  )
}