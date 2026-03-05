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
            description: 'Ej: Impulsa tu carrera en Comercio Exterior hoy mismo',
        }),
        defineField({
            name: 'descripcion',
            title: 'Texto Descriptivo',
            type: 'text',
            rows: 3,
            description: 'Ej: Únete a la nueva generación de expertos logísticos...',
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
