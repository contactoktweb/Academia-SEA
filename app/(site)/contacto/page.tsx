import { Metadata } from "next"
import {
  PhoneCall,
  MapPin,
  ClipboardList,
  ScrollText,
  CheckCircle,
  AlarmClock,
  UserCheck,
  CalendarCheck,
  FileSignature,
  FolderOpen,
  Facebook,
  Send,
} from "lucide-react"
import { SubpageHero } from "@/components/subpage-hero"
import { WhatsappIcon } from "@/components/whatsapp-icon"
import { sanityFetch } from "@/sanity/lib/live"
import { CONTACT_PAGE_QUERY } from "@/sanity/lib/queries"

export const metadata: Metadata = {
  title: "Contacto | Academia SEA",
  description: "Visítanos en cualquiera de nuestras 3 sedes en Jalisco o contáctanos por WhatsApp. Te guiamos en tu proceso de inscripción.",
}

// Static accent colors per location card (design-only, not editable from Sanity)
const LOCATION_ACCENTS = [
  "from-sea-blue to-sea-blue-light",
  "from-[#059669] to-mint",
  "from-amber-500 to-yellow-soft",
]

export default async function ContactoPage() {
  const { data } = await sanityFetch({ query: CONTACT_PAGE_QUERY })

  const hero = data?.hero
  const proceso = data?.proceso
  const requisitos = data?.requisitos
  const sedes = data?.sedes
  const descargas = data?.descargas
  const ctaFinal = data?.ctaFinal

  return (
    <>
      <SubpageHero
        badge={hero?.badge || "3 Sedes en Jalisco"}
        badgeIcon={MapPin}
        title={hero?.titulo || "Estamos cerca de ti,"}
        titleHighlight={hero?.tituloResaltado || "inscríbete hoy."}
        subtitle={hero?.subtitulo || "Visítanos en cualquiera de nuestras sucursales o contáctanos por WhatsApp. Te guiamos paso a paso en tu proceso de inscripción."}
      >
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {(sedes?.ubicaciones || []).map((loc: any, i: number) => (
              <a
                key={loc._key || loc.nombre}
                href="#ubicaciones"
                className="group flex items-center gap-3 rounded-full border border-slate-200 bg-white py-2.5 pr-5 pl-2.5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
              >
                <div className={`flex h-9 w-9 items-center justify-center rounded-full ${['bg-sea-blue', 'bg-emerald-600', 'bg-amber-500'][i % 3]}`}>
                  <MapPin className="h-4 w-4 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-[#1a2b4a]">{loc.nombre}</p>
                  <p className="text-[10px] text-slate-400">{loc.telefono}</p>
                </div>
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-white/60 px-6 py-3 text-sm font-medium text-slate-600 shadow-sm border border-slate-200/60">
            <WhatsappIcon className="h-5 w-5 text-[#25d366]" />
            Comunícate por WhatsApp a cualquiera de nuestras sedes abajo.
          </div>
        </div>
      </SubpageHero>

      <section className="bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
          <div className="mx-auto mb-16 flex max-w-2xl flex-col items-center gap-4 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-sea-blue/20 bg-sea-blue/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-sea-blue">
              <ClipboardList className="h-3.5 w-3.5" />
              {proceso?.badge || "Paso a paso"}
            </span>
            <h2 className="text-pretty text-3xl font-extrabold text-heading md:text-4xl">
              {proceso?.titulo || "Proceso de Inscripcion"}
            </h2>
          </div>

          <div className="relative mx-auto max-w-4xl">
            <div className="absolute top-0 bottom-0 left-8 hidden w-0.5 bg-gradient-to-b from-sea-blue via-emerald-600 to-sea-blue-light lg:left-1/2 lg:block lg:-translate-x-px" />

            <div className="flex flex-col gap-8 lg:gap-12">
              {(proceso?.pasos || []).map((item: any, i: number) => {
                const isRight = i % 2 !== 0
                const STEP_ICONS = [PhoneCall, FileSignature, FolderOpen, UserCheck]
                const Icon = STEP_ICONS[i] || ClipboardList
                return (
                  <div key={item._key || i} className={`relative flex items-center gap-6 lg:gap-0 ${isRight ? "lg:flex-row-reverse" : ""}`}>
                    <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-background bg-sea-blue shadow-lg shadow-sea-blue/20 lg:absolute lg:left-1/2 lg:-translate-x-1/2">
                      <Icon className="h-7 w-7 text-white" />
                    </div>

                    <div className={`w-full lg:w-[calc(50%-3rem)] lg:flex-none ${isRight ? "lg:mr-auto lg:pr-12" : "lg:ml-auto lg:pl-12"}`}>
                      <div className="group rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-xl">
                        <span className="mb-2 inline-block text-xs font-bold text-sea-blue">Paso {item.paso}</span>
                        <h3 className="text-lg font-bold text-heading">{item.titulo}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.descripcion}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mx-auto mt-16 max-w-2xl">
            <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-sea-blue/10 to-emerald-600/10 p-px">
              <div className="rounded-3xl bg-card p-8 lg:p-10">
                <h3 className="mb-6 text-xl font-extrabold text-heading">{requisitos?.titulo || "Requisitos de Inscripcion"}</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {(requisitos?.lista || []).map((req: string) => (
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

      <section id="ubicaciones" className="bg-card py-20 lg:py-28 scroll-mt-20">
        <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
          <div className="mx-auto mb-16 flex max-w-2xl flex-col items-center gap-4 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-600/30 bg-emerald-600/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700">
              <MapPin className="h-3.5 w-3.5" />
              {sedes?.badge || "Ubicaciones"}
            </span>
            <h2 className="text-pretty text-3xl font-extrabold text-heading md:text-4xl">
              {sedes?.titulo || "Nuestras Sucursales"}
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {(sedes?.ubicaciones || []).map((loc: any, i: number) => {
              const accent = LOCATION_ACCENTS[i % LOCATION_ACCENTS.length]
              return (
                <div
                  key={loc._key || loc.nombre}
                  className="group relative overflow-hidden rounded-3xl bg-gradient-to-br p-px shadow-xl transition-all hover:-translate-y-1"
                  style={{
                    backgroundImage: `linear-gradient(to bottom right, var(--sea-blue), transparent)`,
                  }}
                >
                  <div className="h-full rounded-3xl bg-background p-8">
                    <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${['bg-sea-blue', 'bg-emerald-600', 'bg-amber-500'][i % 3]} shadow-lg`}>
                      <MapPin className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-extrabold text-heading">{loc.nombre}</h3>

                    <div className="mt-4 flex flex-col gap-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <PhoneCall className="h-4 w-4" />
                        <span>{loc.telefono}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <AlarmClock className="h-4 w-4" />
                        <span>{loc.horarios}</span>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-2">
                      <a
                        href={`https://wa.me/${loc.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 rounded-xl bg-[#25d366] px-4 py-3 text-sm font-bold text-white transition-all hover:opacity-90"
                      >
                        <WhatsappIcon className="h-5 w-5" />
                        WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-12 flex justify-center">
            <a
              href="https://www.facebook.com/AcademiaSEA"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl bg-[#1877F2] px-8 py-3.5 text-sm font-bold text-white transition-all hover:opacity-90"
            >
              <Facebook className="h-5 w-5" />
              Síguenos en Facebook
            </a>
          </div>
        </div>
      </section>

      <section className="bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="group rounded-3xl border border-border bg-card p-8 transition-all hover:shadow-xl lg:p-10">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-sea-blue shadow-lg shadow-sea-blue/20">
                <CalendarCheck className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-extrabold text-heading">{descargas?.calendario?.titulo || "Calendario Escolar"}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {descargas?.calendario?.descripcion}
              </p>
              <a
                href={descargas?.calendario?.archivoUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-sea-blue px-6 py-3 text-sm font-bold text-white transition-all hover:bg-sea-blue-light"
              >
                <CalendarCheck className="h-4 w-4" />
                {descargas?.calendario?.textoBoton || "Descargar Calendario"}
              </a>
            </div>

            <div className="group rounded-3xl border border-border bg-card p-8 transition-all hover:shadow-xl lg:p-10">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 shadow-lg shadow-emerald-600/20">
                <ScrollText className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-extrabold text-heading">{descargas?.reglamento?.titulo || "Reglamento Escolar"}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {descargas?.reglamento?.descripcion}
              </p>
              <a
                href={descargas?.reglamento?.archivoUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-xl border border-border bg-background px-6 py-3 text-sm font-bold text-foreground transition-all hover:bg-secondary"
              >
                <ScrollText className="h-4 w-4" />
                {descargas?.reglamento?.textoBoton || "Consultar Reglamento"}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0c1b3a] py-20 lg:py-24">
        <div className="mx-auto max-w-2xl px-4 text-center lg:px-8">
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sea-blue/20">
              <Send className="h-8 w-8 text-sea-blue-light" />
            </div>
          </div>
          <h2 className="text-pretty text-3xl font-extrabold text-white md:text-4xl">
            {ctaFinal?.titulo || "Comienza tu camino hoy"}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-300">
            {ctaFinal?.descripcion}
          </p>
          <a
            href="#ubicaciones"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-sea-blue px-10 py-4 text-base font-bold text-white shadow-lg shadow-sea-blue/25 transition-all hover:-translate-y-0.5 hover:bg-sea-blue-light"
          >
            <Send className="h-5 w-5" />
            {ctaFinal?.textoBoton || "INSCRÍBETE AHORA"}
          </a>
        </div>
      </section>
    </>
  )
}
