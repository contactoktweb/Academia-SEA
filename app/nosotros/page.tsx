"use client"

import type { Metadata } from "next"
import {
  Heart,
  Eye,
  Target,
  Shield,
  Sparkles,
  ThumbsUp,
  Flame,
  Award,
  Users,
  Monitor,
  MapPin,
  BookOpen,
  GraduationCap,
  Calendar,
  CheckCircle,
} from "lucide-react"
import { SubpageHero } from "@/components/subpage-hero"
import { useEffect, useState, useRef } from "react"

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          let start = 0
          const duration = 2000
          const step = Math.ceil(target / (duration / 16))
          const timer = setInterval(() => {
            start += step
            if (start >= target) {
              setCount(target)
              clearInterval(timer)
            } else {
              setCount(start)
            }
          }, 16)
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, hasAnimated])

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  )
}

const valores = [
  { icon: Shield, label: "Responsabilidad", desc: "Cumplimos cada compromiso con alumnos y familias", color: "from-sea-blue to-sea-blue-light" },
  { icon: ThumbsUp, label: "Honestidad", desc: "Transparencia en cada aspecto de nuestra labor", color: "from-[#059669] to-mint" },
  { icon: Sparkles, label: "Excelencia", desc: "Buscamos los mas altos estandares educativos", color: "from-amber-500 to-yellow-soft" },
  { icon: Flame, label: "Pasion", desc: "Amamos lo que hacemos y eso se nota", color: "from-red-500 to-orange-400" },
  { icon: Award, label: "Calidad", desc: "Metodologia y materiales de nivel internacional", color: "from-sea-dark to-sea-blue" },
  { icon: Users, label: "Respeto", desc: "Valoramos a cada persona en nuestra comunidad", color: "from-[#059669] to-mint" },
]

const timeline = [
  { year: "2008", title: "Fundacion", desc: "Nace Academia SEA en la region de Jalisco con la mision de ofrecer ensenanza de calidad." },
  { year: "2012", title: "Expansion", desc: "Abrimos nuestra segunda sede y ampliamos la oferta a nivel secundaria y primaria." },
  { year: "2016", title: "Certificaciones", desc: "Nos convertimos en centro aplicador de TOEFL y TOEIC en la region." },
  { year: "2020", title: "Era Digital", desc: "Lanzamos clases en linea manteniendo la calidad de la ensenanza presencial." },
  { year: "2024", title: "Hoy", desc: "3 sedes, mas de 5000 alumnos formados y reconocimiento como lideres en Jalisco." },
]

export default function NosotrosPage() {
  return (
    <>
      {/* Hero - Light themed centered */}
      <SubpageHero
        badge="Desde 2008 en Jalisco"
        badgeIcon={BookOpen}
        title="Donde aprender inglés"
        titleHighlight="transforma vidas."
        subtitle="Más de 15 años formando estudiantes exitosos con una metodología que combina innovación, calidez humana y resultados comprobables. Desde preescolar hasta el mundo empresarial."
      >
        {/* Inline stats */}
        <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12">
          {[
            { value: 15, suffix: "+", label: "Años" },
            { value: 5000, suffix: "+", label: "Alumnos" },
            { value: 3, suffix: "", label: "Sedes" },
            { value: 98, suffix: "%", label: "Satisfacción" },
          ].map((stat, i) => (
            <div key={stat.label} className="flex items-center gap-3">
              {i > 0 && <div className="hidden h-8 w-px bg-slate-200 sm:block" />}
              <div className={`${i > 0 ? "sm:pl-3" : ""}`}>
                <p className="text-2xl font-extrabold text-[#1a2b4a] md:text-3xl">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </SubpageHero>

      {/* Timeline */}
      <section className="bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto mb-16 flex max-w-2xl flex-col items-center gap-4 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-sea-blue/20 bg-sea-blue/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-sea-blue">
              Trayectoria
            </span>
            <h2 className="text-pretty text-3xl font-extrabold text-heading md:text-4xl">
              Nuestra historia en el tiempo
            </h2>
          </div>

          {/* Horizontal timeline on desktop, vertical on mobile */}
          <div className="relative">
            {/* Desktop: horizontal line */}
            <div className="absolute top-6 right-0 left-0 hidden h-0.5 bg-gradient-to-r from-sea-blue via-mint to-sea-blue-light lg:block" />

            <div className="grid gap-8 lg:grid-cols-5 lg:gap-4">
              {timeline.map((item, i) => (
                <div key={item.year} className="relative flex flex-col items-center gap-4 text-center lg:pt-16">
                  {/* Dot */}
                  <div className="absolute top-0 hidden h-12 w-12 items-center justify-center rounded-full border-4 border-background bg-sea-blue shadow-lg shadow-sea-blue/20 lg:flex">
                    <span className="text-xs font-extrabold text-white">{item.year}</span>
                  </div>

                  {/* Card */}
                  <div className="group w-full rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-xl">
                    <span className="mb-2 inline-block text-sm font-extrabold text-sea-blue lg:hidden">{item.year}</span>
                    <h3 className="text-base font-bold text-heading">{item.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mision & Vision - overlapping cards */}
      <section className="bg-card py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto mb-16 flex max-w-2xl flex-col items-center gap-4 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-mint/30 bg-mint/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
              Filosofia
            </span>
            <h2 className="text-pretty text-3xl font-extrabold text-heading md:text-4xl">
              Mision y Vision
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-2 lg:gap-0">
            {/* Mision */}
            <div className="relative z-10 rounded-2xl border border-border bg-background p-10 shadow-xl lg:rounded-r-none lg:border-r-0">
              <div className="pointer-events-none absolute -top-10 -left-10 h-32 w-32 rounded-full bg-sea-blue/5 blur-2xl" />
              <div className="relative">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sea-blue to-sea-blue-light shadow-lg shadow-sea-blue/20">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-extrabold text-heading">Mision</h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Formar personas competentes en el idioma ingles a traves de una metodologia de ensenanza
                  innovadora, con docentes altamente capacitados, utilizando tecnologia de punta y fomentando
                  valores que contribuyan al desarrollo integral de nuestros alumnos.
                </p>
              </div>
            </div>

            {/* Vision */}
            <div className="relative rounded-2xl border border-border bg-[#0c1b3a] p-10 text-white shadow-xl lg:rounded-l-none lg:-ml-px">
              <div className="pointer-events-none absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-mint/10 blur-2xl" />
              <div className="relative">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-mint to-[#059669] shadow-lg shadow-mint/20">
                  <Eye className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-extrabold text-white">Vision</h3>
                <p className="mt-4 text-sm leading-relaxed text-slate-300">
                  Ser la institucion lider en la ensenanza del idioma ingles en la region, reconocida
                  por la calidad de nuestros programas, la excelencia de nuestros docentes y la formacion
                  integral que brindamos a nuestros estudiantes para competir en un entorno globalizado.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Valores - Creative hexagonal/circular grid */}
      <section className="relative overflow-hidden bg-background py-20 lg:py-28">
        <div className="pointer-events-none absolute inset-0 opacity-[0.015]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: "radial-gradient(circle, #1E3A8A 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto mb-16 flex max-w-2xl flex-col items-center gap-4 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-yellow-soft/50 bg-yellow-soft/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-700">
              Lo que nos define
            </span>
            <h2 className="text-pretty text-3xl font-extrabold text-heading md:text-4xl">
              Nuestros Valores
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {valores.map((valor, i) => (
              <div
                key={valor.label}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Gradient top bar */}
                <div className={`absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r ${valor.color}`} />

                {/* Large number bg */}
                <span className="pointer-events-none absolute -right-2 -bottom-4 text-[80px] font-black leading-none text-foreground/[0.02] transition-colors group-hover:text-sea-blue/[0.04]">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="relative flex flex-col gap-4">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${valor.color} shadow-lg transition-transform group-hover:scale-110`}>
                    <valor.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-heading">{valor.label}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{valor.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modalidades - side by side with unique cards */}
      <section className="bg-card py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto mb-16 flex max-w-2xl flex-col items-center gap-4 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-sea-blue/20 bg-sea-blue/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-sea-blue">
              Programa Educativo
            </span>
            <h2 className="text-pretty text-3xl font-extrabold text-heading md:text-4xl">
              Nuestras Modalidades
            </h2>
            <p className="max-w-lg text-base leading-relaxed text-muted-foreground">
              Elige la modalidad que mejor se adapte a tu estilo de vida. Misma calidad, mismo compromiso.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Presencial */}
            <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-sea-blue to-sea-dark p-px shadow-xl shadow-sea-blue/10">
              <div className="h-full rounded-3xl bg-card p-8 lg:p-10">
                <div className="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full bg-sea-blue/5 blur-2xl transition-all group-hover:bg-sea-blue/10" />
                <div className="relative">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sea-blue to-sea-dark shadow-lg shadow-sea-blue/20">
                    <MapPin className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-heading">Clases Presenciales</h3>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    Asiste a nuestras instalaciones en El Grullo, Autlan o Union de Tula. Aulas equipadas,
                    grupos reducidos e interaccion directa con docentes certificados.
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    {["Grupos reducidos", "Tecnologia educativa", "Material Macmillan", "Horarios flexibles"].map((item) => (
                      <div key={item} className="flex items-center gap-2 rounded-xl bg-sea-blue/5 px-3 py-2">
                        <CheckCircle className="h-3.5 w-3.5 shrink-0 text-sea-blue" />
                        <span className="text-xs font-medium text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* En Linea */}
            <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-mint to-[#059669] p-px shadow-xl shadow-mint/10">
              <div className="h-full rounded-3xl bg-card p-8 lg:p-10">
                <div className="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full bg-mint/5 blur-2xl transition-all group-hover:bg-mint/10" />
                <div className="relative">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-mint to-[#059669] shadow-lg shadow-mint/20">
                    <Monitor className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-heading">Clases en Linea</h3>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    Aprende desde cualquier lugar con conexion a internet. Misma calidad, metodologia
                    y seguimiento personalizado con herramientas digitales interactivas.
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    {["Plataforma interactiva", "Clases en vivo", "Material digital", "Total flexibilidad"].map((item) => (
                      <div key={item} className="flex items-center gap-2 rounded-xl bg-mint/10 px-3 py-2">
                        <CheckCircle className="h-3.5 w-3.5 shrink-0 text-accent-foreground" />
                        <span className="text-xs font-medium text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
