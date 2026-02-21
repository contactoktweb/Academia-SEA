import { BookOpen, Award, Users, Globe, Star, GraduationCap } from "lucide-react"

const features = [
  {
    icon: BookOpen,
    title: "Metodologia Macmillan",
    description:
      "Utilizamos la reconocida metodologia Macmillan Education para garantizar un aprendizaje efectivo y estructurado.",
    color: "bg-sea-blue",
    iconBg: "bg-sea-blue/10 text-sea-blue",
    span: "lg:col-span-2",
  },
  {
    icon: Award,
    title: "Certificaciones SEP",
    description:
      "Programas avalados por la Secretaria de Educacion Publica con validez oficial en todo Mexico.",
    color: "bg-mint",
    iconBg: "bg-mint/40 text-accent-foreground",
    span: "",
  },
  {
    icon: Users,
    title: "Docentes Certificados",
    description:
      "Nuestro equipo de profesores cuenta con certificaciones internacionales y amplia experiencia en la ensenanza.",
    color: "bg-yellow-soft",
    iconBg: "bg-yellow-soft text-amber-700",
    span: "",
  },
  {
    icon: Globe,
    title: "Red Educativa Internacional",
    description:
      "Formamos parte de una red educativa que nos conecta con estandares internacionales de ensenanza del idioma ingles.",
    color: "bg-sea-blue-light",
    iconBg: "bg-sea-blue-light/20 text-sea-dark",
    span: "",
  },
  {
    icon: Star,
    title: "15+ Anos de Trayectoria",
    description:
      "Desde 2008 hemos formado miles de estudiantes exitosos en el dominio del idioma ingles en la region.",
    color: "bg-sea-dark",
    iconBg: "bg-sea-dark/10 text-sea-dark",
    span: "",
  },
  {
    icon: GraduationCap,
    title: "Todas las Edades",
    description:
      "Desde preescolar hasta adultos y empresas, tenemos el programa perfecto para cada etapa de aprendizaje.",
    color: "bg-sea-blue",
    iconBg: "bg-sea-blue/10 text-sea-blue",
    span: "lg:col-span-2",
  },
]

export function WhySection() {
  return (
    <section className="relative overflow-hidden bg-background py-20 lg:py-28">
      {/* Subtle pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.02]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: "radial-gradient(circle, #1E3A8A 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        {/* Section header */}
        <div className="mx-auto mb-16 flex max-w-2xl flex-col items-center gap-4 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-sea-blue/20 bg-sea-blue/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-sea-blue">
            Nuestras ventajas
          </span>
          <h2 className="text-pretty text-3xl font-extrabold text-heading md:text-4xl lg:text-5xl">
            Por que aprender en{" "}
            <span className="text-sea-blue">Academia SEA</span>
          </h2>
          <p className="max-w-lg text-base leading-relaxed text-muted-foreground">
            Descubre todo lo que nos hace el centro de ensenanza de ingles lider en Jalisco.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:-translate-y-1 hover:shadow-xl ${feature.span}`}
            >
              {/* Top accent bar */}
              <div className={`absolute top-0 left-0 h-1 w-full ${feature.color}`} />

              {/* Decorative corner gradient */}
              <div
                className={`pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full opacity-10 transition-opacity group-hover:opacity-20 ${feature.color}`}
              />

              {/* Content */}
              <div className="relative z-10 flex flex-col gap-4">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${feature.iconBg} transition-transform group-hover:scale-110`}
                >
                  <feature.icon className="h-7 w-7" />
                </div>

                <h3 className="text-lg font-bold text-heading">{feature.title}</h3>

                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>

              {/* Number badge */}
              <span className="absolute right-6 bottom-6 text-6xl font-black text-foreground/[0.03] transition-colors group-hover:text-sea-blue/[0.06]">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
