import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { MessageCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Nuestros Cursos",
  description:
    "Descubre los cursos de ingles de Academia SEA para jovenes, adultos, secundaria, primaria, preescolar y empresas. Todos los niveles disponibles.",
  openGraph: {
    title: "Nuestros Cursos | Academia SEA",
    description:
      "Cursos de ingles para todas las edades y niveles en Jalisco.",
  },
}

const courses = [
  {
    title: "Jovenes y Adultos",
    badge: "Basico a Avanzado",
    badgeColor: "bg-sea-blue text-primary-foreground",
    image: "/images/course-adults.jpg",
    description:
      "Nuestro programa para jovenes y adultos esta disenado para llevar al alumno desde un nivel basico hasta un nivel avanzado de dominio del idioma ingles. Utilizamos la metodologia Macmillan Education con un enfoque comunicativo que desarrolla las cuatro habilidades del idioma: comprension auditiva, expresion oral, comprension lectora y expresion escrita.",
  },
  {
    title: "Nivel Secundaria",
    badge: "Adolescentes",
    badgeColor: "bg-mint text-accent-foreground",
    image: "/images/course-secondary.jpg",
    description:
      "Programa especialmente disenado para estudiantes de nivel secundaria, alineado con los estandares educativos de la SEP. Los alumnos desarrollan competencias comunicativas en ingles mientras refuerzan su formacion academica, preparandolos para certificaciones y estudios superiores.",
  },
  {
    title: "Nivel Primaria",
    badge: "Ninos",
    badgeColor: "bg-yellow-soft text-amber-700",
    image: "/images/course-primary.jpg",
    description:
      "Nuestro curso para ninos de primaria combina aprendizaje y diversion con actividades interactivas, juegos, canciones y material visual que captan la atencion de los mas jovenes. Los ninos aprenden ingles de forma natural mientras desarrollan confianza en el uso del idioma.",
  },
  {
    title: "Nivel Preescolar",
    badge: "Primera Infancia",
    badgeColor: "bg-sea-blue-light/30 text-sea-dark",
    image: "/images/course-preschool.jpg",
    description:
      "Introducimos a los mas pequenos al idioma ingles a traves de actividades ludicas, cuentos, musica y juegos. En esta etapa crucial del desarrollo, los ninos tienen una capacidad extraordinaria para adquirir nuevos idiomas de forma natural y sin esfuerzo.",
  },
  {
    title: "Curso Empresarial",
    badge: "Corporativo",
    badgeColor: "bg-sea-dark text-primary-foreground",
    image: "/images/course-business.jpg",
    description:
      "Programas disenados para empresas que buscan capacitar a su personal en el idioma ingles. Enfocado en ingles de negocios, presentaciones, negociaciones y comunicacion corporativa internacional.",
    highlights: [
      "Expansion de operaciones a mercados internacionales",
      "Mejora en las ventas y negociaciones en el extranjero",
      "Comunicacion efectiva con clientes y socios internacionales",
      "Acceso a informacion y recursos globales en ingles",
    ],
  },
]

export default function CursosPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-background py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-sea-blue">
              Oferta Educativa
            </p>
            <h1 className="text-pretty text-4xl font-extrabold text-heading md:text-5xl">
              Nuestros Cursos
            </h1>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
              Tenemos el programa perfecto para cada etapa de tu vida. Desde preescolar hasta
              nivel empresarial, todos nuestros cursos utilizan la metodologia Macmillan Education.
            </p>
          </div>
        </div>
      </section>

      {/* Course Grid */}
      <section className="bg-card py-12 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <article
                key={course.title}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-sm transition-all hover:shadow-lg"
              >
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={course.image}
                    alt={`Curso de ingles - ${course.title}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <span
                    className={`absolute top-4 left-4 rounded-lg px-3 py-1 text-xs font-bold ${course.badgeColor}`}
                  >
                    {course.badge}
                  </span>
                </div>

                <div className="flex flex-1 flex-col gap-4 p-6">
                  <h3 className="text-lg font-bold text-heading">{course.title}</h3>
                  <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                    {course.description}
                  </p>

                  {course.highlights && (
                    <ul className="flex flex-col gap-2 rounded-xl bg-secondary p-4">
                      {course.highlights.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-xs text-foreground"
                        >
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-sea-blue" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}

                  <a
                    href="https://wa.me/523213875702"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto flex items-center justify-center gap-2 rounded-xl bg-sea-blue px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-sea-blue-light"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Mas informacion
                  </a>
                </div>
              </article>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <p className="text-base text-muted-foreground">
              No encuentras lo que buscas? Contactanos para una asesoria personalizada.
            </p>
            <Link
              href="/contacto"
              className="mt-4 inline-flex rounded-xl border border-sea-blue px-6 py-3 text-sm font-semibold text-sea-blue transition-all hover:bg-sea-blue hover:text-primary-foreground"
            >
              Contactar un asesor
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
