import { defineField, defineType } from 'sanity'
import { Compass } from 'lucide-react'

export const aboutPhilosophy = defineType({
    name: 'aboutPhilosophy',
    title: 'Nuestra Escuela - Filosofía',
    type: 'document',
    icon: Compass,
    fields: [
        defineField({
            name: 'badge',
            title: 'Etiqueta (Badge)',
            type: 'string',
            description: 'Ej: Filosofía',
        }),
        defineField({
            name: 'titulo',
            title: 'Título de la Sección',
            type: 'string',
            description: 'Ej: Misión y Visión',
        }),
        defineField({
            name: 'mision',
            title: 'Misión',
            type: 'object',
            fields: [
                defineField({ name: 'titulo', title: 'Título', type: 'string' }),
                defineField({ name: 'contenido', title: 'Contenido', type: 'text', rows: 4 }),
            ]
        }),
        defineField({
            name: 'vision',
            title: 'Visión',
            type: 'object',
            fields: [
                defineField({ name: 'titulo', title: 'Título', type: 'string' }),
                defineField({ name: 'contenido', title: 'Contenido', type: 'text', rows: 4 }),
            ]
        }),
    ],
    preview: {
        prepare() {
            return {
                title: 'Nuestra Escuela - Filosofía (Misión/Visión)',
            }
        }
    }
})
