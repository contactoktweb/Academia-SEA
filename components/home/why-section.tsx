import { BookOpen, Award, Users, Globe, Star } from "lucide-react"

const features = [
  {
    icon: BookOpen,
    title: "Metodologia Macmillan",
    description:
      "Utilizamos la reconocida metodologia Macmillan Education para garantizar un aprendizaje efectivo y estructurado.",
    accent: "bg-sea-blue/10 text-sea-blue",
  },
  {
    icon: Award,
    title: "Certificaciones SEP",
    description:
      "Programas avalados por la Secretaria de Educacion Publica con validez oficial en todo Mexico.",
    accent: "bg-mint/40 text-accent-foreground",
  },
  {
    icon: Users,
    title: "Docentes Certificados",
    description:
      "Nuestro equipo de profesores cuenta con certificaciones internacionales y anos de experiencia en la ensenanza.",
    accent: "bg-yellow-soft text-amber-700",
  },
  {
    icon: Globe,
    title: "Red Educativa Internacional",
    description:
      "Formamos parte de una red educativa que nos conecta con estandares internacionales de ensenanza del idioma ingles.",
    accent: "bg-sea-blue-light/20 text-sea-dark",
  },
  {
    icon: Star,
    title: "15+ Anos de Experiencia",
    description:
      "Desde 2008 hemos formado miles de estudiantes exitosos en el dominio del idioma ingles en la region de Jalisco.",
    accent: "bg-sea-blue/10 text-sea-blue",
  },
]

export function WhySection() {
  return (
    <section className="bg-card py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-sea-blue">
            Nuestras ventajas
          </p>
          <h2 className="text-pretty text-3xl font-bold text-heading md:text-4xl">
            Por que aprender en Academia SEA
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Descubre todo lo que nos hace el centro de ensenanza de ingles lider en Jalisco.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group flex flex-col gap-4 rounded-2xl border border-border bg-background p-8 transition-all hover:shadow-lg"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${feature.accent}`}
              >
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-heading">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
