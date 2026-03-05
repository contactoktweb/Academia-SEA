import { defineField, defineType } from 'sanity'
import { Award, Globe, Flag, Sparkles } from 'lucide-react'

export const certificationsPage = defineType({
    name: 'certificationsPage',
    title: 'Certificaciones',
    type: 'document',
    icon: Award,
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
                defineField({
                    name: 'tags',
                    title: 'Etiquetas de Certificaciones (Hero)',
                    type: 'array',
                    of: [
                        {
                            type: 'object',
                            icon: Award,
                            fields: [
                                defineField({ name: 'label', title: 'Nombre (ej: TOEFL)', type: 'string' }),
                                defineField({ name: 'sub', title: 'Subtítulo (ej: Internacional)', type: 'string' }),
                            ],
                            preview: {
                                select: {
                                    title: 'label',
                                    subtitle: 'sub'
                                }
                            }
                        }
                    ]
                })
            ]
        }),

        // Internacionales Section
        defineField({
            name: 'internacionales',
            title: 'Sección Internacionales',
            type: 'object',
            icon: Globe,
            fields: [
                defineField({ name: 'titulo', title: 'Título', type: 'string' }),
                defineField({ name: 'descripcion', title: 'Descripción General', type: 'text', rows: 2 }),
                defineField({
                    name: 'lista',
                    title: 'Lista de Certificaciones Internacionales',
                    type: 'array',
                    of: [
                        {
                            type: 'object',
                            icon: Globe,
                            fields: [
                                defineField({ name: 'title', title: 'Título', type: 'string' }),
                                defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 3 }),
                                defineField({
                                    name: 'features',
                                    title: 'Características',
                                    type: 'array',
                                    of: [{ type: 'string' }]
                                }),
                                defineField({ name: 'tag', title: 'Etiqueta Pequeña', type: 'string' }),
                            ],
                            preview: {
                                select: {
                                    title: 'title',
                                    subtitle: 'tag'
                                }
                            }
                        }
                    ]
                })
            ]
        }),

        // Nacionales Section
        defineField({
            name: 'nacionales',
            title: 'Sección Nacionales',
            type: 'object',
            icon: Flag,
            fields: [
                defineField({ name: 'titulo', title: 'Título', type: 'string' }),
                defineField({ name: 'descripcion', title: 'Descripción General', type: 'text', rows: 2 }),
                defineField({
                    name: 'lista',
                    title: 'Lista de Certificaciones Nacionales',
                    type: 'array',
                    of: [
                        {
                            type: 'object',
                            icon: Flag,
                            fields: [
                                defineField({ name: 'title', title: 'Título', type: 'string' }),
                                defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 3 }),
                                defineField({
                                    name: 'features',
                                    title: 'Características',
                                    type: 'array',
                                    of: [{ type: 'string' }]
                                }),
                            ],
                            preview: {
                                select: {
                                    title: 'title'
                                }
                            }
                        }
                    ]
                })
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
                defineField({ name: 'primaryButtonText', title: 'Texto Botón Primario (WhatsApp)', type: 'string' }),
                defineField({ name: 'secondaryButtonText', title: 'Texto Botón Secundario (Cursos)', type: 'string' }),
            ]
        }),
    ],
    preview: {
        prepare() {
            return {
                title: 'Certificaciones',
            }
        }
    }
})
