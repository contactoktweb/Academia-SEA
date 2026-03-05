import { BookOpen, Award, Users, Globe2, Star, Clock, LucideIcon } from "lucide-react"

const iconMap: Record<string, LucideIcon> = {
  BookOpen,
  Award,
  Users,
  Globe2,
  Star,
  Clock,
}

export function WhySection({ data }: { data?: any }) {
  const badgeText = data?.badge || "Ventaja Competitiva"
  const titleText = data?.titulo || "¿Por qué elegir Academia SEA?"
  const descriptionText = data?.descripcion || "Nos dedicamos a formar a los líderes del mañana..."
  const features = data?.features || []

  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-[1440px] px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-semibold text-blue-600 tracking-wider uppercase mb-3">
            {badgeText}
          </h2>
          <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">
            {titleText}
          </h3>
          <p className="text-lg text-slate-600">
            {descriptionText}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature: any, index: number) => {
            const Icon = iconMap[feature.icono] || BookOpen
            return (
              <div
                key={feature._key || index}
                className="group relative p-8 bg-slate-50 rounded-2xl hover:bg-blue-600 transition-colors duration-300"
              >
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-white/20 group-hover:text-white transition-colors duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-white transition-colors duration-300">
                  {feature.titulo}
                </h4>
                <p className="text-slate-600 group-hover:text-blue-100 transition-colors duration-300 leading-relaxed">
                  {feature.descripcion}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
