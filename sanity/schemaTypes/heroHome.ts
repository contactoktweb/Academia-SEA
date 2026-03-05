import { defineField, defineType } from 'sanity'

export const heroHome = defineType({
    name: 'heroHome',
    title: 'Hero - Inicio',
    type: 'document',
    fields: [
        defineField({
            name: 'badge',
            title: 'Texto del Badge',
            type: 'string',
            description: 'Pequeño texto superior (ej: "Institución Certificada").',
        }),
        defineField({
            name: 'tituloPrincipal',
            title: 'Título Principal (H1)',
            type: 'text',
            rows: 3,
            description: 'El texto grande que define la página.',
        }),
        defineField({
            name: 'subtitulo',
            title: 'Subtítulo',
            type: 'text',
            rows: 2,
            description: 'Breve párrafo debajo del título.',
        }),
        defineField({
            name: 'ctaTexto',
            title: 'Texto del Botón (CTA)',
            type: 'string',
        }),
        defineField({
            name: 'ctaLink',
            title: 'Enlace del Botón',
            type: 'string',
            description: 'Ej: /contacto o una URL completa.',
        }),
        defineField({
            name: 'imagenSalon',
            title: 'Imagen de Salón (Izquierda)',
            type: 'image',
            options: { hotspot: true },
        }),
        defineField({
            name: 'imagenProfesor',
            title: 'Imagen de Profesor (Derecha)',
            type: 'image',
            options: { hotspot: true },
        }),
        defineField({
            name: 'anhosExperiencia',
            title: 'Años de Experiencia',
            type: 'string',
            description: 'Ej: 15+',
        })
    ],
    preview: {
        prepare() {
            return {
                title: 'Hero de Inicio',
            }
        }
    }
})
