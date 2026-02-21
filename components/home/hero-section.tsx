"use client"

import Image from "next/image"
import Link from "next/link"
import { MessageCircle, ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
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
    return () => clearInterval(timer)
  }, [target])

  return (
    <span>
      {count}
      {suffix}
    </span>
  )
}

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-sea-dark">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-students.jpg"
          alt="Estudiantes aprendiendo ingles en Academia SEA"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-sea-dark/80" />
      </div>

      {/* Animated grid lines */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      {/* Decorative glowing orbs */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-sea-blue/20 blur-[100px]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-mint/15 blur-[80px]" />
      <div className="pointer-events-none absolute top-1/3 right-1/3 h-40 w-40 rounded-full bg-sea-blue-light/10 blur-[60px]" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[90vh] max-w-7xl flex-col justify-center px-4 py-20 lg:px-8">
        <div className="flex max-w-3xl flex-col gap-8">
          {/* Tagline chip */}
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-sea-blue-light/30 bg-sea-blue/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-sea-blue-light backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-mint" />
              </span>
              Inscripciones Abiertas
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-pretty text-4xl font-extrabold leading-[1.1] tracking-tight text-primary-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            Domina el ingles con los{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-sea-blue-light">lideres en Jalisco</span>
              <span className="absolute -bottom-1 left-0 h-3 w-full -skew-x-3 bg-sea-blue/30" />
            </span>
          </h1>

          {/* Subheadline */}
          <p className="max-w-xl text-base leading-relaxed text-footer-foreground md:text-lg">
            Metodologia Macmillan, docentes certificados y mas de 15 anos formando estudiantes exitosos. Certificaciones con validez oficial SEP, TOEFL y TOEIC.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="https://wa.me/523213875702"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-2 rounded-xl bg-sea-blue px-7 py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-sea-blue/25 transition-all hover:-translate-y-0.5 hover:bg-sea-blue-light hover:shadow-xl hover:shadow-sea-blue/30"
            >
              <MessageCircle className="h-5 w-5" />
              Contactar por WhatsApp
            </a>
            <Link
              href="/cursos"
              className="group flex items-center justify-center gap-2 rounded-xl border border-primary-foreground/20 bg-primary-foreground/5 px-7 py-3.5 text-sm font-semibold text-primary-foreground backdrop-blur-sm transition-all hover:bg-primary-foreground/10"
            >
              Explorar Cursos
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-16 flex flex-wrap gap-6 border-t border-primary-foreground/10 pt-10 lg:gap-12">
          {[
            { value: 15, suffix: "+", label: "Anos de experiencia" },
            { value: 5000, suffix: "+", label: "Estudiantes formados" },
            { value: 3, suffix: "", label: "Sedes en Jalisco" },
            { value: 98, suffix: "%", label: "Satisfaccion" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1">
              <p className="text-3xl font-extrabold text-primary-foreground md:text-4xl">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-xs font-medium tracking-wide text-footer-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom wave divider */}
      <div className="absolute bottom-0 left-0 z-10 w-full">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
          <path
            d="M0 80V40C240 0 480 0 720 20C960 40 1200 60 1440 40V80H0Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  )
}
