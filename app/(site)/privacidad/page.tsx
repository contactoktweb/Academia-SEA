import { Metadata } from "next"
import { ShieldCheck } from "lucide-react"
import { SubpageHero } from "@/components/subpage-hero"
import { PrivacyAccordion } from "@/components/privacy-accordion"
import { sanityFetch } from "@/sanity/lib/live"
import { PRIVACY_PAGE_QUERY } from "@/sanity/lib/queries"

export const metadata: Metadata = {
  title: "Aviso de Privacidad | Academia SEA",
  description: "Aviso de Privacidad Integral para clientes y alumnos de Academia SEA, conforme a la Ley Federal de Protección de Datos Personales.",
}

export default async function PrivacidadPage() {
  const { data } = await sanityFetch({ query: PRIVACY_PAGE_QUERY })

  const hero = data?.hero
  const secciones = data?.secciones || []
  const notaFinal = data?.notaFinal

  return (
    <>
      <SubpageHero
        badge={hero?.badge || "Documento Legal"}
        badgeIcon={ShieldCheck}
        title={hero?.titulo || "Aviso de Privacidad Integral"}
        subtitle={hero?.subtitulo || "Clientes y Alumnos de Academia SEA"}
      />

      <section className="bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <PrivacyAccordion sections={secciones} />

          <div className="mt-16 overflow-hidden rounded-3xl bg-gradient-to-br from-sea-blue/10 to-mint/10 p-px">
            <div className="rounded-3xl bg-card p-8 text-center">
              <ShieldCheck className="mx-auto mb-3 h-8 w-8 text-sea-blue" />
              <p className="text-sm font-semibold text-heading">
                Última actualización: {notaFinal?.fechaActualizacion || "Enero 2021"}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {notaFinal?.texto || "Para cualquier duda o aclaración sobre este Aviso de Privacidad, contáctenos en cualquiera de nuestras sucursales o a través de nuestras líneas telefónicas."}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
