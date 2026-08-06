import { defineField, defineType } from 'sanity'

export const systemError = defineType({
  name: 'systemError',
  title: 'Errores del Sistema',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título / Resumen del Error',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'timestamp',
      title: 'Fecha y Hora del Error',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Ubicación / Módulo / Ruta',
      type: 'string',
      description: 'Ej: app/dashboard/alumnos/actions.ts o /api/auth/verify-register',
    }),
    defineField({
      name: 'severity',
      title: 'Nivel de Severidad',
      type: 'string',
      options: {
        list: [
          { title: '🔴 CRITICAL (Crítico)', value: 'CRITICAL' },
          { title: '🟠 ERROR (Error)', value: 'ERROR' },
          { title: '🟡 WARNING (Advertencia)', value: 'WARNING' },
          { title: '🔵 INFO (Información)', value: 'INFO' },
        ],
      },
      initialValue: 'ERROR',
    }),
    defineField({
      name: 'errorMessage',
      title: 'Mensaje Detallado del Error',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'stackTrace',
      title: 'Stack Trace / Detalle Técnico',
      type: 'text',
      rows: 6,
    }),
    defineField({
      name: 'userEmail',
      title: 'Usuario Afectado (Email)',
      type: 'string',
    }),
    defineField({
      name: 'url',
      title: 'URL / Endpoint de Origen',
      type: 'string',
    }),
    defineField({
      name: 'context',
      title: 'Contexto Adicional (JSON / Metadata)',
      type: 'text',
      rows: 4,
      description: 'Variables, parámetros o datos del entorno al momento del fallo',
    }),
    defineField({
      name: 'status',
      title: 'Estado del Reporte',
      type: 'string',
      options: {
        list: [
          { title: '🔴 Nuevo / Sin Revisar', value: 'NUEVO' },
          { title: '🟡 En Revisión', value: 'EN_REVISION' },
          { title: '🟢 Resuelto', value: 'RESUELTO' },
          { title: '⚪ Ignorado / Duplicado', value: 'IGNORADO' },
        ],
      },
      initialValue: 'NUEVO',
    }),
    defineField({
      name: 'notes',
      title: 'Notas de Corrección del Desarrollador',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      severity: 'severity',
      location: 'location',
      date: 'timestamp',
      status: 'status',
    },
    prepare({ title, severity, location, date, status }) {
      const fechaStr = date ? new Date(date).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }) : '';

      const badge = severity === 'CRITICAL' ? '🔴' : severity === 'ERROR' ? '🟠' : '🟡';
      const statusLabel = status === 'RESUELTO' ? '[RESUELTO]' : '[PENDIENTE]';

      return {
        title: `${badge} ${statusLabel} ${title || 'Error sin título'}`,
        subtitle: `Lugar: ${location || 'N/A'} | ${fechaStr}`,
      }
    },
  },
})
