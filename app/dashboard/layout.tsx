import { ReactNode } from "react"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { client } from "@/sanity/lib/client"
import { GLOBAL_CONFIG_QUERY } from "@/sanity/lib/queries"
import { urlFor } from "@/sanity/lib/image"
import { checkAndActivateTeacherByUserId } from "@/lib/teacher-activation"

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const [session, globalConfig] = await Promise.all([
    auth(),
    client.fetch(GLOBAL_CONFIG_QUERY)
  ])

  if (!session) {
    redirect("/login")
  }

  let effectiveApproved = session.user.isApproved;
  if (session.user.role === 'TEACHER' && !effectiveApproved && session.user.id) {
    effectiveApproved = await checkAndActivateTeacherByUserId(session.user.id);
  }

  const logoUrl = globalConfig?.logo?.asset ? urlFor(globalConfig.logo.asset).url() : "/images/SEA_LOGO-05.png"

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <DashboardSidebar 
        userRole={session.user.role as any} 
        userName={session.user.name || "Usuario"} 
        logoUrl={logoUrl}
        isApproved={effectiveApproved}
      />
      <main className="flex-1 min-w-0 flex flex-col overflow-y-auto">
        <div className="flex-1 flex flex-col p-4 md:p-8 lg:p-10 gap-6">
          {children}
        </div>
        <footer className="p-6 text-center border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Academia SEA. Todos los derechos reservados.
          </p>
          <a 
            href="https://www.kytcode.lat" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-slate-400 hover:text-sea-blue transition-colors"
          >
            Desarrollado por K&T <span className="text-black dark:text-white">❤️</span>
          </a>
        </footer>
      </main>
    </div>
  )
}
