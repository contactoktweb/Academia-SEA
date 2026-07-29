import type { Metadata } from "next"
import { SubpageHero } from "@/components/subpage-hero"
import { PlacementTestForm } from "./placement-test-form"
import { FileCheck } from "lucide-react"

export const metadata: Metadata = {
  title: "Examen de Ubicación",
  description:
    "Evalúa tu nivel de inglés en solo unos minutos con el examen de ubicación de Academia SEA basado en el Marco Común Europeo de Referencia (MCER).",
  openGraph: {
    title: "Examen de Ubicación | Academia SEA",
    description:
      "Evalúa tu nivel de inglés en solo unos minutos con el examen de ubicación de Academia SEA basado en el Marco Común Europeo (MCER).",
  },
  alternates: {
    canonical: "/examen-ubicacion",
  },
}

export default function ExamenUbicacionPage() {
  return (
    <>
      <SubpageHero
        badge="Evaluación Diagnóstica"
        badgeIcon={FileCheck}
        title="Examen de Ubicación de"
        titleHighlight="Inglés"
        subtitle="Evalúa tus habilidades comunicativas y gramaticales bajo el estándar internacional MCER para asignarte al nivel y grupo ideal para ti."
        showOnlineBadge
      />
      <section className="bg-slate-50/60 py-12 md:py-20">
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <PlacementTestForm />
        </div>
      </section>
    </>
  )
}
