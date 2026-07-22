import Link from "next/link"
import { Laptop, CircleCheck, ArrowRight, Video, MonitorPlay, Globe } from "lucide-react"

export function OnlineSection() {
  return (
    <section className="bg-card py-20 lg:py-28 overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          
          {/* Left Column: Visual/Card */}
          <div className="relative order-2 lg:order-1">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-emerald-600 to-sea-dark opacity-10 blur-2xl" />
            
            <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 to-sea-dark p-px shadow-2xl shadow-emerald-600/20">
              <div className="h-full rounded-3xl bg-card p-8 lg:p-12 relative overflow-hidden">
                {/* Decorative orbs */}
                <div className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full bg-emerald-600/10 blur-2xl transition-all group-hover:bg-emerald-600/20" />
                <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-sea-blue/5 blur-2xl transition-all" />
                
                <div className="relative z-10">
                  <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-600 shadow-xl shadow-emerald-600/30">
                    <Laptop className="h-10 w-10 text-white" />
                  </div>
                  
                  <h3 className="text-3xl font-extrabold text-heading md:text-4xl">
                    Campus Virtual 100% Interactivo
                  </h3>
                  
                  <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                    Conéctate a tus clases desde cualquier lugar del mundo. Nuestra plataforma en línea te brinda la misma calidad educativa, atención personalizada y dinamismo que nuestras clases presenciales.
                  </p>
                  
                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    {[
                      "Plataforma interactiva 24/7",
                      "Profesores certificados en vivo",
                      "Misma validez oficial",
                      "Flexibilidad total de horarios",
                      "Recursos digitales exclusivos",
                      "Grupos reducidos dinámicos"
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-3 rounded-xl bg-emerald-600/5 px-4 py-3 border border-emerald-600/10 transition-colors hover:bg-emerald-600/10">
                        <CircleCheck className="h-4 w-4 shrink-0 text-emerald-600" />
                        <span className="text-sm font-semibold text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="flex flex-col gap-6 order-1 lg:order-2">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-600/30 bg-emerald-600/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700">
              <MonitorPlay className="h-3.5 w-3.5" />
              Academia SEA Digital
            </span>
            
            <h2 className="text-pretty text-4xl font-black text-heading md:text-5xl lg:text-6xl tracking-tight leading-[1.1]">
              Aprende inglés sin <span className="text-emerald-600">fronteras.</span>
            </h2>
            
            <p className="text-lg leading-relaxed text-muted-foreground">
              Rompe las barreras geográficas y de tiempo. Nuestro modelo educativo ha sido adaptado magistralmente al entorno virtual para asegurar que logres fluidez y confianza, sin importar dónde te encuentres.
            </p>

            <div className="mt-4 flex flex-col gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <Video className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-heading">Clases Transmitidas en Tiempo Real</h4>
                  <p className="mt-1 text-sm text-muted-foreground">Interactúa con tus compañeros y maestros como si estuvieras en el salón de clases.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                  <Globe className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-heading">Estudiantes de Todo el País</h4>
                  <p className="mt-1 text-sm text-muted-foreground">Únete a una comunidad diversa y practica tu inglés en un entorno enriquecedor.</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/cursos"
                className="group inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 transition-all hover:-translate-y-0.5 hover:bg-emerald-700"
              >
                Explorar Modalidad Online
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
