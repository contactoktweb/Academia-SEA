import { defineField, defineType } from 'sanity'
import { BookOpen } from 'lucide-react'

export const aboutHero = defineType({
    name: 'aboutHero',
    title: 'Nuestra Escuela - Hero',
    type: 'document',
    icon: BookOpen,
    fields: [
        defineField({
            name: 'badge',
            title: 'Etiqueta superior (Badge)',
            type: 'string',
            description: 'Ej: Desde 2008 en Jalisco',
        }),
        defineField({
            name: 'titulo',
            title: 'Título Principal',
            type: 'string',
            description: 'Ej: Donde aprender inglés',
        }),
        defineField({
            name: 'tituloResaltado',
            title: 'Título Resaltado (Acento)',
            type: 'string',
            description: 'Ej: transforma vidas.',
        }),
        defineField({
            name: 'subtitulo',
            title: 'Subtítulo / Introducción',
            type: 'text',
            rows: 3,
            description: 'Texto largo descriptivo debajo del título.',
        }),
    ],
    preview: {
        prepare() {
            return {
                title: 'Nosotros - Hero',
            }
        }
    }
})
