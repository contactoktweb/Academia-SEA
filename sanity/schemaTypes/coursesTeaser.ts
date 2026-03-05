import { defineField, defineType } from 'sanity'
import { BookCheck, Clock, Star } from 'lucide-react'

export const coursesTeaser = defineType({
    name: 'coursesTeaser',
    title: 'Sección - Programas Destacados',
    type: 'document',
    icon: BookCheck,
    fields: [
        defineField({
            name: 'badge',
            title: 'Etiqueta superior (Badge)',
            type: 'string',
            description: 'Ej: Catálogo Académico',
        }),
        defineField({
            name: 'titulo',
            title: 'Título de la Sección',
            type: 'string',
            description: 'Ej: Programas Destacados',
        }),
        defineField({
            name: 'cursosDestacados',
            title: 'Cursos a mostrar',
            type: 'array',
            description: 'Añade aquí la información de cada curso directamente.',
            of: [
                {
                    type: 'object',
                    icon: BookCheck,
                    fields: [
                        defineField({ name: 'titulo', title: 'Título del Curso', type: 'string' }),
                        defineField({ name: 'categoria', title: 'Categoría', type: 'string' }),
                        defineField({ name: 'duracion', title: 'Duración / Horario', type: 'string' }),
                        defineField({ name: 'rating', title: 'Calificación', type: 'string' }),
                        defineField({ name: 'imagen', title: 'Imagen', type: 'image', options: { hotspot: true } }),
                        defineField({ name: 'slug', title: 'Enlace (Slug)', type: 'string', description: 'Ej: nivel-primaria' }),
                    ],
                    preview: {
                        select: { title: 'titulo', media: 'imagen' }
                    }
                }
            ],
        }),
    ],
    preview: {
        prepare() {
            return {
                title: 'Sección Programas Destacados (Home)',
            }
        }
    }
})
