import Image from "next/image"
import { CheckCircle2 } from "lucide-react"

import { urlFor } from "@/sanity/lib/image"

export function CertificationsTeaser({ data }: { data?: any }) {
  const badgeText = data?.badge || "Aval Institucional"
  const titleText = data?.titulo || "Certificaciones con Valor Curricular Real"
  const descriptionText = data?.descripcion || "En Academia SEA..."
  const benefits = data?.beneficios || []
  const textoBoton = data?.textoBoton || "Conoce Nuestros Avales"
  const imgUrl = data?.imagen?.asset ? urlFor(data.imagen.asset).url() : "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2670&auto=format&fit=crop"

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative">
            <div className="absolute inset-0 bg-blue-600/5 rounded-[2.5rem] transform -rotate-3 scale-105" />
            <div className="relative h-[500px] w-full rounded-[2rem] overflow-hidden shadow-2xl bg-slate-200">
              <Image
                src={imgUrl}
                alt={titleText}
                fill
                className="object-cover"
              />
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl max-w-xs animate-bounce" style={{ animationDuration: '3s' }}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-black text-slate-900">+500</p>
                  <p className="text-sm text-slate-600 font-medium">Alumnos Certificados</p>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <h2 className="text-sm font-semibold text-blue-600 tracking-wider uppercase mb-3">
              {badgeText}
            </h2>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-6 leading-tight">
              {titleText}
            </h3>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              {descriptionText}
            </p>

            <ul className="space-y-4 mb-10">
              {benefits.map((benefit: string, i: number) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-blue-600 shrink-0" />
                  <span className="text-slate-700 font-medium">{benefit}</span>
                </li>
              ))}
            </ul>

            <button className="bg-slate-900 text-white px-8 py-4 rounded-full font-semibold hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-slate-900/20">
              {textoBoton}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
