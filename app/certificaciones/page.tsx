import type { Metadata } from "next"
import Link from "next/link"
import { Globe, Flag, ShieldCheck, CheckCircle, Award, ArrowRight, Sparkles, FileCheck, Star } from "lucide-react"
import { SubpageHero } from "@/components/subpage-hero"

export const metadata: Metadata = {
  title: "Certificaciones",
  description:
    "Conoce las certificaciones internacionales y nacionales que ofrece Academia SEA: TOEFL, TOEIC, CENNI y ELeT.",
  openGraph: {
    title: "Certificaciones | Academia SEA",
    description: "Certificaciones internacionales TOEFL, TOEIC y nacionales CENNI, ELeT en Academia SEA.",
  },
}

const internacionales = [
  {
    title: "TOEFL ITP",
    description:
      "Mide la competencia en ingles academico. Ampliamente aceptado por universidades e instituciones educativas.",
    features: ["Comprension auditiva", "Estructura y expresion escrita", "Comprension de lectura", "Puntuacion de 310 a 677"],
    accent: "from-sea-blue to-sea-blue-light",
    tag: "Academico",
  },
  {
    title: "TOEFL Primary",
    description: "Para ninos de 8 anos en adelante. Evalua comprension auditiva y lectora en formato amigable.",
    features: ["Ninos a partir de 8 anos", "Comprension auditiva y lectora", "Formato interactivo", "Reconocido internacionalmente"],
    accent: "from-amber-500 to-yellow-soft",
    tag: "Ninos 8+",
  },
  {
    title: "TOEFL Junior",
    description: "Para estudiantes de 11+ anos. Evalua comprension auditiva, lenguaje y lectura.",
    features: ["Estudiantes de 11+ anos", "Comprension auditiva", "Forma y significado", "Comprension de lectura"],
    accent: "from-[#059669] to-mint",
    tag: "Jovenes 11+",
  },
  {
    title: "TOEIC L&R",
    description: "Mide la capacidad de comprension del ingles en contexto laboral internacional.",
    features: ["Comprension auditiva", "Comprension de lectura", "Enfoque laboral", "Puntuacion de 10 a 990"],
    accent: "from-sea-dark to-sea-blue",
    tag: "Profesional",
  },
  {
    title: "TOEIC S&W",
    description: "Evalua habilidades productivas: expresion oral y escrita en contextos profesionales.",
    features: ["Expresion oral", "Expresion escrita", "Contexto profesional", "Evaluacion integral"],
    accent: "from-sea-blue to-sea-blue-light",
    tag: "Profesional",
  },
]

const nacionales = [
  {
    title: "Certificacion CENNI",
    icon: Flag,
    description:
      "Otorgada por la SEP, certifica el nivel de dominio de un idioma extranjero con base en el Marco Comun Europeo de Referencia para las Lenguas.",
    features: [
      "Otorgada por la SEP",
      "Basada en el MCER",
      "Niveles A1 hasta C2",
      "Validez oficial en Mexico",
      "Requisito para docentes de idiomas",
      "Util para titulacion universitaria",
    ],
  },
  {
    title: "Examen ELeT",
    icon: FileCheck,
    description:
      "Evaluacion disenada para medir el nivel de competencia en ingles, con aplicacion en contextos academicos y profesionales en Mexico.",
    features: [
      "Evaluacion integral de 4 habilidades",
      "Contextos academicos y profesionales",
      "Estandares internacionales",
      "Evaluacion estandarizada",
      "Aceptado por instituciones en Mexico",
    ],
  },
]

export default function CertificacionesPage() {
  return (
    <>
      {/* Hero - Light themed centered */}
      <SubpageHero
        badge="Centro Aplicador Autorizado"
        badgeIcon={Award}
        title="Certifica tu inglés con"
        titleHighlight="validez oficial."
        subtitle="Somos centro aplicador autorizado de exámenes TOEFL y TOEIC. Te preparamos y certificamos con reconocimiento internacional y nacional."
      >
        {/* Cert badges */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {[
            { label: "TOEFL", sub: "Internacional" },
            { label: "TOEIC", sub: "Internacional" },
            { label: "CENNI", sub: "Nacional (SEP)" },
            { label: "ELeT", sub: "Nacional" },
          ].map((tag) => (
            <div key={tag.label} className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white px-6 py-3.5 shadow-sm">
              <span className="text-sm font-extrabold text-[#1a2b4a]">{tag.label}</span>
              <span className="text-[10px] font-medium text-slate-400">{tag.sub}</span>
            </div>
          ))}
        </div>
      </SubpageHero>

      {/* Internacionales */}
      <section className="bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto mb-16 flex max-w-2xl flex-col items-center gap-4 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-sea-blue/20 bg-sea-blue/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-sea-blue">
              <Globe className="h-3.5 w-3.5" />
              Internacionales
            </span>
            <h2 className="text-pretty text-3xl font-extrabold text-heading md:text-4xl">
              Certificaciones TOEFL y TOEIC
            </h2>
            <p className="max-w-lg text-base leading-relaxed text-muted-foreground">
              Examenes reconocidos mundialmente para certificar tu nivel de ingles en contextos academicos y profesionales.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {internacionales.map((cert, i) => (
              <div
                key={cert.title}
                className={`group relative overflow-hidden rounded-2xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:shadow-xl ${i === 0 ? "md:col-span-2 lg:col-span-1" : ""}`}
              >
                {/* Top accent bar */}
                <div className={`absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r ${cert.accent}`} />

                {/* Tag */}
                <span className="mb-4 inline-block rounded-lg bg-secondary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {cert.tag}
                </span>

                <div className="flex items-center gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${cert.accent} shadow-lg`}>
                    <ShieldCheck className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-extrabold text-heading">{cert.title}</h3>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {cert.description}
                </p>

                <div className="mt-5 flex flex-col gap-2 rounded-xl border border-border bg-background p-4">
                  {cert.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sea-blue" />
                      <span className="text-xs text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Bg number */}
                <span className="pointer-events-none absolute -right-2 -bottom-4 text-[80px] font-black leading-none text-foreground/[0.02] group-hover:text-sea-blue/[0.04]">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nacionales */}
      <section className="bg-card py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto mb-16 flex max-w-2xl flex-col items-center gap-4 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-mint/30 bg-mint/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
              <Flag className="h-3.5 w-3.5" />
              Nacionales
            </span>
            <h2 className="text-pretty text-3xl font-extrabold text-heading md:text-4xl">
              Certificaciones CENNI y ELeT
            </h2>
            <p className="max-w-lg text-base leading-relaxed text-muted-foreground">
              Certificaciones con validez oficial en Mexico otorgadas por la SEP y organismos nacionales.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {nacionales.map((cert) => (
              <div
                key={cert.title}
                className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-mint/30 to-[#059669]/10 p-px shadow-xl"
              >
                <div className="h-full rounded-3xl bg-background p-8 lg:p-10">
                  <div className="pointer-events-none absolute -top-16 -right-16 h-32 w-32 rounded-full bg-mint/5 blur-2xl group-hover:bg-mint/10" />

                  <div className="relative">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-mint to-[#059669] shadow-lg shadow-mint/20">
                      <cert.icon className="h-8 w-8 text-white" />
                    </div>

                    <h3 className="text-2xl font-extrabold text-heading">{cert.title}</h3>

                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                      {cert.description}
                    </p>

                    <div className="mt-6 grid gap-2 sm:grid-cols-2">
                      {cert.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2 rounded-xl bg-mint/10 px-3 py-2.5">
                          <CheckCircle className="h-3.5 w-3.5 shrink-0 text-accent-foreground" />
                          <span className="text-xs font-medium text-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-20 rounded-3xl bg-[#0c1b3a] p-10 text-center lg:p-16">
            <Sparkles className="mx-auto mb-4 h-8 w-8 text-yellow-soft" />
            <h2 className="text-pretty text-2xl font-extrabold text-white md:text-3xl">
              Certifica tu nivel de ingles hoy
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-slate-300">
              Contactanos para conocer las proximas fechas de aplicacion y prepararte con nuestros cursos especializados.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="https://wa.me/523213875702"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl bg-sea-blue px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-sea-blue/25 transition-all hover:-translate-y-0.5 hover:bg-sea-blue-light"
              >
                Solicitar informacion
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href="/cursos"
                className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-8 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/10"
              >
                Ver cursos de preparacion
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
