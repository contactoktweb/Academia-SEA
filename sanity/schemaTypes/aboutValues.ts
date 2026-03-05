import { defineField, defineType } from 'sanity'
import { Heart, Sparkles } from 'lucide-react'

export const aboutValues = defineType({
    name: 'aboutValues',
    title: 'Nuestra Escuela - Valores',
    type: 'document',
    icon: Heart,
    fields: [
        defineField({
            name: 'badge',
            title: 'Etiqueta (Badge)',
            type: 'string',
            description: 'Ej: Lo que nos define',
        }),
        defineField({
            name: 'titulo',
            title: 'Título de la Sección',
            type: 'string',
            description: 'Ej: Nuestros Valores',
        }),
        defineField({
            name: 'valores',
            title: 'Lista de Valores',
            type: 'array',
            of: [
                {
                    type: 'object',
                    title: 'Valor',
                    icon: Sparkles,
                    fields: [
                        defineField({
                            name: 'icono',
                            title: 'Icono (Lucide)',
                            type: 'string',
                            description: 'Nombre del icono de Lucide (ej: Shield, Zap, Monitor, Users, Award, Globe)',
                            initialValue: 'Shield'
                        }),
                        defineField({ name: 'titulo', title: 'Título', type: 'string' }),
                        defineField({ name: 'descripcion', title: 'Descripción', type: 'text', rows: 3 }),
                    ],
                    preview: {
                        select: {
                            title: 'titulo',
                            subtitle: 'descripcion',
                        },
                        prepare({ title, subtitle }) {
                            return {
                                title: title || 'Sin título',
                                subtitle: subtitle || 'Sin descripción',
                                media: Sparkles
                            }
                        }
                    }
                }
            ]
        }),
    ],
    preview: {
        prepare() {
            return {
                title: 'Nuestra Escuela - Valores',
            }
        }
    }
})
