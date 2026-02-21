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
      {/* Hero - Gradient with floating course icons */}
      <section className="relative overflow-hidden bg-[#0c1b3a]">
        {/* Blobs */}
        <div className="pointer-events-none absolute top-0 -left-32 h-[400px] w-[400px] rounded-full bg-sea-blue/15 blur-[140px]" />
        <div className="pointer-events-none absolute -bottom-20 right-0 h-[350px] w-[350px] rounded-full bg-mint/12 blur-[120px]" />
        <div className="pointer-events-none absolute top-10 right-1/3 h-48 w-48 rounded-full bg-yellow-soft/10 blur-[80px]" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 lg:px-8 lg:py-32">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            {/* Text */}
            <div className="flex flex-col gap-6">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-sea-blue-light/20 bg-sea-blue/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-sea-blue-light">
                <Sparkles className="h-3.5 w-3.5" />
                Oferta Educativa
              </span>
              <h1 className="text-pretty text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
                Un curso para{" "}
                <span className="bg-gradient-to-r from-sea-blue-light to-mint bg-clip-text text-transparent">
                  cada etapa
                </span>
                <br />
                de tu vida
              </h1>
              <p className="max-w-lg text-base leading-relaxed text-slate-300 md:text-lg">
                Desde preescolar hasta nivel empresarial, todos nuestros cursos utilizan la
                metodologia Macmillan Education con docentes certificados.
              </p>
              <a
                href="#cursos"
                className="group flex w-fit items-center gap-2 rounded-xl bg-sea-blue px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-sea-blue/25 transition-all hover:-translate-y-0.5 hover:bg-sea-blue-light"
              >
                Ver todos los cursos
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>

            {/* Floating icon grid */}
            <div className="hidden lg:block">
              <div className="relative mx-auto w-full max-w-sm">
                <div className="grid grid-cols-3 gap-4">
                  {courses.map((course, i) => (
                    <div
                      key={course.title}
                      className={`flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-all hover:-translate-y-1 hover:bg-white/10 ${i === 0 ? "col-span-2 flex-row justify-center gap-4" : ""} ${i === courses.length - 1 ? "col-span-2 flex-row justify-center gap-4" : ""}`}
                    >
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${course.accentFrom} ${course.accentTo}`}>
                        <course.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className={`${i === 0 || i === courses.length - 1 ? "" : "text-center"}`}>
                        <p className="text-xs font-bold text-white">{course.title}</p>
                        <p className="text-[10px] text-slate-400">{course.badge}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
