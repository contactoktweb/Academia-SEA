import { Star, Quote } from "lucide-react"

const testimonials = [
    {
        name: "María Fernanda López",
        role: "Especialista en Aduanas",
        content: "La formación en Academia SEA me dio las herramientas prácticas que mi empresa internacional estaba buscando. 100% recomendado para profesionales.",
        rating: 5,
    },
    {
        name: "Carlos Villalobos",
        role: "Director de Logística",
        content: "Los instructores tienen una experiencia invaluable. Pude aplicar lo aprendido desde el primer día en mi agencia aduanal.",
        rating: 5,
    },
    {
        name: "Ana Sofía Ruiz",
        role: "Analista de Supply Chain",
        content: "El módulo de importación y exportación fue clave para mi ascenso. La mejor decisión educativa para especializarme en comercio.",
        rating: 5,
    }
]

export function TestimonialsSection() {
    return (
        <section className="py-24 bg-slate-900 text-white">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-sm font-semibold text-blue-400 tracking-wider uppercase mb-3">
                        Casos de Éxito
                    </h2>
                    <h3 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
                        Lo que dicen nuestros alumnos
                    </h3>
                    <p className="text-lg text-slate-300">
                        Únete a la creciente red de profesionales exitosos que se han formado y especializado en Academia SEA.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, i) => (
                        <div key={i} className="bg-slate-800 rounded-2xl p-8 relative shadow-xl shadow-black/20 transform transition-transform duration-300 hover:-translate-y-2">
                            <Quote className="absolute top-6 right-8 w-12 h-12 text-slate-700 opacity-50" />
                            <div className="flex gap-1 mb-6">
                                {[...Array(testimonial.rating)].map((_, idx) => (
                                    <Star key={idx} className="w-5 h-5 text-amber-400 fill-amber-400" />
                                ))}
                            </div>
                            <p className="text-lg text-slate-200 mb-8 relative z-10 leading-relaxed italic">
                                "{testimonial.content}"
                            </p>
                            <div>
                                <p className="font-bold text-white text-lg">{testimonial.name}</p>
                                <p className="text-sm text-blue-400 font-medium mt-1">{testimonial.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
