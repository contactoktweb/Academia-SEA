const fs = require('fs');

const pages = [
  { path: 'app/dashboard/asistencia/page.tsx', title: 'Asistencia Diaria' },
  { path: 'app/dashboard/boletas/page.tsx', title: 'Boletas y Reportes' },
  { path: 'app/dashboard/becas/page.tsx', title: 'Becas y Subsidios' },
  { path: 'app/dashboard/estados-cuenta/page.tsx', title: 'Estados de Cuenta' },
  { path: 'app/dashboard/mis-calificaciones/page.tsx', title: 'Mis Calificaciones' },
  { path: 'app/dashboard/mi-asistencia/page.tsx', title: 'Mi Asistencia' },
  { path: 'app/dashboard/mis-pagos/page.tsx', title: 'Mis Pagos e Historial' }
];

pages.forEach(p => {
  const dir = p.path.substring(0, p.path.lastIndexOf('/'));
  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
  }
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

console.log('Extra pages generated');
