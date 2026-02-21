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
import { useState } from "react"

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
      {/* Hero - with location preview cards */}
      <section className="relative overflow-hidden bg-[#0c1b3a]">
        <div className="pointer-events-none absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-sea-blue/12 blur-[140px]" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-[400px] w-[400px] rounded-full bg-mint/10 blur-[120px]" />
        <div className="pointer-events-none absolute top-20 -left-20 h-48 w-48 rounded-full bg-yellow-soft/8 blur-[80px]" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 lg:px-8 lg:py-32">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="flex flex-col gap-6">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-sea-blue-light/20 bg-sea-blue/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-sea-blue-light">
                <MapPin className="h-3.5 w-3.5" />
                3 Sedes en Jalisco
              </span>
              <h1 className="text-pretty text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
                Inscribete y{" "}
                <span className="bg-gradient-to-r from-sea-blue-light to-mint bg-clip-text text-transparent">
                  comienza hoy
                </span>
              </h1>
              <p className="max-w-lg text-base leading-relaxed text-slate-300 md:text-lg">
                Estamos listos para ayudarte a comenzar tu camino en el dominio del idioma ingles.
                Encuentra toda la informacion para inscribirte.
              </p>
              <a
                href="https://wa.me/523213875702"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex w-fit items-center gap-2 rounded-xl bg-sea-blue px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-sea-blue/25 transition-all hover:-translate-y-0.5 hover:bg-sea-blue-light"
              >
                <MessageCircle className="h-5 w-5" />
                Contactar por WhatsApp
              </a>
            </div>

            {/* Location selector */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-8 rounded-3xl bg-gradient-to-br from-sea-blue/10 via-transparent to-mint/10 blur-2xl" />
                <div className="relative flex flex-col gap-3">
                  {locations.map((loc, i) => (
                    <button
                      key={loc.name}
                      onClick={() => setActiveLocation(i)}
                      className={`flex items-center gap-4 rounded-2xl border p-5 text-left transition-all ${
                        activeLocation === i
                          ? "border-white/20 bg-white/10 shadow-lg backdrop-blur-sm"
                          : "border-white/5 bg-white/5 backdrop-blur-sm hover:border-white/10 hover:bg-white/8"
                      }`}
                    >
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${loc.accent}`}>
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-white">{loc.name}</p>
                        <p className="mt-0.5 text-xs text-slate-400">{loc.phone}</p>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={`tel:+${loc.whatsapp}`}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 transition-all hover:bg-white/15"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Phone className="h-4 w-4 text-white" />
                        </a>
                        <a
                          href={`https://wa.me/${loc.whatsapp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#25d366] transition-all hover:opacity-80"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MessageCircle className="h-4 w-4 text-white" />
                        </a>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
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
