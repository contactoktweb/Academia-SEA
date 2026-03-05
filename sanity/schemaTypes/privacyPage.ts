import { defineField, defineType } from 'sanity'
import { ShieldCheck, FileText } from 'lucide-react'

export const privacyPage = defineType({
    name: 'privacyPage',
    title: 'Página de Privacidad',
    type: 'document',
    icon: ShieldCheck,
    groups: [
        { name: 'hero', title: 'Banner Principal' },
        { name: 'secciones', title: 'Secciones del Aviso' },
        { name: 'footer', title: 'Nota Final' },
    ],
    fields: [
        defineField({
            name: 'hero',
            title: 'Sección Hero',
            type: 'object',
            group: 'hero',
            fields: [
                defineField({ name: 'badge', title: 'Etiqueta (Badge)', type: 'string' }),
                defineField({ name: 'titulo', title: 'Título Principal', type: 'string' }),
                defineField({ name: 'subtitulo', title: 'Subtítulo', type: 'string' }),
            ],
        }),

        defineField({
            name: 'secciones',
            title: 'Secciones del Aviso',
            type: 'array',
            group: 'secciones',
            of: [
                {
                    type: 'object',
                    title: 'Sección',
                    icon: FileText,
                    fields: [
                        defineField({ name: 'id', title: 'Identificador (ej: A, B, C...)', type: 'string' }),
                        defineField({ name: 'titulo', title: 'Título de la Sección', type: 'string' }),
                        defineField({
                            name: 'contenido',
                            title: 'Contenido',
                            type: 'array',
                            of: [{ type: 'block' }],
                            description: 'Texto del contenido. Puede incluir listas y negritas.'
                        }),
                    ],
                    preview: {
                        select: {
                            title: 'titulo',
                            subtitle: 'id',
                        },
                        prepare({ title, subtitle }) {
                            return {
                                title: `${subtitle}. ${title}`,
                                media: FileText,
                            }
                        }
                    }
                }
            ]
        }),

        defineField({
            name: 'notaFinal',
            title: 'Nota Final',
            type: 'object',
            group: 'footer',
            fields: [
                defineField({ name: 'fechaActualizacion', title: 'Última Actualización', type: 'string', description: 'Ej: Enero 2021' }),
                defineField({ name: 'texto', title: 'Texto informativo', type: 'text', rows: 3 }),
            ],
        }),
    ],
    preview: {
        prepare() {
            return { title: 'Aviso de Privacidad' }
        }
    }
})
