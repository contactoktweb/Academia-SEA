import { defineField, defineType } from 'sanity'
import { HelpCircle, List } from 'lucide-react'

export const whySection = defineType({
    name: 'whySection',
    title: 'Seccion - ¿Por que elegirnos?',
    type: 'document',
    icon: HelpCircle,
    fields: [
        defineField({
            name: 'badge',
            title: 'Etiqueta superior (Badge)',
            type: 'string',
        }),
        defineField({
            name: 'titulo',
            title: 'Título de la Sección',
            type: 'string',
        }),
        defineField({
            name: 'descripcion',
            title: 'Descripción / Introducción',
            type: 'text',
            rows: 3,
        }),
        defineField({
            name: 'features',
            title: 'Características / Ventajas',
            type: 'array',
            of: [
                {
                    type: 'object',
                    icon: List,
                    fields: [
                        defineField({
                            name: 'icono',
                            title: 'Icono',
                            type: 'string',
                            options: {
                                list: [
                                    { title: 'Libro (BookOpen)', value: 'BookOpen' },
                                    { title: 'Premio (Award)', value: 'Award' },
                                    { title: 'Usuarios (Users)', value: 'Users' },
                                    { title: 'Mundo (Globe2)', value: 'Globe2' },
                                    { title: 'Estrella (Star)', value: 'Star' },
                                    { title: 'Reloj (Clock)', value: 'Clock' },
                                ],
                            },
                        }),
                        defineField({
                            name: 'titulo',
                            title: 'Título de la Ventaja',
                            type: 'string',
                        }),
                        defineField({
                            name: 'descripcion',
                            title: 'Descripción de la Ventaja',
                            type: 'text',
                            rows: 2,
                        }),
                    ],
                    preview: {
                        select: {
                            title: 'titulo',
                            subtitle: 'icono'
                        },
                        prepare({ title, subtitle }) {
                            return {
                                title: title || 'Nueva Ventaja',
                                subtitle: subtitle || 'Sin icono seleccionado'
                            }
                        }
                    }
                },
            ],
        }),
    ],
    preview: {
        prepare() {
            return {
                title: 'Sección ¿Por qué elegirnos?',
            }
        }
    }
})
