import { defineField, defineType } from 'sanity'

export const contactSubmission = defineType({
  name: 'contactSubmission',
  title: 'Mensajes de Contacto (Página Contacto)',
  type: 'document',
  fields: [
    defineField({
      name: 'fullName',
      title: 'Nombre Completo',
      type: 'string',
      validation: (Rule) => Rule.required().min(2),
    }),
    defineField({
      name: 'email',
      title: 'Correo Electrónico',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'phone',
      title: 'Teléfono / WhatsApp',
      type: 'string',
      validation: (Rule) => Rule.required().min(6),
    }),
    defineField({
      name: 'sedeInteres',
      title: 'Sede de Interés',
      type: 'string',
      options: {
        list: [
          { title: '📍 Sede Autlán', value: 'Autlán' },
          { title: '📍 Sede El Grullo', value: 'El Grullo' },
          { title: '📍 Sede Unión de Tula', value: 'Unión de Tula' },
          { title: '💻 Modalidad En Línea (Virtual)', value: 'En Línea' },
          { title: '❓ Información General', value: 'General' },
        ],
      },
      initialValue: 'Autlán',
    }),
    defineField({
      name: 'subject',
      title: 'Asunto / Motivo de Contacto',
      type: 'string',
      options: {
        list: [
          { title: '📚 Información de Cursos', value: 'Cursos' },
          { title: '💰 Costos y Planes de Pago', value: 'Costos' },
          { title: '📝 Proceso de Inscripción', value: 'Inscripción' },
          { title: '🏆 Certificaciones (TOEFL / CENNI)', value: 'Certificaciones' },
          { title: '🏢 Convenios Corporativos / Familias', value: 'Convenios' },
          { title: '💬 Otra Consulta', value: 'Otro' },
        ],
      },
      initialValue: 'Cursos',
    }),
    defineField({
      name: 'message',
      title: 'Mensaje o Pregunta',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required().min(5),
    }),
    defineField({
      name: 'source',
      title: 'Origen del Registro',
      type: 'string',
      initialValue: 'Página de Contacto (/contacto)',
    }),
    defineField({
      name: 'status',
      title: 'Estado de Atención',
      type: 'string',
      options: {
        list: [
          { title: '🟡 Pendiente por Contactar', value: 'pendiente' },
          { title: '🔵 Contactado / En Seguimiento', value: 'en_seguimiento' },
          { title: '🟢 Atendido / Resuelto', value: 'resuelto' },
          { title: '🔴 Archivado', value: 'archivado' },
        ],
      },
      initialValue: 'pendiente',
    }),
    defineField({
      name: 'submittedAt',
      title: 'Fecha y Hora de Recepción',
      type: 'datetime',
    }),
    defineField({
      name: 'notes',
      title: 'Notas Internas del Asesor / Administrador',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: {
      fullName: 'fullName',
      phone: 'phone',
      email: 'email',
      sede: 'sedeInteres',
      subject: 'subject',
      status: 'status',
      date: 'submittedAt',
    },
    prepare({ fullName, phone, email, sede, subject, status, date }) {
      const statusIcons: Record<string, string> = {
        pendiente: '🟡 Pendiente',
        en_seguimiento: '🔵 En Seguimiento',
        resuelto: '🟢 Resuelto',
        archivado: '🔴 Archivado',
      }
      const fechaStr = date
        ? new Date(date).toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
        : ''

      return {
        title: `${fullName || 'Contacto sin nombre'} [${sede || 'Sede N/A'}]`,
        subtitle: `${subject || 'Consulta'} | ${phone || email || 'Sin datos'} | ${statusIcons[status] || status || 'Pendiente'} | ${fechaStr}`,
      }
    },
  },
})
