import type { Metadata } from "next"
import { Globe, Flag, ShieldCheck, CheckCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Certificaciones",
  description:
    "Conoce las certificaciones internacionales y nacionales que ofrece Academia SEA: TOEFL, TOEIC, CENNI y ELeT.",
  openGraph: {
    title: "Certificaciones | Academia SEA",
    description:
      "Certificaciones internacionales TOEFL, TOEIC y nacionales CENNI, ELeT en Academia SEA.",
  },
}

const internacionales = [
  {
    title: "TOEFL ITP",
    description:
      "El TOEFL ITP (Institutional Testing Program) es un examen que mide la competencia en ingles academico. Es ampliamente aceptado por universidades e instituciones educativas para admision y colocacion de nivel.",
    features: [
      "Comprension auditiva (Listening Comprehension)",
      "Estructura y expresion escrita (Structure and Written Expression)",
      "Comprension de lectura (Reading Comprehension)",
      "Puntuacion de 310 a 677",
    ],
  },
  {
    title: "TOEFL Primary",
    description:
      "Disenado para ninos de 8 anos en adelante, evalua las habilidades de comprension auditiva y lectora en un formato amigable y accesible para los mas jovenes.",
    features: [
      "Disenado para ninos a partir de 8 anos",
      "Evalua comprension auditiva y lectora",
      "Formato interactivo y amigable",
      "Reconocido internacionalmente",
    ],
  },
  {
    title: "TOEFL Junior",
    description:
      "Orientado a estudiantes de 11 anos en adelante, este examen evalua las habilidades de comprension auditiva, forma y significado del lenguaje, y comprension de lectura.",
    features: [
      "Para estudiantes de 11+ anos",
      "Comprension auditiva",
      "Forma y significado del lenguaje",
      "Comprension de lectura",
    ],
  },
  {
    title: "TOEIC Listening & Reading",
    description:
      "El TOEIC (Test of English for International Communication) Listening & Reading mide la capacidad de comprension del ingles en un contexto laboral internacional.",
    features: [
      "Comprension auditiva (Listening)",
      "Comprension de lectura (Reading)",
      "Enfoque en comunicacion laboral",
      "Puntuacion de 10 a 990",
    ],
  },
  {
    title: "TOEIC Speaking & Writing",
    description:
      "Complementa el TOEIC L&R evaluando las habilidades productivas del idioma: expresion oral y escrita en contextos profesionales.",
    features: [
      "Expresion oral (Speaking)",
      "Expresion escrita (Writing)",
      "Contexto profesional y de negocios",
      "Evaluacion integral de produccion",
    ],
  },
]

const nacionales = [
  {
    title: "Certificacion CENNI",
    description:
      "La Certificacion Nacional de Nivel de Idioma (CENNI) es otorgada por la Secretaria de Educacion Publica (SEP) y certifica el nivel de dominio de un idioma extranjero con base en el Marco Comun Europeo de Referencia para las Lenguas.",
    features: [
      "Otorgada por la SEP",
      "Basada en el Marco Comun Europeo de Referencia (MCER)",
      "Niveles A1 hasta C2",
      "Validez oficial en Mexico",
      "Requisito para docentes de idiomas",
      "Util para procesos de titulacion universitaria",
    ],
  },
  {
    title: "Examen ELeT",
    description:
      "El examen ELeT (English Language Test) es una evaluacion disenada para medir el nivel de competencia en el idioma ingles, con aplicacion en contextos academicos y profesionales en Mexico.",
    features: [
      "Evaluacion integral de las 4 habilidades",
      "Aplicable en contextos academicos y profesionales",
      "Resultados alineados con estandares internacionales",
      "Proceso de evaluacion estandarizado",
      "Aceptado por instituciones educativas en Mexico",
    ],
  },
]

export default function CertificacionesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-background py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-sea-blue">
              Avala tu nivel
            </p>
            <h1 className="text-pretty text-4xl font-extrabold text-heading md:text-5xl">
              Certificaciones
            </h1>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
              En Academia SEA te preparamos y aplicamos examenes reconocidos a nivel internacional
              y nacional para que certifiques tu dominio del idioma ingles.
            </p>
          </div>
        </div>
      </section>

      {/* Certificaciones Internacionales */}
      <section className="bg-card py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-12 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sea-blue/10">
              <Globe className="h-6 w-6 text-sea-blue" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-heading md:text-3xl">
                Certificaciones Internacionales
              </h2>
              <p className="text-sm text-muted-foreground">TOEFL y TOEIC</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {internacionales.map((cert) => (
              <div
                key={cert.title}
                className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-6 transition-all hover:shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-6 w-6 text-sea-blue" />
                  <h3 className="text-lg font-bold text-heading">{cert.title}</h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {cert.description}
                </p>
                <ul className="flex flex-col gap-2 rounded-xl bg-secondary p-4">
                  {cert.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-xs text-foreground">
                      <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sea-blue" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certificaciones Nacionales */}
      <section className="bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-12 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-mint/40">
              <Flag className="h-6 w-6 text-accent-foreground" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-heading md:text-3xl">
                Certificaciones Nacionales
              </h2>
              <p className="text-sm text-muted-foreground">CENNI y ELeT</p>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {nacionales.map((cert) => (
              <div
                key={cert.title}
                className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-8 transition-all hover:shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-6 w-6 text-accent-foreground" />
                  <h3 className="text-xl font-bold text-heading">{cert.title}</h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {cert.description}
                </p>
                <ul className="flex flex-col gap-2">
                  {cert.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-foreground">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent-foreground" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
