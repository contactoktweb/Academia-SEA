import { defineField, defineType } from 'sanity'
import { Megaphone } from 'lucide-react'

export const ctaSection = defineType({
    name: 'ctaSection',
    title: 'Sección - Inscripción (CTA Final)',
    type: 'document',
    icon: Megaphone,
    fields: [
        defineField({
            name: 'titulo',
            title: 'Título Llamativo',
            type: 'string',
            description: 'Ej: Excelencia académica en la enseñanza del inglés.',
        }),
        defineField({
            name: 'descripcion',
            title: 'Texto Descriptivo',
            type: 'text',
            rows: 3,
            description: 'Ej: Formando líderes bilingües en Jalisco por más de 15 años...',
        }),
        defineField({
            name: 'botonPrimarioTexto',
            title: 'Texto Botón Primario',
            type: 'string',
        }),
        defineField({
            name: 'botonPrimarioLink',
            title: 'Enlace Botón Primario',
            type: 'string',
            description: 'Ej: /inscripcion',
        }),
        defineField({
            name: 'botonSecundarioTexto',
            title: 'Texto Botón Secundario',
            type: 'string',
        }),
        defineField({
            name: 'botonSecundarioLink',
            title: 'Enlace Botón Secundario',
            type: 'string',
            description: 'Ej: /contacto',
        }),
    ],
    preview: {
        prepare() {
            return {
                title: 'Sección Inscripción (Home)',
            }
        }
    }
})
