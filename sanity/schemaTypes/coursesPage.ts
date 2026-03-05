import { defineField, defineType } from 'sanity'
import { GraduationCap, BookOpen, Baby, Users, Briefcase, Sparkles } from 'lucide-react'

export const coursesPage = defineType({
    name: 'coursesPage',
    title: 'Cursos',
    type: 'document',
    icon: GraduationCap,
    fields: [
        // Hero Section
        defineField({
            name: 'hero',
            title: 'Sección Hero',
            type: 'object',
            icon: Sparkles,
            fields: [
                defineField({ name: 'badge', title: 'Etiqueta (Badge)', type: 'string' }),
                defineField({ name: 'titulo', title: 'Título', type: 'string' }),
                defineField({ name: 'tituloResaltado', title: 'Título Resaltado', type: 'string' }),
                defineField({ name: 'subtitulo', title: 'Subtítulo', type: 'text', rows: 3 }),
            ]
        }),

        // Courses List
        defineField({
            name: 'cursos',
            title: 'Lista de Cursos',
            type: 'array',
            of: [
                {
                    type: 'object',
                    icon: BookOpen,
                    fields: [
                        defineField({ name: 'titulo', title: 'Título del Curso', type: 'string' }),
                        defineField({ name: 'badge', title: 'Etiqueta', type: 'string' }),
                        defineField({
                            name: 'icono',
                            title: 'Icono (Lucide)',
                            type: 'string',
                            description: 'Nombre del icono (ej: Baby, BookOpen, Users, GraduationCap, Briefcase)'
                        }),
                        defineField({ name: 'imagen', title: 'Imagen', type: 'image', options: { hotspot: true } }),
                        defineField({ name: 'descripcion', title: 'Descripción', type: 'text', rows: 4 }),
                        defineField({
                            name: 'highlights',
                            title: 'Puntos Destacados',
                            type: 'array',
                            of: [{ type: 'string' }]
                        }),
                    ],
                    preview: {
                        select: {
                            title: 'titulo',
                            subtitle: 'badge',
                            media: 'imagen'
                        }
                    }
                }
            ]
        }),

        // Final CTA
        defineField({
            name: 'ctaFinal',
            title: 'CTA Final',
            type: 'object',
            fields: [
                defineField({ name: 'titulo', title: 'Título', type: 'string' }),
                defineField({ name: 'descripcion', title: 'Descripción', type: 'text', rows: 2 }),
                defineField({ name: 'textoBoton', title: 'Texto del Botón', type: 'string' }),
            ]
        }),
    ],
    preview: {
        prepare() {
            return {
                title: 'Cursos',
            }
        }
    }
})
