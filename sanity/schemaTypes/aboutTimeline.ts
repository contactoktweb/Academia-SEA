import { defineField, defineType } from 'sanity'
import { History, CalendarDays } from 'lucide-react'

export const aboutTimeline = defineType({
    name: 'aboutTimeline',
    title: 'Nuestra Escuela - Trayectoria',
    type: 'document',
    icon: History,
    fields: [
        defineField({
            name: 'badge',
            title: 'Etiqueta (Badge)',
            type: 'string',
            description: 'Ej: Trayectoria',
        }),
        defineField({
            name: 'titulo',
            title: 'Título de la Sección',
            type: 'string',
            description: 'Ej: Nuestra historia en el tiempo',
        }),
        defineField({
            name: 'hitos',
            title: 'Hitos en el Tiempo',
            type: 'array',
            of: [
                {
                    type: 'object',
                    title: 'Hito histórico',
                    icon: CalendarDays, // Beautiful icon for the list items in Studio
                    fields: [
                        defineField({ name: 'anio', title: 'Año', type: 'string' }),
                        defineField({ name: 'titulo', title: 'Título del Hito', type: 'string' }),
                        defineField({ name: 'descripcion', title: 'Descripción', type: 'text', rows: 2 }),
                    ],
                    preview: {
                        select: {
                            title: 'titulo',
                            subtitle: 'anio'
                        },
                        prepare({ title, subtitle }) {
                            return {
                                title: title || 'Sin título',
                                subtitle: subtitle || 'Sin año',
                                media: CalendarDays // Forces the beautiful icon in the Studio list
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
                title: 'Nuestra Escuela - Trayectoria',
            }
        }
    }
})
