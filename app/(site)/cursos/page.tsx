import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Sparkles, BookOpen } from "lucide-react"
import { SubpageHero } from "@/components/subpage-hero"
import { WhatsappIcon } from "@/components/whatsapp-icon"
import { client } from "@/sanity/lib/client"
import { COURSES_PAGE_QUERY } from "@/sanity/lib/queries"
import { iconMap } from "@/lib/icons"

export const metadata: Metadata = {
  title: "Nuestros Cursos",
  description:
    "Descubre los cursos de ingles de Academia SEA para jovenes, adultos, secundaria, primaria, preescolar y empresas.",
  openGraph: {
    title: "Nuestros Cursos | Academia SEA",
    description: "Cursos de ingles para todas las edades y niveles en Jalisco.",
  },
  alternates: {
    canonical: '/cursos',
  },
}

export default async function CursosPage() {
  const data = await client.fetch(COURSES_PAGE_QUERY)

  if (!data) return null

  const hero = data.hero
  const courses = (data.cursos || []).map((course: any, i: number) => {
    // Restaurar rutas de imágenes originales si no hay una imagen cargada en Sanity
    const staticImages = [
      "/images/course-preschool.jpg",
      "/images/course-primary.jpg",
      "/images/course-secondary-new.png",
      "/images/course-adults.jpg",
      "/images/course-business.jpg"
    ]
    return {
      ...course,
      imageUrl: course.imageUrl || staticImages[i] || "/images/placeholder.jpg"
    }
  })
  const ctaFinal = data.ctaFinal

  return (
    <>
      <SubpageHero
        badge={hero?.badge || "Metodología Macmillan"}
        badgeIcon={Sparkles}
        title={hero?.titulo || "Un curso para cada"}
        titleHighlight={hero?.tituloResaltado || "etapa de tu vida."}
        subtitle={hero?.subtitulo || "Desde preescolar hasta nivel empresarial..."}
      >
        <div className="flex flex-wrap items-center justify-center gap-4">
          {courses.map((course: any, i: number) => {
            const Icon = iconMap[course.icono] || BookOpen
            const isEven = i % 2 === 0
            const accentFrom = isEven ? "from-sea-dark" : "from-coral"
            const accentTo = isEven ? "to-sea-blue" : "to-coral-light"

            return (
              <a
                key={course._key || i}
                href="#cursos"
                className="group flex items-center gap-3 rounded-full border border-slate-200 bg-white px-6 py-3 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md md:px-7 md:py-3.5"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${isEven ? 'bg-sea-dark' : 'bg-coral'} md:h-11 md:w-11`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-semibold text-[#1a2b4a] md:text-base">{course.titulo}</span>
              </a>
            )
          })}
        </div>
      </SubpageHero>

      <section id="cursos" className="bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
          <div className="flex flex-col gap-20">
            {courses.map((course: any, i: number) => {
              const isReversed = i % 2 !== 0
              const isEven = i % 2 === 0
              const accentFrom = isEven ? "from-sea-dark" : "from-coral"
              const accentTo = isEven ? "to-sea-blue" : "to-coral-light"
              const badgeBg = isEven ? "bg-sea-blue/10" : "bg-coral/10"
              const badgeText = isEven ? "text-sea-blue" : "text-coral"
              const Icon = iconMap[course.icono] || BookOpen

              return (
                <article
                  key={course._key || i}
                  className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-16 ${isReversed ? "lg:[direction:rtl]" : ""}`}
                >
                  <div className={`relative ${isReversed ? "lg:[direction:ltr]" : ""}`}>
                    <div className={`absolute -inset-3 rounded-3xl bg-gradient-to-br ${accentFrom} ${accentTo} opacity-10 blur-xl`} />
                    <div className="relative overflow-hidden rounded-2xl shadow-xl">
                      {course.imageUrl ? (
                        <Image
                          src={course.imageUrl}
                          alt={`Academia SEA - Curso de inglés especializado: ${course.titulo}`}
                          width={600}
                          height={400}
                          className="h-[320px] w-full object-cover"
                        />
                      ) : (
                        <div className="h-[320px] w-full bg-slate-200 flex items-center justify-center">
                          <Icon className="h-20 w-20 text-slate-400" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      <span className={`absolute bottom-4 left-4 rounded-lg px-3 py-1.5 text-xs font-bold ${badgeBg} ${badgeText} backdrop-blur-sm`}>
                        {course.badge}
                      </span>
                    </div>
                  </div>

                  <div className={`flex flex-col gap-5 ${isReversed ? "lg:[direction:ltr]" : ""}`}>
                    <div className="flex items-center gap-3">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${isEven ? 'bg-sea-dark' : 'bg-coral'} shadow-lg`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-extrabold text-heading lg:text-3xl">{course.titulo}</h3>
                    </div>

                    <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                      {course.descripcion}
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                      {course.highlights?.map((item: string) => (
                        <div key={item} className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5">
                          <div className={`h-2 w-2 rounded-full bg-gradient-to-br ${accentFrom} ${accentTo}`} />
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
                      <WhatsappIcon className="h-4 w-4" />
                      Solicitar informacion
                    </a>
                  </div>
                </article>
              )
            })}
          </div>

          <div className="mt-24 rounded-3xl bg-[#0c1b3a] p-10 text-center lg:p-16">
            <h2 className="text-pretty text-2xl font-extrabold text-white md:text-3xl">
              {ctaFinal?.titulo || "No encuentras lo que buscas?"}
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-slate-300">
              {ctaFinal?.descripcion}
            </p>
            <Link
              href="/contacto"
              className="mt-8 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-8 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/10"
            >
              {ctaFinal?.textoBoton || "Contactar un asesor"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
