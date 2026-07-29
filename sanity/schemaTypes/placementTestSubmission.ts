import { defineField, defineType } from 'sanity'

export const placementTestSubmission = defineType({
  name: 'placementTestSubmission',
  title: 'Exámenes de Ubicación',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre Completo del Aspirante',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'ageCategory',
      title: 'Edad / Categoría',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Correo Electrónico',
      type: 'string',
    }),
    defineField({
      name: 'phone',
      title: 'Teléfono / WhatsApp',
      type: 'string',
    }),
    defineField({
      name: 'sede',
      title: 'Sede de Interés',
      type: 'string',
    }),
    defineField({
      name: 'score',
      title: 'Puntaje Obtenido (Aciertos)',
      type: 'number',
    }),
    defineField({
      name: 'totalQuestions',
      title: 'Total de Preguntas',
      type: 'number',
    }),
    defineField({
      name: 'percentage',
      title: 'Porcentaje (%)',
      type: 'number',
    }),
    defineField({
      name: 'level',
      title: 'Nivel Diagnóstico Asignado (MCER)',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Diagnóstico Sugerido',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'submittedAt',
      title: 'Fecha y Hora de Realización',
      type: 'datetime',
    }),
    defineField({
      name: 'status',
      title: 'Estado de Atención',
      type: 'string',
      options: {
        list: [
          { title: '🟡 Pendiente por Contactar', value: 'pendiente' },
          { title: '🔵 Contactado / En Seguimiento', value: 'en_seguimiento' },
          { title: '🟢 Inscrito en Curso', value: 'inscrito' },
          { title: '🔴 Cancelado / No Interesado', value: 'cancelado' },
        ],
      },
      initialValue: 'pendiente',
    }),
    defineField({
      name: 'notes',
      title: 'Notas Internas del Administrador',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'level',
      sede: 'sede',
      date: 'submittedAt',
    },
    prepare({ title, subtitle, sede, date }) {
      const fechaStr = date ? new Date(date).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) : '';
      return {
        title: title || 'Sin Nombre',
        subtitle: `${subtitle || 'Nivel N/A'} | Sede: ${sede || 'N/A'} | ${fechaStr}`,
      }
    },
  },
})
