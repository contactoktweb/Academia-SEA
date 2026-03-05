import { defineField, defineType } from 'sanity'
import { Smartphone, ClipboardList, MapPin, Download, MessageSquare } from 'lucide-react'

export const contactPage = defineType({
    name: 'contactPage',
    title: 'Página de Contacto',
    type: 'document',
    icon: Smartphone,
    fields: [
        // Hero Section
        defineField({
            name: 'hero',
            title: 'Sección Hero',
            type: 'object',
            fields: [
                defineField({ name: 'badge', title: 'Etiqueta (Badge)', type: 'string' }),
                defineField({ name: 'titulo', title: 'Título', type: 'string' }),
                defineField({ name: 'tituloResaltado', title: 'Título Resaltado', type: 'string' }),
                defineField({ name: 'subtitulo', title: 'Subtítulo', type: 'text', rows: 3 }),
            ]
        }),

        // Enrollment Process
        defineField({
            name: 'proceso',
            title: 'Proceso de Inscripción',
            type: 'object',
            icon: ClipboardList,
            fields: [
                defineField({ name: 'badge', title: 'Etiqueta (Badge)', type: 'string' }),
                defineField({ name: 'titulo', title: 'Título', type: 'string' }),
                defineField({
                    name: 'pasos',
                    title: 'Pasos',
                    type: 'array',
                    of: [
                        {
                            type: 'object',
                            icon: ClipboardList,
                            fields: [
                                defineField({ name: 'paso', title: 'Número de Paso', type: 'string' }),
                                defineField({ name: 'titulo', title: 'Título', type: 'string' }),
                                defineField({ name: 'descripcion', title: 'Descripción', type: 'text', rows: 2 }),
                                defineField({
                                    name: 'icono',
                                    title: 'Icono (Lucide)',
                                    type: 'string',
                                    description: 'Nombre del icono (ej: Phone, ClipboardList, FileText, Users)'
                                }),
                            ]
                        }
                    ]
                })
            ]
        }),

        // Requirements
        defineField({
            name: 'requisitos',
            title: 'Requisitos de Inscripción',
            type: 'object',
            fields: [
                defineField({ name: 'titulo', title: 'Título', type: 'string' }),
                defineField({
                    name: 'lista',
                    title: 'Lista de Requisitos',
                    type: 'array',
                    of: [{ type: 'string' }]
                })
            ]
        }),

        // Locations
        defineField({
            name: 'sedes',
            title: 'Sucursales / Ubicaciones',
            type: 'object',
            icon: MapPin,
            fields: [
                defineField({ name: 'badge', title: 'Etiqueta (Badge)', type: 'string' }),
                defineField({ name: 'titulo', title: 'Título', type: 'string' }),
                defineField({
                    name: 'ubicaciones',
                    title: 'Ubicaciones',
                    type: 'array',
                    of: [
                        {
                            type: 'object',
                            icon: MapPin,
                            fields: [
                                defineField({ name: 'nombre', title: 'Nombre de la Sede', type: 'string' }),
                                defineField({ name: 'telefono', title: 'Teléfono', type: 'string' }),
                                defineField({ name: 'whatsapp', title: 'WhatsApp (formato internacional ej: 52321...)', type: 'string' }),
                                defineField({ name: 'horarios', title: 'Horarios', type: 'string' }),
                                defineField({
                                    name: 'accent',
                                    title: 'Clase de Acento (Tailwind)',
                                    type: 'string',
                                    description: 'Ej: from-sea-blue to-sea-blue-light'
                                }),
                            ]
                        }
                    ]
                })
            ]
        }),

        // Downloads
        defineField({
            name: 'descargas',
            title: 'Documentos y Descargas',
            type: 'object',
            icon: Download,
            fields: [
                defineField({
                    name: 'calendario',
                    title: 'Calendario Escolar',
                    type: 'object',
                    fields: [
                        defineField({ name: 'titulo', title: 'Título', type: 'string' }),
                        defineField({ name: 'descripcion', title: 'Descripción', type: 'text', rows: 2 }),
                        defineField({ name: 'archivo', title: 'Archivo (URL o File)', type: 'file' }),
                        defineField({ name: 'textoBoton', title: 'Texto del Botón', type: 'string' }),
                    ]
                }),
                defineField({
                    name: 'reglamento',
                    title: 'Reglamento Escolar',
                    type: 'object',
                    fields: [
                        defineField({ name: 'titulo', title: 'Título', type: 'string' }),
                        defineField({ name: 'descripcion', title: 'Descripción', type: 'text', rows: 2 }),
                        defineField({ name: 'archivo', title: 'Archivo (URL o File)', type: 'file' }),
                        defineField({ name: 'textoBoton', title: 'Texto del Botón', type: 'string' }),
                    ]
                })
            ]
        }),

        // Final CTA
        defineField({
            name: 'ctaFinal',
            title: 'CTA Final',
            type: 'object',
            icon: MessageSquare,
            fields: [
                defineField({ name: 'titulo', title: 'Título', type: 'string' }),
                defineField({ name: 'descripcion', title: 'Descripción', type: 'text', rows: 2 }),
                defineField({ name: 'textoBoton', title: 'Texto del Botón', type: 'string' }),
            ]
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
