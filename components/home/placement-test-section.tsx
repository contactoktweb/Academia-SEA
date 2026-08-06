"use client"

import Link from "next/link"
import { ClipboardCheck, ArrowRight, CheckCircle2 } from "lucide-react"

export function PlacementTestSection() {
  return (
    <section className="relative overflow-hidden bg-[#006EAE] py-20 lg:py-24">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>
      
      <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-sky-300/20 blur-3xl" />
      <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-emerald-300/20 blur-3xl" />

      <div className="relative mx-auto max-w-[1440px] px-4 lg:px-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 shadow-inner">
            <ClipboardCheck className="h-8 w-8 text-sky-200" />
          </div>

          <h2 className="mb-6 text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
            ¿No sabes cuál es tu nivel de inglés?
          </h2>
          
          <p className="mb-10 max-w-2xl text-lg text-sky-100 md:text-xl">
            Realiza nuestro examen de ubicación completamente gratis. En tan solo unos minutos evaluaremos tus habilidades para asignarte al grupo ideal.
          </p>

          <div className="mb-12 flex flex-col gap-4 text-left sm:flex-row sm:gap-8">
            <div className="flex items-center gap-3 text-white">
              <CheckCircle2 className="h-5 w-5 text-emerald-300" />
              <span>100% Gratuito y sin compromiso</span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <CheckCircle2 className="h-5 w-5 text-emerald-300" />
              <span>Resultados inmediatos</span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <CheckCircle2 className="h-5 w-5 text-emerald-300" />
              <span>Evaluación precisa</span>
            </div>
          </div>

          <Link
            href="/examen-ubicacion"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-bold text-[#006EAE] shadow-xl transition-all hover:-translate-y-1 hover:bg-slate-50 hover:shadow-2xl"
          >
            Hacer Examen de Ubicación
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
          
        </div>
      </div>
    </section>
  )
}
