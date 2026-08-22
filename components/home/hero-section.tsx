"use client"

import Link from "next/link"
import { BadgeCheck, GraduationCap, Languages, BookMarked, MonitorPlay, CheckCircle2, Award, Users } from "lucide-react"
import { HeroLeadForm } from "./hero-lead-form"

export function HeroSection({ data }: { data?: any }) {
  const badgeText = data?.badge || "Institución Certificada"
  const titleText = data?.tituloPrincipal || "Excelencia académica en la enseñanza del inglés."
  const subtitleText = data?.subtitulo || "Formando líderes bilingües en Jalisco por más de 15 años. Respaldados por la metodología Macmillan y certificaciones con validez oficial internacional."
  const anosExp = data?.anhosExperiencia || "15+"

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50/70 via-white to-white">
      {/* Subtle grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #1e3a5f 1px, transparent 1px),
            linear-gradient(to bottom, #1e3a5f 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Decorative ambient background glows */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-[350px] w-[600px] rounded-full bg-blue-100/50 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 right-0 h-[300px] w-[300px] rounded-full bg-amber-100/40 blur-3xl" />

      {/* Main hero content */}
      <div className="relative z-10 mx-auto max-w-[1440px] px-4 pb-10 pt-28 md:pt-36 lg:px-8 lg:pb-14">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-8 xl:gap-12">
          {/* ─── Left Column: Value Prop & Messaging (7 cols) ─── */}
          <div className="flex flex-col gap-6 lg:col-span-7 lg:pr-4">
            {/* Badges Row */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Certified Badge */}
              <div className="group flex items-center overflow-hidden rounded-sm border border-amber-200/60 bg-amber-50/70 shadow-xs transition-all hover:bg-amber-50">
                <div className="h-8 w-1 bg-amber-500" />
                <div className="flex items-center gap-2 px-3 py-1.5">
                  <BadgeCheck className="h-3.5 w-3.5 text-amber-600" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-amber-900/90">
                    {badgeText}
                  </span>
                </div>
              </div>

              {/* Online Courses Badge */}
              <div className="group flex items-center overflow-hidden rounded-sm border border-emerald-200/60 bg-emerald-50/70 shadow-xs transition-all hover:bg-emerald-50">
                <div className="h-8 w-1 bg-emerald-500" />
                <div className="flex items-center gap-2 px-3 py-1.5">
                  <MonitorPlay className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-emerald-900/90">
                    Modalidad Presencial y Online
                  </span>
                </div>
              </div>
            </div>

            {/* Headline H1 */}
            <h1 className="text-pretty text-4xl font-extrabold leading-[1.1] tracking-tight text-[#1a2b4a] sm:text-5xl lg:text-[3.2rem] xl:text-[3.6rem]">
              {titleText.includes("inglés.") ? (
                <>
                  {titleText.split("inglés.")[0]}
                  <em className="not-italic font-extrabold italic text-[#0066cc]" style={{ fontStyle: "italic" }}>
                    inglés.
                  </em>
                </>
              ) : (
                titleText
              )}
            </h1>

            {/* Subtitle */}
            <p className="max-w-xl text-base leading-relaxed text-slate-600 md:text-[1.08rem]">
              {subtitleText}
            </p>

            {/* Value Highlights List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="flex items-center gap-2.5 text-slate-700 font-medium text-sm">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shrink-0">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <span>Profesores certificados con metodología Macmillan</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-700 font-medium text-sm">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600 shrink-0">
                  <Award className="h-4 w-4" />
                </div>
                <span>Certificaciones con validez oficial SEP y TOEFL</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-700 font-medium text-sm">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-amber-600 shrink-0">
                  <Users className="h-4 w-4" />
                </div>
                <span>Grupos reducidos y atención personalizada</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-700 font-medium text-sm">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 shrink-0">
                  <MonitorPlay className="h-4 w-4" />
                </div>
                <span>Clases 100% en vivo o en nuestras sedes de Jalisco</span>
              </div>
            </div>

            {/* Experience Pill & Placement Test Teaser */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="flex items-center gap-2.5 rounded-xl bg-slate-100/80 px-4 py-2.5 text-xs text-slate-700">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 font-extrabold text-white text-[11px]">
                  {anosExp}
                </span>
                <span className="font-semibold text-slate-800">
                  Años formando líderes bilingües en México
                </span>
              </div>
              <Link
                href="/examen-ubicacion"
                className="text-xs font-semibold text-[#0066cc] hover:underline flex items-center gap-1 transition-colors"
              >
                ¿Quieres saber tu nivel? Toma el Examen Diagnóstico Gratis &rarr;
              </Link>
            </div>
          </div>

          {/* ─── Right Column: High-Converting Open English Style Form (5 cols) ─── */}
          <div className="relative w-full lg:col-span-5 flex justify-center lg:justify-end">
            <HeroLeadForm />
          </div>
        </div>
      </div>

      {/* Accreditations bottom bar */}
      <div className="relative z-10 border-t border-slate-200/70 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start gap-4 px-4 py-5 sm:flex-row sm:items-center sm:gap-10 lg:px-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Acreditaciones y Validez Oficial
          </p>
          <div className="flex flex-wrap items-center gap-6 sm:gap-8">
            {/* SEP */}
            <div className="flex items-center gap-2 text-slate-500 transition-colors hover:text-[#1a2b4a]">
              <GraduationCap className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
              <span className="text-sm font-semibold">SEP</span>
            </div>
            {/* TOEFL */}
            <div className="flex items-center gap-2 text-slate-500 transition-colors hover:text-[#1a2b4a]">
              <Languages className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
              <span className="text-sm font-semibold">TOEFL</span>
            </div>
            {/* TOEIC */}
            <div className="flex items-center gap-2 text-slate-500 transition-colors hover:text-[#1a2b4a]">
              <BadgeCheck className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
              <span className="text-sm font-semibold">TOEIC</span>
            </div>
            {/* Macmillan */}
            <div className="flex items-center gap-2 text-slate-500 transition-colors hover:text-[#1a2b4a]">
              <BookMarked className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
              <span className="text-sm font-semibold">Macmillan</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
