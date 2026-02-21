import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { MessageCircle, GraduationCap, Users, Baby, BookOpen, Briefcase, ArrowRight, Sparkles } from "lucide-react"

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
      {/* Hero - Centered with colorful course pills */}
      <section className="relative overflow-hidden bg-[#0c1b3a]">
        {/* Decorative color splashes */}
        <div className="pointer-events-none absolute top-[20%] left-[15%] h-72 w-72 rounded-full bg-sea-blue/20 blur-[120px]" />
        <div className="pointer-events-none absolute top-[30%] right-[15%] h-56 w-56 rounded-full bg-mint/15 blur-[100px]" />
        <div className="pointer-events-none absolute bottom-[20%] left-[40%] h-48 w-48 rounded-full bg-amber-500/10 blur-[90px]" />

        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-4 py-28 text-center lg:py-40">
          <span className="inline-flex items-center gap-2 rounded-full border border-sea-blue-light/20 bg-white/5 px-5 py-2 text-xs font-semibold tracking-widest uppercase text-sea-blue-light backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Metodologia Macmillan
          </span>

          <h1 className="mt-8 text-balance text-4xl font-extrabold leading-[1.1] text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Un curso para cada{" "}
            <span className="bg-gradient-to-r from-sea-blue-light to-mint bg-clip-text text-transparent">etapa de tu vida</span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-slate-300/90 md:text-lg">
            Desde preescolar hasta nivel empresarial, todos nuestros programas combinan la metodologia Macmillan Education con docentes certificados y tecnologia de punta.
          </p>

          {/* Course pills row */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            {courses.map((course) => (
              <a
                key={course.title}
                href="#cursos"
                className="group flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10"
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${course.accentFrom} ${course.accentTo}`}>
                  <course.icon className="h-4 w-4 text-white" />
                </div>
                <span className="text-xs font-semibold text-white">{course.title}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 z-10 w-full">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
            <path d="M0 60V30C360 0 720 10 1080 30C1260 40 1380 45 1440 30V60H0Z" className="fill-background" />
          </svg>
        </div>
      </section>

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
