import type { Metadata } from "next"
import {
  Phone,
  MapPin,
  MessageCircle,
  Facebook,
  FileText,
  Calendar,
  ClipboardList,
  CheckCircle,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Contacto e Inscripciones",
  description:
    "Inscribete en Academia SEA. Encuentra nuestras ubicaciones en El Grullo, Autlan y Union de Tula, Jalisco. Calendario y requisitos de inscripcion.",
  openGraph: {
    title: "Contacto e Inscripciones | Academia SEA",
    description:
      "Contacta a Academia SEA para inscripciones, informacion de cursos y certificaciones.",
  },
}

const locations = [
  {
    name: "El Grullo",
    phone: "321 387 57 02",
    whatsapp: "523213875702",
    color: "bg-sea-blue",
  },
  {
    name: "Autlan",
    phone: "317 382 30 60",
    whatsapp: "523173823060",
    color: "bg-mint",
  },
  {
    name: "Union de Tula",
    phone: "316 688 08 19",
    whatsapp: "523166880819",
    color: "bg-yellow-soft",
  },
]

export default function ContactoPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-background py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-sea-blue">
              Contacto
            </p>
            <h1 className="text-pretty text-4xl font-extrabold text-heading md:text-5xl">
              Inscripciones y Contacto
            </h1>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
              Estamos listos para ayudarte a comenzar tu camino en el dominio del idioma ingles.
              Encuentra toda la informacion para inscribirte.
            </p>
          </div>
        </div>
      </section>

      {/* Proceso de Inscripcion */}
      <section className="bg-card py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="mb-10 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sea-blue/10">
                <ClipboardList className="h-6 w-6 text-sea-blue" />
              </div>
              <h2 className="text-2xl font-bold text-heading md:text-3xl">
                Proceso de Inscripcion
              </h2>
            </div>

            <div className="flex flex-col gap-6">
              {[
                {
                  step: "1",
                  title: "Contactanos",
                  desc: "Comunicate a la sucursal de tu preferencia por telefono o WhatsApp para recibir informacion sobre horarios y costos.",
                },
                {
                  step: "2",
                  title: "Examen de colocacion",
                  desc: "Realizamos una evaluacion para ubicar tu nivel actual y asignarte al grupo adecuado.",
                },
                {
                  step: "3",
                  title: "Documentacion",
                  desc: "Presenta los documentos requeridos para formalizar tu inscripcion.",
                },
                {
                  step: "4",
                  title: "Inicia tus clases",
                  desc: "Comienza a aprender ingles con nuestra metodologia Macmillan Education.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="flex gap-4 rounded-2xl border border-border bg-background p-6"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sea-blue text-sm font-bold text-primary-foreground">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-heading">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Requisitos */}
            <div className="mt-10 rounded-2xl border border-border bg-background p-8">
              <h3 className="mb-4 text-lg font-bold text-heading">Requisitos de Inscripcion</h3>
              <ul className="flex flex-col gap-3">
                {[
                  "Identificacion oficial (INE, pasaporte o credencial escolar)",
                  "Comprobante de domicilio reciente",
                  "Fotografia tamano infantil (2 fotos)",
                  "Pago de inscripcion",
                ].map((req) => (
                  <li key={req} className="flex items-start gap-2 text-sm text-foreground">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-sea-blue" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Ubicaciones y Contacto */}
      <section className="bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-heading md:text-3xl">
              Nuestras Ubicaciones
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              Visitanos en cualquiera de nuestras tres sucursales en Jalisco.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {locations.map((loc) => (
              <div
                key={loc.name}
                className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 text-center shadow-sm transition-all hover:shadow-lg"
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-xl ${loc.color}`}
                >
                  <MapPin className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-heading">{loc.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{loc.phone}</span>
                </div>
                <div className="flex w-full flex-col gap-2">
                  <a
                    href={`tel:+${loc.whatsapp}`}
                    className="flex items-center justify-center gap-2 rounded-xl border border-sea-blue px-4 py-2.5 text-sm font-semibold text-sea-blue transition-all hover:bg-sea-blue hover:text-primary-foreground"
                  >
                    <Phone className="h-4 w-4" />
                    Llamar
                  </a>
                  <a
                    href={`https://wa.me/${loc.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-xl bg-sea-blue px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-sea-blue-light"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Facebook */}
          <div className="mt-12 text-center">
            <a
              href="https://www.facebook.com/AcademiaSEA"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-sea-dark px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-sea-blue"
            >
              <Facebook className="h-5 w-5" />
              Siguenos en Facebook
            </a>
          </div>
        </div>
      </section>

      {/* Calendario y Reglamento */}
      <section className="bg-card py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-2xl font-bold text-heading md:text-3xl">
              Calendario y Reglamento
            </h2>
            <p className="mb-8 text-base text-muted-foreground">
              Consulta nuestro calendario escolar y el reglamento de la academia.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="#"
                className="flex items-center gap-2 rounded-xl bg-sea-blue px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-sea-blue-light hover:shadow-lg"
              >
                <Calendar className="h-5 w-5" />
                Calendario Ciclo 2022 A
              </a>
              <a
                href="#"
                className="flex items-center gap-2 rounded-xl border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                <FileText className="h-5 w-5" />
                Reglamento Escolar
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-sea-dark py-20 lg:py-24">
        <div className="mx-auto max-w-2xl px-4 text-center lg:px-8">
          <h2 className="text-pretty text-3xl font-bold text-primary-foreground md:text-4xl">
            Comienza tu camino hoy
          </h2>
          <p className="mt-4 text-base leading-relaxed text-footer-foreground/80">
            No esperes mas para aprender ingles. Inscribete ahora y se parte de la comunidad
            Academia SEA.
          </p>
          <a
            href="https://wa.me/523213875702"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-sea-blue px-8 py-4 text-base font-bold text-primary-foreground transition-all hover:bg-sea-blue-light hover:shadow-lg"
          >
            <MessageCircle className="h-5 w-5" />
            INSCRIBETE AHORA
          </a>
        </div>
      </section>
    </>
  )
}
