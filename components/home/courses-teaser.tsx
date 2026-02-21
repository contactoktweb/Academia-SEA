import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function CoursesTeaser() {
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl shadow-xl">
            <Image
              src="/images/courses-preview.jpg"
              alt="Estudiantes en cursos de ingles"
              width={560}
              height={400}
              className="h-auto w-full object-cover"
            />
            <div className="absolute bottom-4 left-4 rounded-xl bg-sea-blue px-4 py-2 shadow-lg">
              <p className="text-xs font-bold text-primary-foreground">Todos los niveles</p>
            </div>
          </div>

          <div className="flex max-w-xl flex-col gap-5">
            <p className="text-sm font-semibold uppercase tracking-wider text-sea-blue">
              Nuestros cursos
            </p>
            <h2 className="text-pretty text-3xl font-bold text-heading md:text-4xl">
              Cursos de ingles para todas las edades
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              Desde preescolar hasta nivel empresarial, tenemos el programa perfecto para ti.
              Nuestros cursos estan disenados para cada etapa de la vida, con grupos reducidos y
              atencion personalizada.
            </p>
            <ul className="flex flex-col gap-2">
              {[
                "Jovenes y Adultos (Basico a Avanzado)",
                "Secundaria y Primaria",
                "Preescolar",
                "Curso Empresarial",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-sea-blue" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/cursos"
              className="mt-2 inline-flex items-center gap-2 self-start rounded-xl bg-sea-blue px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-sea-blue-light hover:shadow-lg"
            >
              Ver todos los cursos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
