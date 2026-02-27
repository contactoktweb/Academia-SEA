import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function CtaSection() {
    return (
        <section className="py-24 relative overflow-hidden bg-sea-blue">
            {/* Abstract Background Patterns */}
            <div className="absolute inset-0 opacity-10">
                <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <pattern id="grid-pattern" width="8" height="8" patternUnits="userSpaceOnUse">
                        <path d="M 8 0 L 0 0 0 8" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    </pattern>
                    <rect width="100" height="100" fill="url(#grid-pattern)" />
                </svg>
            </div>

            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-sea-blue-light rounded-full blur-3xl opacity-50" />
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-72 h-72 bg-sea-blue/50 rounded-full blur-2xl opacity-50" />

            <div className="container relative z-10 px-4 md:px-6 mx-auto text-center">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
                        Impulsa tu carrera en Comercio Exterior hoy mismo
                    </h2>
                    <p className="text-lg md:text-xl text-sky-100 mb-10 leading-relaxed font-medium">
                        Únete a la nueva generación de expertos logísticos. Inscríbete ahora y transforma tu futuro profesional con Academia SEA.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/inscripcion"
                            className="w-full sm:w-auto px-8 py-4 bg-white text-sea-blue rounded-full font-bold hover:bg-slate-50 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-black/10 flex items-center justify-center"
                        >
                            Inscribirme Ahora
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Link>
                        <Link
                            href="/contacto"
                            className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white/30 text-white rounded-full font-bold hover:bg-white/10 transition-all flex items-center justify-center"
                        >
                            Solicitar Información
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
