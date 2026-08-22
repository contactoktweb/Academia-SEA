import { auth } from "@/lib/auth"
import { notFound, redirect } from "next/navigation"
import { db as prisma } from "@/lib/db"
import { LiveKitRoomWrapper } from "./LiveKitRoomWrapper"
import { DashboardTopBar } from "@/components/dashboard/sidebar"
import { Role } from "@prisma/client"

export default async function VirtualClassRoomPage({
  params
}: {
  params: Promise<{ groupId: string }>
}) {
  const resolvedParams = await params
  const session = await auth()
  
  if (!session || !session.user) {
    redirect("/auth/login")
  }

  // Validate group exists and user has access
  const group = await prisma.group.findUnique({
    where: { id: resolvedParams.groupId, modality: 'VIRTUAL', isActive: true }
  })

  if (!group) {
    notFound()
  }

  // Very basic authorization based on role
  // An admin can enter any room.
  // A teacher can enter if they are assigned.
  // A student can enter if they are enrolled.
  const role = session.user.role as Role
  let hasAccess = false
  let isTeacher = false
  let courseAssignmentId = undefined

  if (role === Role.ADMIN) {
    hasAccess = true
  } else if (role === Role.TEACHER) {
    const profile = await prisma.teacherProfile.findUnique({ where: { userId: session.user.id } })
    if (profile) {
      const assignment = await prisma.courseAssignment.findFirst({
        where: { groupId: group.id, teacherId: profile.id }
      })
      if (assignment) {
        hasAccess = true
        isTeacher = true
        courseAssignmentId = assignment.id
      }
    }
  } else if (role === Role.STUDENT) {
    const profile = await prisma.studentProfile.findUnique({ 
      where: { userId: session.user.id },
      include: { payments: true, user: true }
    })
    if (profile) {
      const hasPaidAtLeastOne = profile.payments.some((p) => p.status === "PAID");
      const isPaidAndActive = profile.user.isActive && profile.isActive && (hasPaidAtLeastOne || profile.payments.length === 0);

      if (isPaidAndActive) {
        const enrollment = await prisma.studentEnrollment.findFirst({
          where: { groupId: group.id, studentId: profile.id, status: 'ACTIVE' }
        })
        if (enrollment) hasAccess = true
      }
    }
  }

  if (!hasAccess) {
    return (
      <div className="flex h-screen flex-col bg-slate-50 dark:bg-slate-900">
        <DashboardTopBar title="Acceso Denegado" />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-2">No autorizado</h1>
            <p className="text-slate-600">No tienes permisos para acceder a esta clase virtual.</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col bg-black">
      {/* 
        We use a dark theme for the video conference area.
        The wrapper takes full height.
      */}
      <div className="flex h-14 items-center justify-between bg-slate-950 px-4 text-white border-b border-slate-800">
        <div className="font-semibold">{group.name} - Sala Virtual</div>
        <div className="text-xs text-slate-400">LiveKit</div>
      </div>
      <main className="flex-1 overflow-hidden relative">
        <LiveKitRoomWrapper 
          roomName={group.id} 
          isTeacher={isTeacher || role === Role.ADMIN}
          courseAssignmentId={courseAssignmentId}
        />
      </main>
    </div>
  )
}
