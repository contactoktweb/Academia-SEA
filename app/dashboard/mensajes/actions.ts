"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { getSedeCondition } from "@/lib/multi-tenancy";
import { revalidatePath } from "next/cache";

export async function getContacts() {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "No autorizado" };

    const sedeCondition = await getSedeCondition();

    // Consultar únicamente usuarios activos y no eliminados
    const users = await db.user.findMany({
      where: {
        ...sedeCondition,
        id: { not: session.user.id },
        deletedAt: null,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: [
        { name: "asc" },
        { createdAt: "desc" },
      ],
    });

    // Deduplicar personas por nombre y correo para evitar registros duplicados
    const seen = new Set<string>();
    const uniqueUsers: Array<{
      id: string;
      name: string;
      email: string;
      role: any;
    }> = [];

    for (const u of users) {
      const key = `${u.name.trim().toLowerCase()}_${u.email.trim().toLowerCase()}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueUsers.push({
          id: u.id,
          name: u.name.trim(),
          email: u.email.trim(),
          role: u.role,
        });
      }
    }

    return { success: true, data: uniqueUsers };
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return { success: false, error: "Error al obtener contactos" };
  }
}

export async function getInbox() {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "No autorizado" };

    const messages = await db.message.findMany({
      where: { receiverId: session.user.id },
      include: {
        sender: {
          select: { name: true, email: true, role: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return { success: true, data: messages };
  } catch (error) {
    console.error("Error fetching inbox:", error);
    return { success: false, error: "Error al cargar bandeja de entrada" };
  }
}

export async function getOutbox() {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "No autorizado" };

    const messages = await db.message.findMany({
      where: { senderId: session.user.id },
      include: {
        receiver: {
          select: { name: true, email: true, role: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return { success: true, data: messages };
  } catch (error) {
    console.error("Error fetching outbox:", error);
    return { success: false, error: "Error al cargar enviados" };
  }
}

export async function sendMessage(receiverId: string, subject: string, content: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "No autorizado" };

    if (!receiverId || !content) {
      return { success: false, error: "Destinatario y contenido son requeridos" };
    }

    const message = await db.message.create({
      data: {
        senderId: session.user.id,
        receiverId,
        subject: subject || "Sin Asunto",
        content,
      }
    });

    revalidatePath("/dashboard/mensajes");
    return { success: true, data: message };
  } catch (error) {
    console.error("Error sending message:", error);
    return { success: false, error: "Error al enviar mensaje" };
  }
}

export async function markAsRead(messageId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "No autorizado" };

    const message = await db.message.findUnique({ where: { id: messageId } });
    if (!message || message.receiverId !== session.user.id) {
      return { success: false, error: "Mensaje no encontrado o sin permisos" };
    }

    if (!message.isRead) {
      await db.message.update({
        where: { id: messageId },
        data: { isRead: true, readAt: new Date() }
      });
      revalidatePath("/dashboard/mensajes");
    }

    return { success: true };
  } catch (error) {
    console.error("Error marking message as read:", error);
    return { success: false, error: "Error al marcar como leído" };
  }
}
