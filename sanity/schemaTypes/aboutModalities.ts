import { defineField, defineType } from 'sanity'
import { GraduationCap, CheckCircle2 } from 'lucide-react'

export const aboutModalities = defineType({
    name: 'aboutModalities',
    title: 'Nuestra Escuela - Modalidades',
    type: 'document',
    icon: GraduationCap,
    fields: [
        defineField({
            name: 'badge',
            title: 'Etiqueta (Badge)',
            type: 'string',
            description: 'Ej: Programa Educativo',
        }),
        defineField({
            name: 'titulo',
            title: 'Título de la Sección',
            type: 'string',
            description: 'Ej: Nuestras Modalidades',
        }),
        defineField({
            name: 'descripcion',
            title: 'Descripción de la Sección',
            type: 'text',
            rows: 3,
        }),
        defineField({
            name: 'presencial',
            title: 'Modalidad Presencial',
            type: 'object',
            fields: [
                defineField({ name: 'titulo', title: 'Título', type: 'string' }),
                defineField({ name: 'descripcion', title: 'Descripción', type: 'text', rows: 3 }),
                defineField({
                    name: 'beneficios',
                    title: 'Beneficios',
                    type: 'array',
                    of: [{ type: 'string' }],
                    options: { layout: 'tags' }
                }),
            ]
        }),
        defineField({
            name: 'online',
            title: 'Modalidad en Línea',
            type: 'object',
            fields: [
                defineField({ name: 'titulo', title: 'Título', type: 'string' }),
                defineField({ name: 'descripcion', title: 'Descripción', type: 'text', rows: 3 }),
                defineField({
                    name: 'beneficios',
                    title: 'Beneficios',
                    type: 'array',
                    of: [{ type: 'string' }],
                    options: { layout: 'tags' }
                }),
            ]
        }),
    ],
    preview: {
        prepare() {
            return {
                title: 'Nuestra Escuela - Modalidades',
            }
        }
    }
})
