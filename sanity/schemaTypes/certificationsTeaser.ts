import { defineField, defineType } from 'sanity'
import { CheckCircle2 } from 'lucide-react'

export const certificationsTeaser = defineType({
    name: 'certificationsTeaser',
    title: 'Sección - Certificaciones con Valor y Curricular Real',
    type: 'document',
    icon: CheckCircle2,
    fields: [
        defineField({
            name: 'badge',
            title: 'Etiqueta superior (Badge)',
            type: 'string',
            description: 'Ej: Aval Institucional',
        }),
        defineField({
            name: 'titulo',
            title: 'Título de la Sección',
            type: 'string',
            description: 'Ej: Certificaciones con Valor Curricular Real',
        }),
        defineField({
            name: 'descripcion',
            title: 'Descripción',
            type: 'text',
            rows: 3,
        }),
        defineField({
            name: 'imagen',
            title: 'Imagen Principal',
            type: 'image',
            options: { hotspot: true },
        }),
        defineField({
            name: 'beneficios',
            title: 'Beneficios (Lista)',
            type: 'array',
            of: [{ type: 'string' }],
        }),
        defineField({
            name: 'textoBoton',
            title: 'Texto del Botón',
            type: 'string',
        })
    ],
    preview: {
        prepare() {
            return {
                title: 'Sección Certificaciones (Home)',
            }
        }
    }
})
