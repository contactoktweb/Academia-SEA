import { DashboardTopBar } from "@/components/dashboard/sidebar"
import { MessagesClient } from "@/components/dashboard/messages-client"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function MensajesPage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect("/login")
  }

  return (
    <div className="flex flex-col gap-6">
      <DashboardTopBar title="Mensajería Interna" />
      <MessagesClient currentUserId={session.user.id} />
    </div>
  )
}
