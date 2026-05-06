import { auth } from "@/lib/auth"
import { DashboardTopBar } from "@/components/dashboard/sidebar"
import { Suspense } from "react"
import { DashboardOverviewStats } from "@/components/dashboard/overview-stats"
import { AdminDashboard } from "@/components/dashboard/roles/admin-dashboard"
import { TeacherDashboard } from "@/components/dashboard/roles/teacher-dashboard"
import { StudentDashboard } from "@/components/dashboard/roles/student-dashboard"

export default async function DashboardGeneralPanel() {
  const session = await auth()
  const role = session?.user?.role

  if (role === 'TEACHER') {
    return <TeacherDashboard user={session.user} />
  }

  if (role === 'STUDENT') {
    return <StudentDashboard user={session.user} />
  }

  return <AdminDashboard />
}
