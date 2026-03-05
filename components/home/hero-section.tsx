"use client"

import Image from "next/image"
import Link from "next/link"
import { Award, ChevronRight, Download, GraduationCap, Globe2, BookOpen } from "lucide-react"

import { urlFor } from "@/sanity/lib/image"

export function HeroSection({ data }: { data?: any }) {
  const badgeText = data?.badge || "Institución Certificada"
  const titleText = data?.tituloPrincipal || "Excelencia académica en la enseñanza del inglés."
  const subtitleText = data?.subtitulo || "Formando líderes bilingües en Jalisco por más de 15 años. Respaldados por la metodología Macmillan y certificaciones con validez oficial internacional."
  const ctaTexto = data?.ctaTexto || "Iniciar Inscripción"
  const ctaLink = data?.ctaLink || "/contacto"
  const anosExp = data?.anhosExperiencia || "15+"

  const imgSalonUrl = data?.imagenSalon?.asset ? urlFor(data.imagenSalon.asset).url() : "/images/hero-classroom.png"
  const imgProfesorUrl = data?.imagenProfesor?.asset ? urlFor(data.imagenProfesor.asset).url() : "/images/hero-teacher.png"

  return (
    <section className="relative overflow-hidden bg-white">
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

      {/* Main hero content */}
      <div className="relative z-10 mx-auto max-w-[1440px] px-4 pb-6 pt-14 md:pt-20 lg:px-8 lg:pb-10">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-0">
          {/* ─── Left Column: Text ─── */}
          <div className="flex flex-col gap-6 lg:gap-8 lg:pr-8 lg:pt-6">
            {/* Certified Badge */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-200/60 bg-amber-50 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-amber-700">
                <Award className="h-3.5 w-3.5" />
                {badgeText}
              </span>
            </div>

            {/* Headline H1 - serif style */}
            <h1 className="text-pretty text-4xl font-extrabold leading-[1.08] tracking-tight text-[#1a2b4a] sm:text-5xl lg:text-[3.4rem] xl:text-[3.8rem]">
              {titleText.includes("inglés.") ? (
                <>
                  {titleText.split("inglés.")[0]}
                  <em className="not-italic font-extrabold italic text-[#1a2b4a]" style={{ fontStyle: "italic" }}>
                    inglés.
                  </em>
                </>
              ) : (
                titleText
              )}
            </h1>

            {/* Subtitle */}
            <p className="max-w-lg text-base leading-relaxed text-slate-500 md:text-[1.05rem]">
              {subtitleText}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href={ctaLink}
                className="group inline-flex items-center justify-center gap-2 rounded-lg bg-[#1a2b4a] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#1a2b4a]/10 transition-all hover:-translate-y-0.5 hover:bg-[#243a5e] hover:shadow-xl"
              >
                {ctaTexto}
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          {/* ─── Right Column: Images ─── */}
          <div className="relative mx-auto w-full max-w-lg lg:mx-0 lg:max-w-none">
            {/* Images grid */}
            <div className="relative ml-auto grid w-full grid-cols-2 gap-3 pt-12 sm:pt-16 lg:pt-0">
              {/* Left image - classroom */}
              <div className="relative z-10 mt-16 overflow-hidden rounded-2xl shadow-2xl shadow-slate-300/30 sm:mt-20">
                <Image
                  src={imgSalonUrl}
                  alt="Clase de inglés en Academia SEA"
                  width={400}
                  height={500}
                  className="h-[280px] w-full object-cover sm:h-[340px] lg:h-[380px]"
                  priority
                />
              </div>

              {/* Right image - teacher */}
              <div className="relative z-10 overflow-hidden rounded-2xl shadow-2xl shadow-slate-300/30">
                <Image
                  src={imgProfesorUrl}
                  alt="Profesor de inglés certificado"
                  width={400}
                  height={500}
                  className="h-[280px] w-full object-cover sm:h-[340px] lg:h-[380px]"
                  priority
                />
              </div>

              {/* 15+ Años Badge */}
              <div className="absolute -right-2 bottom-4 z-20 sm:bottom-8 sm:right-0 lg:-right-4 lg:bottom-6">
                <div className="relative flex h-20 w-20 items-center justify-center sm:h-24 sm:w-24">
                  {/* Rotating border */}
                  <div
                    className="absolute inset-0 rounded-full border-[3px] border-dashed border-amber-400/60"
                    style={{ animation: "spin 20s linear infinite" }}
                  />
                  {/* Badge body */}
                  <div className="flex h-16 w-16 flex-col items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-500 shadow-lg shadow-amber-500/30 sm:h-20 sm:w-20">
                    <span className="text-lg font-extrabold leading-none text-white sm:text-xl">
                      {anosExp}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-white/90 sm:text-[10px]">
                      Años
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Accreditations bottom bar */}
      <div className="relative z-10 border-t border-slate-200/60 bg-white/60 backdrop-blur-sm">
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
              <Globe2 className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
              <span className="text-sm font-semibold">TOEFL</span>
            </div>
            {/* TOEIC */}
            <div className="flex items-center gap-2 text-slate-500 transition-colors hover:text-[#1a2b4a]">
              <Award className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
              <span className="text-sm font-semibold">TOEIC</span>
            </div>
            {/* Macmillan */}
            <div className="flex items-center gap-2 text-slate-500 transition-colors hover:text-[#1a2b4a]">
              <BookOpen className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
              <span className="text-sm font-semibold">Macmillan</span>
            </div>
          </div>
        </div>
      </div>

      {/* Spin animation */}
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </section>
  )
}
