import Image from "next/image"
import Link from "next/link"
import { MessageCircle } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background py-16 lg:py-24">
      {/* Abstract decorative shapes */}
      <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-sea-blue/5" />
      <div className="pointer-events-none absolute bottom-10 -left-16 h-56 w-56 rounded-full bg-mint/30" />
      <div className="pointer-events-none absolute top-1/2 right-1/4 h-4 w-4 rounded-full bg-yellow-soft" />
      <div className="pointer-events-none absolute top-20 left-1/3 h-3 w-3 rounded-full bg-sea-blue-light/40" />

      {/* Zigzag decoration */}
      <svg className="pointer-events-none absolute top-16 right-12 opacity-10" width="120" height="40" viewBox="0 0 120 40" aria-hidden="true">
        <path d="M0 20 L15 5 L30 20 L45 5 L60 20 L75 5 L90 20 L105 5 L120 20" fill="none" stroke="#3B82F6" strokeWidth="2" />
      </svg>

      <div className="mx-auto flex max-w-7xl flex-col-reverse items-center gap-12 px-4 lg:flex-row lg:gap-16 lg:px-8">
        {/* Text content */}
        <div className="flex max-w-xl flex-col gap-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 self-center rounded-full bg-mint/40 px-4 py-1.5 text-xs font-semibold text-accent-foreground lg:self-start">
            <span className="h-2 w-2 rounded-full bg-accent-foreground" />
            15+ anos de experiencia
          </div>

          <h1 className="text-pretty text-4xl font-extrabold leading-tight text-heading md:text-5xl lg:text-6xl">
            Aprende ingles con los{" "}
            <span className="text-sea-blue">lideres en Jalisco</span>
          </h1>

          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
            Somos un centro de aprendizaje lider en Jalisco en la ensenanza del idioma ingles con experiencia de mas de 15 anos. Metodologia de primer nivel, docentes certificados y certificaciones internacionales.
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row lg:items-start">
            <a
              href="https://wa.me/523213875702"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl bg-sea-blue px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-sea-blue-light hover:shadow-lg"
            >
              <MessageCircle className="h-5 w-5" />
              WhatsApp
            </a>
            <Link
              href="/cursos"
              className="rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              Ver Cursos
            </Link>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative w-full max-w-lg lg:max-w-xl">
          <div className="relative overflow-hidden rounded-2xl shadow-2xl">
            <Image
              src="/images/hero-students.jpg"
              alt="Estudiantes aprendiendo ingles en Academia SEA"
              width={640}
              height={480}
              className="h-auto w-full object-cover"
              priority
            />
          </div>

          {/* Floating badges */}
          <div className="absolute -bottom-4 -left-4 rounded-xl bg-card px-4 py-3 shadow-lg md:-bottom-6 md:-left-6">
            <p className="text-xs font-semibold text-muted-foreground">Certificacion</p>
            <p className="text-sm font-bold text-heading">SEP Avalada</p>
          </div>
          <div className="absolute -top-4 -right-4 rounded-xl bg-sea-blue px-4 py-3 shadow-lg md:-top-6 md:-right-6">
            <p className="text-xs font-semibold text-primary-foreground/80">Experiencia</p>
            <p className="text-sm font-bold text-primary-foreground">15+ Anos</p>
          </div>
          <div className="absolute bottom-8 -right-3 rounded-xl bg-mint px-4 py-2 shadow-lg md:-right-5">
            <p className="text-xs font-bold text-accent-foreground">Macmillan</p>
          </div>
        </div>
      </div>
    </section>
  )
}
