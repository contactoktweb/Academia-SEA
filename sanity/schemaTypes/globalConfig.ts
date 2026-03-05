import { defineField, defineType } from 'sanity'

export const globalConfig = defineType({
    name: 'globalConfig',
    title: 'Configuracion Global',
    type: 'document',
    fields: [
        defineField({
            name: 'logo',
            title: 'Logo Principal',
            description: 'El logo que aparecerá en la cabecera (Header) de la página web.',
            type: 'image',
            options: {
                hotspot: true,
            },
            fields: [
                defineField({
                    name: 'alt',
                    type: 'string',
                    title: 'Texto Alternativo (Alt Text)',
                    description: 'Descripción breve del logo para accesibilidad y SEO (ej. "Logo de Academia SEA").',
                    validation: (Rule) => Rule.required(),
                })
            ]
        }),
        defineField({
            name: 'logoFooter',
            title: 'Logo del Pie de Página (Opcional)',
            description: 'Un logo alternativo (ej. en blanco/negro) para usar en el pie de página. Si no se provee, se usará el principal.',
            type: 'image',
            options: {
                hotspot: true,
            },
            fields: [
                defineField({
                    name: 'alt',
                    type: 'string',
                    title: 'Texto Alternativo (Alt Text)',
                    validation: (Rule) => Rule.required(),
                })
            ]
        }),
        defineField({
            name: 'emailContacto',
            title: 'Correo de Contacto Principal',
            description: 'El correo electrónico donde recibirán consultas generales (ej. info@academiasea.com).',
            type: 'string',
            validation: (Rule) => Rule.regex(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, { name: 'email', invert: false }),
        }),
        defineField({
            name: 'telefonoContacto',
            title: 'Teléfono de Contacto Principal',
            description: 'Número de teléfono principal para llamadas o atención al cliente.',
            type: 'string',
        }),
        defineField({
            name: 'whatsapp',
            title: 'Número de WhatsApp',
            description: 'Número de WhatsApp (con código de país, ej: +523213875702). Se usará para los botones flotantes o enlaces directos de chat.',
            type: 'string',
        }),
        defineField({
            name: 'direccion',
            title: 'Dirección Física',
            description: 'Dirección física de la academia, que se mostrará en el pie de página o la sección de contacto.',
            type: 'text',
            rows: 3,
        }),
        defineField({
            name: 'redesSociales',
            title: 'Redes Sociales',
            description: 'Agrega los enlaces a las distintas redes sociales de la academia.',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'plataforma',
                            title: 'Plataforma',
                            type: 'string',
                            options: {
                                list: [
                                    { title: 'Facebook', value: 'facebook' },
                                    { title: 'Instagram', value: 'instagram' },
                                    { title: 'Twitter / X', value: 'twitter' },
                                    { title: 'LinkedIn', value: 'linkedin' },
                                    { title: 'YouTube', value: 'youtube' },
                                    { title: 'TikTok', value: 'tiktok' },
                                ],
                            },
                            validation: (Rule) => Rule.required(),
                        }),
                        defineField({
                            name: 'url',
                            title: 'URL o Enlace (Link)',
                            description: 'El enlace completo al perfil (ej. https://www.facebook.com/AcademiaSEA).',
                            type: 'url',
                            validation: (Rule) => Rule.required().uri({ scheme: ['http', 'https'] }),
                        }),
                    ],
                    preview: {
                        select: {
                            title: 'plataforma',
                            subtitle: 'url',
                        },
                    },
                },
            ],
        }),
    ],
    preview: {
        prepare() {
            return {
                title: 'Configuracion Global de la Web',
            }
        }
    }
})
