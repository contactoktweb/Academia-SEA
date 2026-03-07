import {
  Compass,
  Telescope,
  School,
  Laptop,
  BookOpen,
  CircleCheck,
  Shield,
  Languages,
  Globe,
  Users,
  Award,
  Zap
} from "lucide-react"
import { SubpageHero } from "@/components/subpage-hero"
import { client } from "@/sanity/lib/client"
import { ABOUT_HERO_QUERY, ABOUT_TIMELINE_QUERY, ABOUT_PHILOSOPHY_QUERY, ABOUT_VALUES_QUERY, ABOUT_MODALITIES_QUERY } from "@/sanity/lib/queries"
import { iconMap } from "@/lib/icons"

const misionVision = {
  mision: {
    titulo: "Misión",
    contenido: "Formar personas competentes en el idioma inglés a través de una metodología de enseñanza innovadora que integra la calidez humana, la tecnología y el compromiso con la excelencia académica, transformando la vida de nuestros estudiantes y abriéndoles las puertas a un mundo de oportunidades globales."
  },
  vision: {
    titulo: "Visión",
    contenido: "Ser la institución líder en la enseñanza del idioma inglés en la región, reconocida por la calidad humana de nuestro equipo, la efectividad de nuestra metodología y la capacidad de inspirar a cada estudiante a alcanzar su máximo potencial, convirtiéndonos en el puente definitivo hacia su éxito profesional y personal."
  }
}

const valores = [
  {
    titulo: "Responsabilidad y compromiso",
    descripcion: "Cumplimos cada meta y acuerdo con nuestros alumnos y sus familias, garantizando un acompañamiento real en su aprendizaje.",
    icono: "Shield",
    color: "from-blue-600 to-blue-400"
  },
  {
    titulo: "Pasión por la enseñanza",
    descripcion: "Amamos lo que hacemos y transmitimos ese entusiasmo en cada clase para motivar a nuestros estudiantes.",
    icono: "Zap",
    color: "from-amber-500 to-orange-400"
  },
  {
    titulo: "Innovación educativa",
    descripcion: "Evolucionamos constantemente integrando nuevas herramientas y metodologías para facilitar el aprendizaje.",
    icono: "Monitor",
    color: "from-emerald-500 to-teal-400"
  },
  {
    titulo: "Calidez y cercanía",
    descripcion: "Creamos un ambiente seguro y familiar donde cada alumno se siente valorado y escuchado.",
    icono: "Users",
    color: "from-rose-500 to-pink-400"
  },
  {
    titulo: "Excelencia académica",
    descripcion: "Buscamos los más altos estándares en cada nivel educativo, desde preescolar hasta certificaciones avanzadas.",
    icono: "Award",
    color: "from-indigo-600 to-indigo-400"
  },
  {
    titulo: "Integridad y Ética",
    descripcion: "Actuamos con honestidad y transparencia en todos nuestros procesos administrativos y académicos.",
    icono: "Globe",
    color: "from-slate-700 to-slate-500"
  }
]

const modalidades = {
  presencial: {
    titulo: "Clases Presenciales",
    descripcion: "Experimenta la inmersión total con clases dinámicas en nuestras modernas instalaciones. Interacción inmediata y ambiente de aprendizaje colaborativo.",
    beneficios: ["Grupos reducidos", "Tecnología educativa", "Interacción real", "Ambiente seguro"]
  },
  online: {
    titulo: "Clases en Línea",
    descripcion: "Aprende desde cualquier lugar con nuestra plataforma interactiva. Clases en vivo con profesores expertos y material digital exclusivo.",
    beneficios: ["Plataforma interactiva", "Clases en vivo", "Flexibilidad total", "Certificación igual"]
  }
}

export default async function NosotrosPage() {
  const [hero, timelineData, philosophyData, valuesData, modalitiesData] = await Promise.all([
    client.fetch(ABOUT_HERO_QUERY),
    client.fetch(ABOUT_TIMELINE_QUERY),
    client.fetch(ABOUT_PHILOSOPHY_QUERY),
    client.fetch(ABOUT_VALUES_QUERY),
    client.fetch(ABOUT_MODALITIES_QUERY),
  ])

  const hitos = timelineData?.hitos || []
  const misionVision = philosophyData
  const valores = valuesData?.valores || []
  const modalidades = modalitiesData

  return (
    <>
      {/* Hero - Light themed centered */}
      <SubpageHero
        badge={hero?.badge || "Desde 2008 en Jalisco"}
        badgeIcon={BookOpen}
        title={hero?.titulo || "Donde aprender inglés"}
        titleHighlight={hero?.tituloResaltado || "transforma vidas."}
        subtitle={hero?.subtitulo || "Más de 15 años formando estudiantes exitosos..."}
      />

      {/* Timeline */}
      <section className="bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
          <div className="mx-auto mb-16 flex max-w-2xl flex-col items-center gap-4 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-sea-blue/20 bg-sea-blue/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-sea-blue">
              {timelineData?.badge || "Trayectoria"}
            </span>
            <h2 className="text-pretty text-3xl font-extrabold text-heading md:text-4xl">
              {timelineData?.titulo || "Nuestra historia en el tiempo"}
            </h2>
          </div>

          <div className="relative">
            <div className="absolute top-6 right-0 left-0 hidden h-0.5 bg-gradient-to-r from-sea-blue via-mint to-sea-blue-light lg:block" />

            <div className="grid gap-8 lg:grid-cols-5 lg:gap-4">
              {hitos.map((item: any, i: number) => (
                <div key={item._key || i} className="relative flex flex-col items-center gap-4 text-center lg:pt-16">
                  <div className="absolute top-0 hidden h-12 w-12 items-center justify-center rounded-full border-4 border-background bg-sea-blue shadow-lg shadow-sea-blue/20 lg:flex">
                    <span className="text-xs font-extrabold text-white">{item.anio}</span>
                  </div>

                  <div className="group w-full rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-xl">
                    <span className="mb-2 inline-block text-sm font-extrabold text-sea-blue lg:hidden">{item.anio}</span>
                    <h3 className="text-base font-bold text-heading">{item.titulo}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{item.descripcion}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mision & Vision */}
      <section className="relative overflow-hidden bg-card py-20 lg:py-28">
        {/* Fondo decorativo */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-sea-blue/5 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-emerald-600/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-[1440px] px-4 lg:px-8">
          {/* Header */}
          <div className="mx-auto mb-16 flex max-w-2xl flex-col items-center gap-4 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-600/30 bg-emerald-600/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700">
              {misionVision?.badge || "Filosofía"}
            </span>
            <h2 className="text-pretty text-3xl font-extrabold text-heading md:text-4xl">
              {misionVision?.titulo || "Misión y Visión"}
            </h2>
            <p className="text-sm text-muted-foreground max-w-md">
              Los principios que guían cada decisión, cada clase y cada logro de nuestros estudiantes.
            </p>
          </div>

          {/* Cards */}
          <div className="mx-auto max-w-5xl flex flex-col gap-6">

            {/* Misión */}
            <div className="group relative overflow-hidden rounded-3xl border border-sea-blue/20 bg-background p-px shadow-xl shadow-sea-blue/5 transition-all hover:shadow-2xl hover:shadow-sea-blue/10">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-sea-blue/20 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative rounded-3xl bg-background p-8 lg:p-10">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
                  {/* Icon + number */}
                  <div className="flex shrink-0 flex-col items-center gap-3 lg:items-center">
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-sea-blue shadow-xl shadow-sea-blue/30 transition-transform group-hover:scale-105">
                      <Compass className="h-9 w-9 text-white" />
                      <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-sea-blue text-[10px] font-black text-white shadow">01</span>
                    </div>
                  </div>
                  {/* Content */}
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-3">
                      <h3 className="text-2xl font-extrabold text-heading">
                        {misionVision?.mision?.titulo || "Misión"}
                      </h3>
                      <div className="h-px flex-1 bg-gradient-to-r from-sea-blue/30 to-transparent" />
                    </div>
                    <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                      {misionVision?.mision?.contenido}
                    </p>
                    {/* Accent bar */}
                    <div className="mt-6 h-1 w-16 rounded-full bg-gradient-to-r from-sea-blue to-sea-blue-light transition-all group-hover:w-32" />
                  </div>
                </div>
              </div>
            </div>

            {/* Separador central */}
            <div className="flex items-center justify-center gap-4 py-2">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card shadow-sm">
                <Languages className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent via-border to-transparent" />
            </div>

            {/* Visión */}
            <div className="group relative overflow-hidden rounded-3xl bg-[#0b1e3d] p-px shadow-xl shadow-emerald-600/5 transition-all hover:shadow-2xl hover:shadow-emerald-600/10">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-600/20 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              {/* Orbs decorativos */}
              <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-emerald-600/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-sea-blue/10 blur-3xl" />
              <div className="relative rounded-3xl bg-[#0b1e3d] p-8 lg:p-10">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
                  {/* Icon + number */}
                  <div className="flex shrink-0 flex-col items-center gap-3 lg:items-center">
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-600 shadow-xl shadow-emerald-600/30 transition-transform group-hover:scale-105">
                      <Telescope className="h-9 w-9 text-white" />
                      <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-black text-white shadow">02</span>
                    </div>
                  </div>
                  {/* Content */}
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-3">
                      <h3 className="text-2xl font-extrabold text-white">
                        {misionVision?.vision?.titulo || "Visión"}
                      </h3>
                      <div className="h-px flex-1 bg-gradient-to-r from-emerald-600/30 to-transparent" />
                    </div>
                    <p className="mt-3 text-base leading-relaxed text-slate-300">
                      {misionVision?.vision?.contenido}
                    </p>
                    {/* Accent bar */}
                    <div className="mt-6 h-1 w-16 rounded-full bg-gradient-to-r from-emerald-600 to-[#059669] transition-all group-hover:w-32" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="relative overflow-hidden bg-background py-20 lg:py-28">
        <div className="pointer-events-none absolute inset-0 opacity-[0.015]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: "radial-gradient(circle, #1E3A8A 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-[1440px] px-4 lg:px-8">
          <div className="mx-auto mb-16 flex max-w-2xl flex-col items-center gap-4 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-yellow-soft/50 bg-yellow-soft/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-700">
              {valuesData?.badge || "Lo que nos define"}
            </span>
            <h2 className="text-pretty text-3xl font-extrabold text-heading md:text-4xl">
              {valuesData?.titulo || "Nuestros Valores"}
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {valores.map((valor: any, i: number) => {
              const Icon = iconMap[valor.icono] || Shield
              const staticColor = i % 2 === 0 ? "from-sea-dark to-sea-blue" : "from-coral to-coral-light"

              return (
                <div
                  key={valor._key || i}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className={`absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r ${staticColor}`} />
                  <span className="pointer-events-none absolute -right-2 -bottom-4 text-[80px] font-black leading-none text-foreground/[0.02] transition-colors group-hover:text-sea-blue/[0.04]">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="relative flex flex-col gap-4">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${i % 2 === 0 ? 'bg-sea-dark' : 'bg-coral'} shadow-lg transition-transform group-hover:scale-110`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-heading">{valor.titulo}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{valor.descripcion}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Modalidades */}
      <section className="bg-card py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
          <div className="mx-auto mb-16 flex max-w-2xl flex-col items-center gap-4 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-sea-blue/20 bg-sea-blue/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-sea-blue">
              {modalidades?.badge || "Programa Educativo"}
            </span>
            <h2 className="text-pretty text-3xl font-extrabold text-heading md:text-4xl">
              {modalidades?.titulo || "Nuestras Modalidades"}
            </h2>
            <p className="max-w-lg text-base leading-relaxed text-muted-foreground">
              {modalidades?.descripcion || "Elige la modalidad que mejor se adapte a tu estilo de vida. Misma calidad, mismo compromiso."}
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Presencial */}
            <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-sea-blue to-sea-dark p-px shadow-xl shadow-sea-blue/10">
              <div className="h-full rounded-3xl bg-card p-8 lg:p-10">
                <div className="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full bg-sea-blue/5 blur-2xl transition-all group-hover:bg-sea-blue/10" />
                <div className="relative">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-sea-blue shadow-lg shadow-sea-blue/20">
                    <School className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-heading">{modalidades?.presencial?.titulo || "Clases Presenciales"}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {modalidades?.presencial?.descripcion}
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    {modalidades?.presencial?.beneficios?.map((item: string) => (
                      <div key={item} className="flex items-center gap-2 rounded-xl bg-sea-blue/5 px-3 py-2">
                        <CircleCheck className="h-3.5 w-3.5 shrink-0 text-sea-blue" />
                        <span className="text-xs font-medium text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* En Línea */}
            <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 to-sea-dark p-px shadow-xl shadow-emerald-600/10">
              <div className="h-full rounded-3xl bg-card p-8 lg:p-10">
                <div className="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full bg-emerald-600/5 blur-2xl transition-all group-hover:bg-emerald-600/10" />
                <div className="relative">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 shadow-lg shadow-emerald-600/20">
                    <Laptop className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-heading">{modalidades?.online?.titulo || "Clases en Línea"}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {modalidades?.online?.descripcion}
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    {modalidades?.online?.beneficios?.map((item: string) => (
                      <div key={item} className="flex items-center gap-2 rounded-xl bg-emerald-600/10 px-3 py-2">
                        <CircleCheck className="h-3.5 w-3.5 shrink-0 text-emerald-700" />
                        <span className="text-xs font-medium text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
