import { defineField, defineType } from 'sanity'

export const leadSubmission = defineType({
  name: 'leadSubmission',
  title: 'Prospectos y Leads (Hero)',
  type: 'document',
  fields: [
    defineField({
      name: 'firstName',
      title: 'Nombre',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'lastName',
      title: 'Apellido',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'fullName',
      title: 'Nombre Completo',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Correo Electrónico',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'country',
      title: 'País',
      type: 'string',
      initialValue: 'México',
    }),
    defineField({
      name: 'state',
      title: 'Estado / Departamento / Región',
      type: 'string',
    }),
    defineField({
      name: 'phoneType',
      title: 'Tipo de Teléfono',
      type: 'string',
      options: {
        list: [
          { title: '📱 Celular', value: 'Celular' },
          { title: '☎️ Fijo', value: 'Fijo' },
        ],
      },
      initialValue: 'Celular',
    }),
    defineField({
      name: 'phone',
      title: 'Número de Teléfono',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'target',
      title: '¿Para quién es el curso?',
      type: 'string',
      options: {
        list: [
          { title: '👤 Para mí', value: 'Para mí' },
          { title: '👶 Para mi hijo/a', value: 'Para mi hijo/a' },
        ],
      },
      initialValue: 'Para mí',
    }),
    defineField({
      name: 'ageRange',
      title: 'Rango de Edad',
      type: 'string',
    }),
    defineField({
      name: 'source',
      title: 'Origen del Registro',
      type: 'string',
      initialValue: 'Hero Principal Web',
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
      name: 'submittedAt',
      title: 'Fecha y Hora de Registro',
      type: 'datetime',
    }),
    defineField({
      name: 'notes',
      title: 'Notas Internas del Asesor / Administrador',
      type: 'text',
      rows: 4,
    }),
  ],
  preview: {
    select: {
      firstName: 'firstName',
      lastName: 'lastName',
      phone: 'phone',
      email: 'email',
      target: 'target',
      ageRange: 'ageRange',
      status: 'status',
      date: 'submittedAt',
    },
    prepare({ firstName, lastName, phone, email, target, ageRange, status, date }) {
      const name = [firstName, lastName].filter(Boolean).join(' ') || 'Prospecto sin nombre'
      const statusIcons: Record<string, string> = {
        pendiente: '🟡 Pendiente',
        en_seguimiento: '🔵 En Seguimiento',
        inscrito: '🟢 Inscrito',
        cancelado: '🔴 Cancelado',
      }
      const fechaStr = date ? new Date(date).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }) : ''

      return {
        title: `${name} (${target || 'Para mí'})`,
        subtitle: `${phone || email || 'Sin contacto'} | ${ageRange || 'Edad N/A'} | ${statusIcons[status] || status || 'Pendiente'} | ${fechaStr}`,
      }
    },
  },
})
