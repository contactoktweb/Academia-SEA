import { defineField, defineType } from 'sanity'
import { PhoneCall, MapPin, Download, CheckSquare } from 'lucide-react'

export const contactPage = defineType({
    name: 'contactPage',
    title: 'Página de Contacto',
    type: 'document',
    icon: PhoneCall,
    groups: [
        { name: 'hero', title: 'Banner Principal' },
        { name: 'proceso', title: 'Proceso de Inscripción' },
        { name: 'requisitos', title: 'Requisitos' },
        { name: 'sedes', title: 'Nuestras Sedes' },
        { name: 'descargas', title: 'Descargas' },
        { name: 'cta', title: 'Llamado a la Acción' },
    ],
    fields: [
        // Hero Section
        defineField({
            name: 'hero',
            title: 'Sección Hero',
            type: 'object',
            group: 'hero',
            fields: [
                defineField({ name: 'badge', title: 'Etiqueta (Badge)', type: 'string' }),
                defineField({ name: 'titulo', title: 'Título General', type: 'string' }),
                defineField({ name: 'tituloResaltado', title: 'Parte del título a resaltar (Color coral)', type: 'string' }),
                defineField({ name: 'subtitulo', title: 'Subtítulo', type: 'text', rows: 3 }),
            ],
        }),

        // Proceso Section
        defineField({
            name: 'proceso',
            title: 'Proceso de Inscripción',
            type: 'object',
            group: 'proceso',
            fields: [
                defineField({ name: 'badge', title: 'Etiqueta Pequeña', type: 'string' }),
                defineField({ name: 'titulo', title: 'Título de Sección', type: 'string' }),
                defineField({
                    name: 'pasos',
                    title: 'Pasos del Proceso',
                    type: 'array',
                    of: [
                        {
                            type: 'object',
                            title: 'Paso',
                            icon: CheckSquare,
                            fields: [
                                defineField({ name: 'paso', title: 'Número o texto corto de paso (ej: 1, 2, 3)', type: 'string' }),
                                defineField({ name: 'titulo', title: 'Título', type: 'string' }),
                                defineField({ name: 'descripcion', title: 'Descripción', type: 'text', rows: 2 }),
                            ],
                            preview: {
                                select: {
                                    title: 'titulo',
                                    subtitle: 'descripcion',
                                }
                            }
                        }
                    ]
                })
            ],
        }),

        // Requisitos Section
        defineField({
            name: 'requisitos',
            title: 'Requisitos de Inscripción',
            type: 'object',
            group: 'requisitos',
            fields: [
                defineField({ name: 'titulo', title: 'Título', type: 'string' }),
                defineField({
                    name: 'lista',
                    title: 'Lista de Requisitos',
                    type: 'array',
                    of: [{ type: 'string' }]
                })
            ],
        }),

        // Sedes Section
        defineField({
            name: 'sedes',
            title: 'Nuestras Sedes / Sucursales',
            type: 'object',
            group: 'sedes',
            fields: [
                defineField({ name: 'badge', title: 'Etiqueta Pequeña', type: 'string' }),
                defineField({ name: 'titulo', title: 'Título de Sección', type: 'string' }),
                defineField({
                    name: 'ubicaciones',
                    title: 'Ubicaciones',
                    type: 'array',
                    of: [
                        {
                            type: 'object',
                            title: 'Ubicación',
                            icon: MapPin,
                            fields: [
                                defineField({ name: 'nombre', title: 'Nombre de la Sede', type: 'string' }),
                                defineField({ name: 'telefono', title: 'Número Telefónico Público', type: 'string' }),
                                defineField({
                                    name: 'whatsapp',
                                    title: 'Número de WhatsApp',
                                    type: 'string',
                                    description: 'Solo números, incluyendo código de país (ej. 523213875702)',
                                }),
                                defineField({ name: 'horarios', title: 'Horarios de Atención', type: 'string' }),
                            ],
                            preview: {
                                select: {
                                    title: 'nombre',
                                    subtitle: 'telefono'
                                }
                            }
                        }
                    ]
                })
            ],
        }),

        // Descargas Section
        defineField({
            name: 'descargas',
            title: 'Descargas (Calendario y Reglamento)',
            type: 'object',
            group: 'descargas',
            fields: [
                defineField({
                    name: 'calendario',
                    title: 'Calendario Escolar',
                    type: 'object',
                    options: { collapsible: true, collapsed: false },
                    fields: [
                        defineField({ name: 'titulo', title: 'Título', type: 'string' }),
                        defineField({ name: 'descripcion', title: 'Descripción', type: 'text', rows: 2 }),
                        defineField({ name: 'textoBoton', title: 'Texto del Botón', type: 'string' }),
                        defineField({
                            name: 'archivo',
                            title: 'Archivo PDF (Opcional)',
                            type: 'file',
                            options: { accept: '.pdf' }
                        }),
                    ]
                }),
                defineField({
                    name: 'reglamento',
                    title: 'Reglamento Escolar',
                    type: 'object',
                    options: { collapsible: true, collapsed: false },
                    fields: [
                        defineField({ name: 'titulo', title: 'Título', type: 'string' }),
                        defineField({ name: 'descripcion', title: 'Descripción', type: 'text', rows: 2 }),
                        defineField({ name: 'textoBoton', title: 'Texto del Botón', type: 'string' }),
                        defineField({
                            name: 'archivo',
                            title: 'Archivo PDF (Opcional)',
                            type: 'file',
                            options: { accept: '.pdf' }
                        }),
                    ]
                })
            ],
        }),

        // CTA Final
        defineField({
            name: 'ctaFinal',
            title: 'Call to Action Final',
            type: 'object',
            group: 'cta',
            fields: [
                defineField({ name: 'titulo', title: 'Título', type: 'string' }),
                defineField({ name: 'descripcion', title: 'Descripción', type: 'text', rows: 3 }),
                defineField({ name: 'textoBoton', title: 'Texto del botón de acción', type: 'string' }),
            ],
        }),
    ],
    preview: {
        prepare() {
            return {
                title: 'Página de Contacto',
            }
        }
    }
})
