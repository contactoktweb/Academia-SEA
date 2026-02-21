import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ShieldCheck } from "lucide-react"

export function CertificationsTeaser() {
  return (
    <section className="bg-card py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col-reverse items-center gap-12 lg:flex-row lg:gap-16">
          <div className="flex max-w-xl flex-col gap-5">
            <p className="text-sm font-semibold uppercase tracking-wider text-sea-blue">
              Certificaciones
            </p>
            <h2 className="text-pretty text-3xl font-bold text-heading md:text-4xl">
              Valida tu nivel de ingles con certificaciones oficiales
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              Ofrecemos preparacion y aplicacion de examenes internacionales y nacionales que avalan tu
              dominio del idioma ingles ante instituciones de todo el mundo.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {["TOEFL", "TOEIC", "CENNI", "ELeT"].map((cert) => (
                <div
                  key={cert}
                  className="flex items-center gap-2 rounded-xl border border-border bg-background p-3"
                >
                  <ShieldCheck className="h-5 w-5 text-sea-blue" />
                  <span className="text-sm font-semibold text-foreground">{cert}</span>
                </div>
              ))}
            </div>
            <Link
              href="/certificaciones"
              className="mt-2 inline-flex items-center gap-2 self-start rounded-xl border border-sea-blue px-6 py-3 text-sm font-semibold text-sea-blue transition-all hover:bg-sea-blue hover:text-primary-foreground"
            >
              Conocer certificaciones
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl shadow-xl">
            <Image
              src="/images/certifications-preview.jpg"
              alt="Certificaciones de ingles"
              width={560}
              height={400}
              className="h-auto w-full object-cover"
            />
            <div className="absolute top-4 right-4 rounded-xl bg-mint px-4 py-2 shadow-lg">
              <p className="text-xs font-bold text-accent-foreground">Reconocimiento Internacional</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
