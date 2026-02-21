import type { Metadata } from "next"
import {
  Heart,
  Eye,
  Target,
  Shield,
  Sparkles,
  ThumbsUp,
  Flame,
  Award,
  Users,
  Monitor,
  MapPin,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Nuestra Escuela",
  description:
    "Conoce la historia, mision, vision y valores de Academia SEA. Escuela de ingles fundada en 2008 con presencia en Jalisco.",
  openGraph: {
    title: "Nuestra Escuela | Academia SEA",
    description:
      "Conoce la historia, mision, vision y valores de Academia SEA en Jalisco.",
  },
}

const valores = [
  { icon: Shield, label: "Responsabilidad", color: "bg-sea-blue/10 text-sea-blue" },
  { icon: ThumbsUp, label: "Honestidad", color: "bg-mint/40 text-accent-foreground" },
  { icon: Sparkles, label: "Excelencia", color: "bg-yellow-soft text-amber-700" },
  { icon: Flame, label: "Pasion", color: "bg-red-50 text-red-600" },
  { icon: Award, label: "Calidad", color: "bg-sea-blue-light/20 text-sea-dark" },
  { icon: Users, label: "Respeto", color: "bg-mint/40 text-accent-foreground" },
]

export default function NosotrosPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-background py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-sea-blue">
              Nuestra Escuela
            </p>
            <h1 className="text-pretty text-4xl font-extrabold text-heading md:text-5xl">
              Conoce Academia SEA
            </h1>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
              Somos una escuela de ingles que se fundo en el ano 2008 con el objetivo de ofrecer
              ensenanza de calidad en el idioma ingles en la region de Jalisco. A lo largo de mas de
              15 anos, hemos formado miles de estudiantes exitosos, desde ninos en preescolar hasta
              profesionales del sector empresarial.
            </p>
          </div>
        </div>
      </section>

      {/* Mision, Vision y Valores */}
      <section className="bg-card py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-pretty text-3xl font-bold text-heading md:text-4xl">
              Mision, Vision y Valores
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Mision */}
            <div className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-8 shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-sea-blue/10">
                <Target className="h-7 w-7 text-sea-blue" />
              </div>
              <h3 className="text-xl font-bold text-heading">Mision</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Formar personas competentes en el idioma ingles a traves de una metodologia de
                ensenanza innovadora, con docentes altamente capacitados, utilizando tecnologia de
                punta y fomentando valores que contribuyan al desarrollo integral de nuestros
                alumnos.
              </p>
            </div>

            {/* Vision */}
            <div className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-8 shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-mint/40">
                <Eye className="h-7 w-7 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-bold text-heading">Vision</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Ser la institucion lider en la ensenanza del idioma ingles en la region, reconocida
                por la calidad de nuestros programas, la excelencia de nuestros docentes y la
                formacion integral que brindamos a nuestros estudiantes para competir en un entorno
                globalizado.
              </p>
            </div>
          </div>

          {/* Valores */}
          <div className="mt-12">
            <h3 className="mb-8 text-center text-xl font-bold text-heading">Nuestros Valores</h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {valores.map((valor) => (
                <div
                  key={valor.label}
                  className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-background p-6 text-center transition-all hover:shadow-md"
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${valor.color}`}
                  >
                    <valor.icon className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">{valor.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Programa y Modalidades */}
      <section className="bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-sea-blue">
              Programa Educativo
            </p>
            <h2 className="text-pretty text-3xl font-bold text-heading md:text-4xl">
              Nuestro Programa y Modalidades
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Ofrecemos un programa integral que cubre todos los niveles del idioma ingles, desde
              principiante hasta avanzado, con metodologia Macmillan Education y respaldo de la SEP.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Presencial */}
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-sm">
              <div className="pointer-events-none absolute top-0 right-0 h-24 w-24 rounded-bl-full bg-sea-blue/5" />
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-sea-blue/10">
                <MapPin className="h-7 w-7 text-sea-blue" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-heading">Clases Presenciales</h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Asiste a nuestras instalaciones en El Grullo, Autlan o Union de Tula. Disfruta de
                aulas equipadas con tecnologia educativa, grupos reducidos y la interaccion directa
                con nuestros docentes certificados. La experiencia presencial incluye actividades
                dinamicas, practicas de conversacion y acceso a material fisico y digital.
              </p>
              <ul className="mt-4 flex flex-col gap-2">
                {[
                  "Grupos reducidos",
                  "Aulas equipadas con tecnologia",
                  "Material Macmillan incluido",
                  "Horarios flexibles",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-sea-blue" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* En Linea */}
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-sm">
              <div className="pointer-events-none absolute top-0 right-0 h-24 w-24 rounded-bl-full bg-mint/20" />
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-mint/40">
                <Monitor className="h-7 w-7 text-accent-foreground" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-heading">Clases en Linea</h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Aprende ingles desde la comodidad de tu hogar o cualquier lugar con conexion a
                internet. Nuestras clases en linea mantienen la misma calidad, metodologia y
                seguimiento personalizado que nuestras clases presenciales, con herramientas
                digitales interactivas.
              </p>
              <ul className="mt-4 flex flex-col gap-2">
                {[
                  "Plataforma interactiva",
                  "Clases en vivo con docente",
                  "Acceso a material digital",
                  "Flexibilidad de horarios",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent-foreground" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
