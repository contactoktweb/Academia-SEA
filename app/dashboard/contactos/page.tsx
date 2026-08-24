import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { DashboardTopBar } from "@/components/dashboard/sidebar";
import { getContactAndLeadSubmissions } from "./actions";
import { ContactSubmissionsClient } from "@/components/dashboard/contact-submissions-client";

export const metadata = {
  title: "Formularios de Contacto e Inicio | Academia SEA",
  description: "Gestión de solicitudes del formulario de inicio y mensajes de la página de contacto",
};

export const dynamic = "force-dynamic";

export default async function ContactosDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const userRole = (session.user as any).role;
  if (userRole !== "ADMIN") {
    redirect("/dashboard");
  }

  const { contacts, leads } = await getContactAndLeadSubmissions();

  return (
    <div className="flex flex-col gap-6">
      <DashboardTopBar title="Formularios de Contacto e Inicio" />
      <ContactSubmissionsClient contacts={contacts} leads={leads} />
    </div>
  );
}
