const fs = require('fs');

const pages = [
  { path: 'app/dashboard/page.tsx', title: 'Panel Principal' },
  { path: 'app/dashboard/metricas/page.tsx', title: 'Métricas' },
  { path: 'app/dashboard/alumnos/page.tsx', title: 'Gestión de Alumnos' },
  { path: 'app/dashboard/familias/page.tsx', title: 'Gestión de Familias' },
  { path: 'app/dashboard/profesores/page.tsx', title: 'Directorio de Profesores' },
  { path: 'app/dashboard/cursos/page.tsx', title: 'Grupos y Cursos' },
  { path: 'app/dashboard/calificaciones/page.tsx', title: 'Calificaciones y Boletas' },
  { path: 'app/dashboard/evaluaciones/page.tsx', title: 'Exámenes y Evaluaciones' },
  { path: 'app/dashboard/pagos/page.tsx', title: 'Finanzas y Pagos' },
  { path: 'app/dashboard/calendario/page.tsx', title: 'Calendario de Actividades' },
  { path: 'app/dashboard/mensajes/page.tsx', title: 'Mensajería Interna' },
  { path: 'app/dashboard/anuncios/page.tsx', title: 'Tablero de Anuncios' },
  { path: 'app/dashboard/configuracion/page.tsx', title: 'Configuración del Sistema' },
];

pages.forEach(p => {
  const content = `import { DashboardTopBar } from "@/components/dashboard/sidebar"

export default function Page() {
  return (
    <div className="flex flex-col gap-6">
      <DashboardTopBar title="${p.title}" />
      <div className="flex flex-col rounded-lg border bg-card p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">${p.title}</h2>
        <p className="text-muted-foreground">Esta sección está lista para su desarrollo.</p>
      </div>
    </div>
  )
}
`;
  fs.writeFileSync(p.path, content);
});

console.log('Pages generated');
