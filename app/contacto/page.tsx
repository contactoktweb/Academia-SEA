"use client"

import type { Metadata } from "next"
import Link from "next/link"
import {
  Phone,
  MapPin,
  MessageCircle,
  Facebook,
  FileText,
  Calendar,
  ClipboardList,
  CheckCircle,
  ArrowRight,
  Mail,
  Clock,
  Users,
} from "lucide-react"


const locations = [
  {
    name: "El Grullo",
    phone: "321 387 57 02",
    whatsapp: "523213875702",
    accent: "from-sea-blue to-sea-blue-light",
    iconBg: "bg-sea-blue",
    hours: "Lunes a Viernes: 8:00 - 20:00",
  },
  {
    name: "Autlan",
    phone: "317 382 30 60",
    whatsapp: "523173823060",
    accent: "from-[#059669] to-mint",
    iconBg: "bg-[#059669]",
    hours: "Lunes a Viernes: 8:00 - 20:00",
  },
  {
    name: "Union de Tula",
    phone: "316 688 08 19",
    whatsapp: "523166880819",
    accent: "from-amber-500 to-yellow-soft",
    iconBg: "bg-amber-500",
    hours: "Lunes a Viernes: 8:00 - 20:00",
  },
]

const steps = [
  {
    step: "1",
    title: "Contactanos",
    desc: "Comunicate por telefono o WhatsApp para recibir informacion sobre horarios y costos.",
    icon: Phone,
  },
  {
    step: "2",
    title: "Examen de colocacion",
    desc: "Realizamos una evaluacion para ubicar tu nivel actual y asignarte al grupo adecuado.",
    icon: ClipboardList,
  },
  {
    step: "3",
    title: "Documentacion",
    desc: "Presenta los documentos requeridos para formalizar tu inscripcion.",
    icon: FileText,
  },
  {
    step: "4",
    title: "Inicia tus clases",
    desc: "Comienza a aprender ingles con nuestra metodologia Macmillan Education.",
    icon: Users,
  },
]

export default function ContactoPage() {
  const [activeLocation, setActiveLocation] = useState(0)

  return (
    <>
      {/* Hero - Centered with location dots */}
      <section className="relative overflow-hidden bg-[#0c1b3a]">
        {/* Decorative blurs */}
        <div className="pointer-events-none absolute top-[25%] left-[20%] h-64 w-64 rounded-full bg-[#25d366]/15 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-[30%] right-[15%] h-56 w-56 rounded-full bg-sea-blue/15 blur-[100px]" />
        <div className="pointer-events-none absolute top-[60%] left-[55%] h-40 w-40 rounded-full bg-mint/10 blur-[80px]" />

        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-4 py-28 text-center lg:py-40">
          <span className="inline-flex items-center gap-2 rounded-full border border-sea-blue-light/20 bg-white/5 px-5 py-2 text-xs font-semibold tracking-widest uppercase text-sea-blue-light backdrop-blur-sm">
            <MapPin className="h-3.5 w-3.5" />
            3 Sedes en Jalisco
          </span>

          <h1 className="mt-8 text-balance text-4xl font-extrabold leading-[1.1] text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Estamos cerca de ti,{" "}
            <span className="bg-gradient-to-r from-[#25d366] to-mint bg-clip-text text-transparent">inscribete hoy</span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-slate-300/90 md:text-lg">
            Visitanos en cualquiera de nuestras sucursales o contactanos por WhatsApp. Te guiamos paso a paso en tu proceso de inscripcion.
          </p>

          {/* Location pills */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            {locations.map((loc) => (
              <a
                key={loc.name}
                href={`https://wa.me/${loc.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-full border border-white/10 bg-white/5 py-2.5 pr-5 pl-2.5 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10"
              >
                <div className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${loc.accent}`}>
                  <MapPin className="h-4 w-4 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-white">{loc.name}</p>
                  <p className="text-[10px] text-slate-400">{loc.phone}</p>
                </div>
              </a>
            ))}
          </div>

          {/* CTA button */}
          <a
            href="https://wa.me/523213875702"
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-10 flex items-center gap-2 rounded-xl bg-[#25d366] px-8 py-4 text-sm font-bold text-white shadow-lg shadow-[#25d366]/25 transition-all hover:-translate-y-0.5 hover:bg-[#22c55e]"
          >
            <MessageCircle className="h-5 w-5" />
            Contactar por WhatsApp
          </a>
        </div>

        <div className="absolute bottom-0 left-0 z-10 w-full">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
            <path d="M0 60V30C360 0 720 10 1080 30C1260 40 1380 45 1440 30V60H0Z" className="fill-background" />
          </svg>
        </div>
      </section>

      {/* Proceso - visual stepper */}
      <section className="bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto mb-16 flex max-w-2xl flex-col items-center gap-4 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-sea-blue/20 bg-sea-blue/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-sea-blue">
              <ClipboardList className="h-3.5 w-3.5" />
              Paso a paso
            </span>
            <h2 className="text-pretty text-3xl font-extrabold text-heading md:text-4xl">
              Proceso de Inscripcion
            </h2>
          </div>

          {/* Stepper */}
          <div className="relative mx-auto max-w-4xl">
            {/* Connecting line */}
            <div className="absolute top-0 bottom-0 left-8 hidden w-0.5 bg-gradient-to-b from-sea-blue via-mint to-sea-blue-light lg:left-1/2 lg:block lg:-translate-x-px" />

            <div className="flex flex-col gap-8 lg:gap-12">
              {steps.map((item, i) => {
                const isRight = i % 2 !== 0
                return (
                  <div key={item.step} className={`relative flex items-center gap-6 lg:gap-0 ${isRight ? "lg:flex-row-reverse" : ""}`}>
                    {/* Circle */}
                    <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-background bg-gradient-to-br from-sea-blue to-sea-blue-light shadow-lg shadow-sea-blue/20 lg:absolute lg:left-1/2 lg:-translate-x-1/2">
                      <item.icon className="h-7 w-7 text-white" />
                    </div>

                    {/* Card */}
                    <div className={`flex-1 lg:w-[calc(50%-3rem)] ${isRight ? "lg:mr-auto lg:pr-12" : "lg:ml-auto lg:pl-12"}`}>
                      <div className="group rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-xl">
                        <span className="mb-2 inline-block text-xs font-bold text-sea-blue">Paso {item.step}</span>
                        <h3 className="text-lg font-bold text-heading">{item.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Requisitos */}
          <div className="mx-auto mt-16 max-w-2xl">
            <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-sea-blue/10 to-mint/10 p-px">
              <div className="rounded-3xl bg-card p-8 lg:p-10">
                <h3 className="mb-6 text-xl font-extrabold text-heading">Requisitos de Inscripcion</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    "Identificacion oficial (INE, pasaporte o credencial escolar)",
                    "Comprobante de domicilio reciente",
                    "Fotografia tamano infantil (2 fotos)",
                    "Pago de inscripcion",
                  ].map((req) => (
                    <div key={req} className="flex items-start gap-3 rounded-xl bg-background p-4">
                      <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-sea-blue" />
                      <span className="text-sm text-foreground">{req}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ubicaciones */}
      <section className="bg-card py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto mb-16 flex max-w-2xl flex-col items-center gap-4 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-mint/30 bg-mint/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
              <MapPin className="h-3.5 w-3.5" />
              Ubicaciones
            </span>
            <h2 className="text-pretty text-3xl font-extrabold text-heading md:text-4xl">
              Nuestras Sucursales
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {locations.map((loc) => (
              <div
                key={loc.name}
                className="group relative overflow-hidden rounded-3xl bg-gradient-to-br p-px shadow-xl transition-all hover:-translate-y-1"
                style={{
                  backgroundImage: `linear-gradient(to bottom right, var(--${loc.name === "El Grullo" ? "sea-blue" : loc.name === "Autlan" ? "mint" : "yellow-soft"}), transparent)`,
                }}
              >
                <div className="h-full rounded-3xl bg-background p-8">
                  <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${loc.accent} shadow-lg`}>
                    <MapPin className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-heading">{loc.name}</h3>

                  <div className="mt-4 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{loc.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{loc.hours}</span>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-2">
                    <a
                      href={`https://wa.me/${loc.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 rounded-xl bg-[#25d366] px-4 py-3 text-sm font-bold text-white transition-all hover:opacity-90"
                    >
                      <MessageCircle className="h-4 w-4" />
                      WhatsApp
                    </a>
                    <a
                      href={`tel:+${loc.whatsapp}`}
                      className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground transition-all hover:bg-secondary"
                    >
                      <Phone className="h-4 w-4" />
                      Llamar
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Social */}
          <div className="mt-12 flex justify-center">
            <a
              href="https://www.facebook.com/AcademiaSEA"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl bg-[#1877F2] px-8 py-3.5 text-sm font-bold text-white transition-all hover:opacity-90"
            >
              <Facebook className="h-5 w-5" />
              Siguenos en Facebook
            </a>
          </div>
        </div>
      </section>

      {/* Calendario + Reglamento */}
      <section className="bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="group rounded-3xl border border-border bg-card p-8 transition-all hover:shadow-xl lg:p-10">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sea-blue to-sea-blue-light shadow-lg shadow-sea-blue/20">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-extrabold text-heading">Calendario Escolar</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Consulta las fechas importantes, periodos de inscripcion, examenes y vacaciones.
              </p>
              <a
                href="#"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-sea-blue px-6 py-3 text-sm font-bold text-white transition-all hover:bg-sea-blue-light"
              >
                <Calendar className="h-4 w-4" />
                Descargar Calendario
              </a>
            </div>

            <div className="group rounded-3xl border border-border bg-card p-8 transition-all hover:shadow-xl lg:p-10">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#059669] to-mint shadow-lg shadow-mint/20">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-extrabold text-heading">Reglamento Escolar</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Conoce las normas y lineamientos de la academia para una convivencia armoniosa.
              </p>
              <a
                href="#"
                className="mt-6 inline-flex items-center gap-2 rounded-xl border border-border bg-background px-6 py-3 text-sm font-bold text-foreground transition-all hover:bg-secondary"
              >
                <FileText className="h-4 w-4" />
                Consultar Reglamento
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-[#0c1b3a] py-20 lg:py-24">
        <div className="mx-auto max-w-2xl px-4 text-center lg:px-8">
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sea-blue/20">
              <MessageCircle className="h-8 w-8 text-sea-blue-light" />
            </div>
          </div>
          <h2 className="text-pretty text-3xl font-extrabold text-white md:text-4xl">
            Comienza tu camino hoy
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-300">
            No esperes mas para aprender ingles. Inscribete ahora y se parte de la comunidad Academia SEA.
          </p>
          <a
            href="https://wa.me/523213875702"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-sea-blue px-10 py-4 text-base font-bold text-white shadow-lg shadow-sea-blue/25 transition-all hover:-translate-y-0.5 hover:bg-sea-blue-light"
          >
            <MessageCircle className="h-5 w-5" />
            INSCRIBETE AHORA
          </a>
        </div>
      </section>
    </>
  )
}
