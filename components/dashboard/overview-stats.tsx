import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, BookOpen, CreditCard, Users } from "lucide-react";

export async function DashboardOverviewStats() {
  // En una implementación real, estas consultas tendrían filtros de fechas, etc.
  const [studentCount, courseCount, teacherCount, payments] = await Promise.all([
    db.studentProfile.count({ where: { isActive: true } }),
    db.course.count({ where: { isActive: true } }),
    db.teacherProfile.count({ where: { isActive: true } }),
    db.payment.findMany({
      select: { amount: true, amountPaid: true, status: true }
    })
  ]);

  const totalAmount = payments.reduce((sum, p) => sum + parseFloat(String(p.amount)), 0);
  const paidAmount = payments.filter((p) => p.status === "PAID").reduce((sum, p) => sum + parseFloat(String(p.amountPaid || 0)), 0);
  const collectionRate = totalAmount > 0 ? ((paidAmount / totalAmount) * 100).toFixed(0) : 0;

  const stats = [
    {
      title: "Alumnos Activos",
      value: studentCount,
      icon: GraduationCap,
      description: "Estudiantes matriculados",
      color: "text-blue-600"
    },
    {
      title: "Cursos y Grupos",
      value: courseCount,
      icon: BookOpen,
      description: "Cursos activos",
      color: "text-purple-600"
    },
    {
      title: "Profesores",
      value: teacherCount,
      icon: Users,
      description: "Plantilla docente",
      color: "text-orange-600"
    },
    {
      title: "Recaudación",
      value: `${collectionRate}%`,
      icon: CreditCard,
      description: "De la meta mensual",
      color: "text-green-600"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="overflow-hidden transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-slate-50/50 dark:bg-slate-900/50">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
