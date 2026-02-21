import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { MessageCircle, GraduationCap, Users, Baby, BookOpen, Briefcase, ArrowRight, Sparkles } from "lucide-react"
import { SubpageHero } from "@/components/subpage-hero"

export const metadata: Metadata = {
  title: "Nuestros Cursos",
  description:
    "Descubre los cursos de ingles de Academia SEA para jovenes, adultos, secundaria, primaria, preescolar y empresas.",
  openGraph: {
    title: "Nuestros Cursos | Academia SEA",
    description: "Cursos de ingles para todas las edades y niveles en Jalisco.",
  },
}

const courses = [
  {
    title: "Jovenes y Adultos",
    badge: "Basico a Avanzado",
    icon: GraduationCap,
    accentFrom: "from-sea-blue",
    accentTo: "to-sea-blue-light",
    badgeBg: "bg-sea-blue/10 text-sea-blue",
    image: "/images/course-adults.jpg",
    description:
      "Programa para llevar al alumno desde un nivel basico hasta avanzado. Enfoque comunicativo que desarrolla las cuatro habilidades: comprension auditiva, expresion oral, comprension lectora y expresion escrita.",
    highlights: ["4 habilidades del idioma", "Metodologia Macmillan", "Niveles A1 a C1", "Grupos reducidos"],
  },
  {
    title: "Nivel Secundaria",
    badge: "Adolescentes",
    icon: Users,
    accentFrom: "from-[#059669]",
    accentTo: "to-mint",
    badgeBg: "bg-mint/20 text-accent-foreground",
    image: "/images/course-secondary.jpg",
    description:
      "Disenado para estudiantes de secundaria, alineado con estandares SEP. Desarrolla competencias comunicativas mientras refuerza la formacion academica.",
    highlights: ["Alineado con la SEP", "Preparacion para certificaciones", "Enfoque comunicativo", "Actividades dinamicas"],
  },
  {
    title: "Nivel Primaria",
    badge: "Ninos",
    icon: BookOpen,
    accentFrom: "from-amber-500",
    accentTo: "to-yellow-soft",
    badgeBg: "bg-yellow-soft text-amber-700",
    image: "/images/course-primary.jpg",
    description:
      "Combina aprendizaje y diversion con actividades interactivas, juegos, canciones y material visual. Los ninos aprenden ingles de forma natural y con confianza.",
    highlights: ["Aprendizaje ludico", "Canciones y juegos", "Material visual", "Confianza en el idioma"],
  },
  {
    title: "Nivel Preescolar",
    badge: "Primera Infancia",
    icon: Baby,
    accentFrom: "from-sea-blue-light",
    accentTo: "to-sea-blue",
    badgeBg: "bg-sea-blue-light/20 text-sea-dark",
    image: "/images/course-preschool.jpg",
    description:
      "Introducimos a los mas pequenos al idioma ingles a traves de cuentos, musica y juegos. En esta etapa crucial, los ninos adquieren idiomas de forma natural.",
    highlights: ["Cuentos y musica", "Juegos interactivos", "Adquisicion natural", "Ambiente seguro"],
  },
  {
    title: "Curso Empresarial",
    badge: "Corporativo",
    icon: Briefcase,
    accentFrom: "from-sea-dark",
    accentTo: "to-sea-blue",
    badgeBg: "bg-sea-dark/10 text-sea-dark",
    image: "/images/course-business.jpg",
    description:
      "Programas para empresas que buscan capacitar a su personal. Enfocado en ingles de negocios, presentaciones, negociaciones y comunicacion corporativa.",
    highlights: ["Ingles de negocios", "Presentaciones", "Negociaciones", "A medida de su empresa"],
  },
]

export default function CursosPage() {
  return (
    <>
      {/* Hero - Light themed centered */}
      <SubpageHero
        badge="Metodología Macmillan"
        badgeIcon={Sparkles}
        title="Un curso para cada"
        titleHighlight="etapa de tu vida."
        subtitle="Desde preescolar hasta nivel empresarial, todos nuestros programas combinan la metodología Macmillan Education con docentes certificados y tecnología de punta."
      >
        {/* Course pills row */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {courses.map((course) => (
            <a
              key={course.title}
              href="#cursos"
              className="group flex items-center gap-2.5 rounded-full border border-slate-200 bg-white px-5 py-2.5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
            >
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${course.accentFrom} ${course.accentTo}`}>
                <course.icon className="h-4 w-4 text-white" />
              </div>
              <span className="text-xs font-semibold text-[#1a2b4a]">{course.title}</span>
            </a>
          ))}
        </div>
      </SubpageHero>

      {/* Course Cards - alternating layout */}
      <section id="cursos" className="bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-col gap-20">
            {courses.map((course, i) => {
              const isReversed = i % 2 !== 0
              return (
                <article
                  key={course.title}
                  className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-16 ${isReversed ? "lg:[direction:rtl]" : ""}`}
                >
                  {/* Image side */}
                  <div className={`relative ${isReversed ? "lg:[direction:ltr]" : ""}`}>
                    <div className={`absolute -inset-3 rounded-3xl bg-gradient-to-br ${course.accentFrom} ${course.accentTo} opacity-10 blur-xl`} />
                    <div className="relative overflow-hidden rounded-2xl shadow-xl">
                      <Image
                        src={course.image}
                        alt={`Curso de ingles - ${course.title}`}
                        width={600}
                        height={400}
                        className="h-[320px] w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      <span className={`absolute bottom-4 left-4 rounded-lg px-3 py-1.5 text-xs font-bold ${course.badgeBg} backdrop-blur-sm`}>
                        {course.badge}
                      </span>
                    </div>
                  </div>

                  {/* Content side */}
                  <div className={`flex flex-col gap-5 ${isReversed ? "lg:[direction:ltr]" : ""}`}>
                    <div className="flex items-center gap-3">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${course.accentFrom} ${course.accentTo} shadow-lg`}>
                        <course.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-extrabold text-heading lg:text-3xl">{course.title}</h3>
                    </div>

                    <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                      {course.description}
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                      {course.highlights.map((item) => (
                        <div key={item} className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5">
                          <div className={`h-2 w-2 rounded-full bg-gradient-to-br ${course.accentFrom} ${course.accentTo}`} />
                          <span className="text-xs font-medium text-foreground">{item}</span>
                        </div>
                      ))}
                    </div>

                    <a
                      href="https://wa.me/523213875702"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 flex w-fit items-center gap-2 rounded-xl bg-sea-blue px-6 py-3 text-sm font-bold text-white shadow-lg shadow-sea-blue/20 transition-all hover:-translate-y-0.5 hover:bg-sea-blue-light"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Solicitar informacion
                    </a>
                  </div>
                </article>
              )
            })}
          </div>

          {/* CTA */}
          <div className="mt-24 rounded-3xl bg-[#0c1b3a] p-10 text-center lg:p-16">
            <div className="pointer-events-none absolute -left-20 h-40 w-40 rounded-full bg-sea-blue/10 blur-[80px]" />
            <h2 className="text-pretty text-2xl font-extrabold text-white md:text-3xl">
              No encuentras lo que buscas?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-slate-300">
              Contactanos para una asesoria personalizada. Te ayudamos a elegir el curso perfecto para ti.
            </p>
            <Link
              href="/contacto"
              className="mt-8 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-8 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/10"
            >
              Contactar un asesor
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
