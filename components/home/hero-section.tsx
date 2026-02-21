"use client"

import Image from "next/image"
import Link from "next/link"
import { MessageCircle, ChevronRight, GraduationCap, Award, Users, Globe } from "lucide-react"
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

  return <span ref={ref}>{count}{suffix}</span>
}

export function HeroSection() {
  return (
    <section className="relative min-h-[92vh] overflow-hidden bg-[#0c1b3a]">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-students.jpg"
          alt="Estudiantes aprendiendo ingles en Academia SEA"
          fill
          className="object-cover opacity-15"
          priority
        />
      </div>

      {/* Decorative blobs - more colorful, not just blue */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-sea-blue/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-20 -bottom-20 h-[400px] w-[400px] rounded-full bg-mint/20 blur-[100px]" />
      <div className="pointer-events-none absolute top-20 right-1/4 h-60 w-60 rounded-full bg-yellow-soft/15 blur-[80px]" />

      {/* Content - two column layout */}
      <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-7xl items-center px-4 py-24 lg:px-8">
        <div className="grid w-full items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left column - text */}
          <div className="flex flex-col gap-7">
            {/* Tagline chip */}
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-mint/30 bg-mint/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-mint backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-mint" />
                </span>
                Inscripciones Abiertas
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-pretty text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Domina el ingles{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-sea-blue-light to-mint bg-clip-text text-transparent">
                  con los lideres
                </span>
              </span>
              <br />
              en Jalisco
            </h1>

            {/* Subheadline */}
            <p className="max-w-lg text-base leading-relaxed text-slate-300 md:text-lg">
              Metodologia Macmillan, docentes certificados y mas de 15 anos
              formando estudiantes exitosos. Certificaciones con validez oficial
              SEP, TOEFL y TOEIC.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="https://wa.me/523213875702"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-2 rounded-xl bg-sea-blue px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-sea-blue/25 transition-all hover:-translate-y-0.5 hover:bg-sea-blue-light hover:shadow-xl hover:shadow-sea-blue/30"
              >
                <MessageCircle className="h-5 w-5" />
                Contactar por WhatsApp
              </a>
              <Link
                href="/cursos"
                className="group flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white/25 hover:bg-white/10"
              >
                Explorar Cursos
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Stats row */}
            <div className="mt-4 flex flex-wrap gap-6 border-t border-white/10 pt-8 lg:gap-10">
              {[
                { value: 15, suffix: "+", label: "Anos de experiencia" },
                { value: 5000, suffix: "+", label: "Estudiantes formados" },
                { value: 3, suffix: "", label: "Sedes en Jalisco" },
                { value: 98, suffix: "%", label: "Satisfaccion" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col gap-0.5">
                  <p className="text-2xl font-extrabold text-white md:text-3xl">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-[11px] font-medium tracking-wide text-slate-400">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right column - visual cards */}
          <div className="relative hidden lg:block">
            {/* Main floating card */}
            <div className="relative mx-auto w-full max-w-md">
              {/* Background glow */}
              <div className="absolute -inset-8 rounded-3xl bg-gradient-to-br from-sea-blue/20 via-transparent to-mint/20 blur-2xl" />

              {/* Image card */}
              <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
                <Image
                  src="/images/hero-students.jpg"
                  alt="Clase en Academia SEA"
                  width={500}
                  height={360}
                  className="h-[360px] w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c1b3a]/80 via-transparent to-transparent" />

                {/* Overlay text on image */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-xs font-semibold uppercase tracking-widest text-mint">Centro de Aprendizaje</p>
                  <p className="mt-1 text-lg font-bold text-white">Formando lideres bilingues desde 2010</p>
                </div>
              </div>

              {/* Floating badge top-right */}
              <div className="absolute -top-4 -right-4 flex items-center gap-2 rounded-xl border border-white/10 bg-[#0f2247]/90 px-4 py-3 shadow-xl backdrop-blur-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-mint/20">
                  <Award className="h-5 w-5 text-mint" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">TOEFL & TOEIC</p>
                  <p className="text-[10px] text-slate-400">Centro Certificador</p>
                </div>
              </div>

              {/* Floating badge bottom-left */}
              <div className="absolute -bottom-5 -left-5 flex items-center gap-2 rounded-xl border border-white/10 bg-[#0f2247]/90 px-4 py-3 shadow-xl backdrop-blur-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sea-blue/20">
                  <GraduationCap className="h-5 w-5 text-sea-blue-light" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Validez SEP</p>
                  <p className="text-[10px] text-slate-400">Certificacion oficial</p>
                </div>
              </div>

              {/* Small floating icons */}
              <div className="absolute -top-8 left-12 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-[#0f2247]/80 shadow-lg backdrop-blur-sm">
                <Globe className="h-5 w-5 text-sea-blue-light" />
              </div>
              <div className="absolute -right-6 top-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[#0f2247]/80 shadow-lg backdrop-blur-sm">
                <Users className="h-5 w-5 text-mint" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave divider */}
      <div className="absolute bottom-0 left-0 z-10 w-full">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 80V40C240 0 480 0 720 20C960 40 1200 60 1440 40V80H0Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  )
}
