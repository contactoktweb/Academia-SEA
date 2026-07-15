"use server";

import { db } from "@/lib/db";

export async function getDashboardMetrics() {
  try {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    // Fetch all required data concurrently
    const [
      activeStudents,
      monthlyPayments,
      pendingPayments,
      totalAttendances,
      presentAttendances,
      last6MonthsPayments,
      groups,
      allPaymentsCount
    ] = await Promise.all([
      db.user.count({
        where: { role: "STUDENT", isActive: true },
      }),
      db.payment.findMany({
        where: {
          status: "PAID",
          paidAt: { gte: firstDayOfMonth },
        },
        select: { amountPaid: true },
      }),
      db.payment.findMany({
        where: { status: { in: ["PENDING", "OVERDUE"] } },
        select: { amount: true },
      }),
      db.attendance.count(),
      db.attendance.count({ where: { status: "PRESENT" } }),
      db.payment.findMany({
        where: { status: "PAID", paidAt: { gte: sixMonthsAgo } },
        select: { paidAt: true, amountPaid: true },
      }),
      db.group.findMany({
        include: {
          _count: {
            select: { enrollments: true }
          }
        }
      }),
      db.payment.groupBy({
        by: ['status'],
        _count: true
      })
    ]);

    // Compute KPIs
    const monthlyRevenue = monthlyPayments.reduce((sum, p) => sum + Number(p.amountPaid || 0), 0);
    const totalPending = pendingPayments.reduce((sum, p) => sum + Number(p.amount), 0);
    const attendanceRate = totalAttendances > 0 ? (presentAttendances / totalAttendances) * 100 : 0;

    // --- GRÁFICOS ---
    
    // Agrupar por mes
    const revenueByMonthMap = new Map();
    // Iniciar el mapa con los últimos 6 meses en orden
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = d.toLocaleString('es-ES', { month: 'short' });
      // capitalize
      const capitalized = monthName.charAt(0).toUpperCase() + monthName.slice(1);
      revenueByMonthMap.set(capitalized, 0);
    }

    last6MonthsPayments.forEach(p => {
      if (p.paidAt) {
        const m = p.paidAt.toLocaleString('es-ES', { month: 'short' });
        const capitalized = m.charAt(0).toUpperCase() + m.slice(1);
        if (revenueByMonthMap.has(capitalized)) {
          revenueByMonthMap.set(capitalized, revenueByMonthMap.get(capitalized) + Number(p.amountPaid || 0));
        }
      }
    });

    const revenueChartData = Array.from(revenueByMonthMap, ([name, value]) => ({ name, value }));

    let beginner = 0, intermediate = 0, advanced = 0;
    groups.forEach(g => {
      if (g.level === "Beginner") beginner += g._count.enrollments;
      else if (g.level === "Intermediate") intermediate += g._count.enrollments;
      else if (g.level === "Advanced") advanced += g._count.enrollments;
    });

    const studentLevelData = [
      { name: "Principiantes", value: beginner, fill: "#3b82f6" },
      { name: "Intermedios", value: intermediate, fill: "#eab308" },
      { name: "Avanzados", value: advanced, fill: "#ef4444" },
    ].filter(item => item.value > 0);

    let paidCount = 0, pendingCount = 0, overdueCount = 0;
    allPaymentsCount.forEach(p => {
      if (p.status === "PAID") paidCount += p._count;
      else if (p.status === "PENDING") pendingCount += p._count;
      else if (p.status === "OVERDUE") overdueCount += p._count;
    });

    const paymentStatusData = [
      { name: "Pagados", value: paidCount, fill: "#22c55e" },
      { name: "Pendientes", value: pendingCount, fill: "#f59e0b" },
      { name: "Vencidos", value: overdueCount, fill: "#ef4444" },
    ].filter(item => item.value > 0);


    return {
      success: true,
      data: {
        kpis: {
          activeStudents,
          monthlyRevenue,
          totalPending,
          attendanceRate,
        },
        charts: {
          revenueChartData,
          studentLevelData,
          paymentStatusData,
        }
      }
    };
  } catch (error) {
    console.error("Error fetching metrics:", error);
    return { success: false, error: "No se pudieron cargar las métricas" };
  }
}
