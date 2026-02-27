import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Clock, Star } from "lucide-react"

const courses = [
  {
    title: "Diplomado en Tráfico y Aduanas",
    category: "Comercio Exterior",
    duration: "120 hrs",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2670&auto=format&fit=crop",
    slug: "/programas/trafico-y-aduanas",
  },
  {
    title: "Especialidad en Logística Internacional",
    category: "Logística",
    duration: "90 hrs",
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=2670&auto=format&fit=crop",
    slug: "/programas/logistica-internacional",
  },
  {
    title: "Gestión de Cadena de Suministro",
    category: "Supply Chain",
    duration: "60 hrs",
    rating: "5.0",
    image: "https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=2670&auto=format&fit=crop",
    slug: "/programas/cadena-de-suministro",
  }
]

export function CoursesTeaser() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-sm font-semibold text-blue-600 tracking-wider uppercase mb-3">
              Catálogo Académico
            </h2>
            <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Programas Destacados
            </h3>
          </div>
          <Link
            href="/programas"
            className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors"
          >
            Ver todos los programas
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <Link
              key={index}
              href={course.slug}
              className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100"
            >
              <div className="relative h-56 overflow-hidden bg-slate-200">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold text-slate-900 rounded-full">
                    {course.category}
                  </span>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <h4 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
                  {course.title}
                </h4>

                <div className="mt-auto flex items-center justify-between text-sm text-slate-500 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="font-medium text-slate-700">{course.rating}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
