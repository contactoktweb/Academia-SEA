"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { Resend } from "resend";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function createAnnouncement(data: {
  title: string;
  content: string;
  audience: string;
  pdfUrl?: string;
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "No autorizado" };
    }

    const announcement = await db.announcement.create({
      data: {
        title: data.title,
        content: data.content,
        audience: data.audience,
        pdfUrl: data.pdfUrl,
        authorId: session.user.id,
      },
    });

    // Enviar correo a la audiencia seleccionada dentro de la misma sede
    const authorSede = (session.user as any)?.sede || "SEAAUTLAN";
    let targetUsers = [];
    if (data.audience === "ALL") {
      targetUsers = await db.user.findMany({ where: { isActive: true, sede: authorSede as any, deletedAt: null }, select: { email: true } });
    } else if (data.audience === "STUDENTS") {
      targetUsers = await db.user.findMany({ where: { role: "STUDENT", isActive: true, sede: authorSede as any, deletedAt: null }, select: { email: true } });
    } else if (data.audience === "TEACHERS") {
      targetUsers = await db.user.findMany({ where: { role: "TEACHER", isActive: true, sede: authorSede as any, deletedAt: null }, select: { email: true } });
    }

    const emails = targetUsers.map(u => u.email).filter(Boolean) as string[];

    if (emails.length > 0 && process.env.RESEND_API_KEY) {
      // Resend permite enviar a hasta 50 destinatarios a la vez en BCC, o usar el endpoint de Batch.
      // Aquí haremos un envío simple por propósitos de prueba/configuración.
      try {
        await resend.emails.send({
          from: "Academia SEA <no-reply@kytcode.lat>", // Requiere un dominio verificado en Resend
          to: emails,
          subject: `Nuevo Anuncio: ${data.title}`,
          html: `<div style="font-family: sans-serif; padding: 20px;">
            <h2>${data.title}</h2>
            <p>${data.content}</p>
            ${data.pdfUrl ? `<p><a href="https://www.kytcode.lat${data.pdfUrl}">Ver documento adjunto</a></p>` : ""}
            <br/>
            <p><small>Academia SEA - Mensaje automático</small></p>
          </div>`
        });
      } catch (emailError) {
        console.error("Error sending email via Resend:", emailError);
        // No bloqueamos la creación del anuncio si falla el correo
      }
    }

    revalidatePath("/dashboard/anuncios");
    return { success: true, data: announcement };
  } catch (error) {
    console.error("Error creating announcement:", error);
    return { success: false, error: "Error al crear anuncio" };
  }
}

export async function uploadPdfAction(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) return { success: false, error: "No se encontró ningún archivo" };

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), "public", "uploads", "anuncios");
    await mkdir(uploadsDir, { recursive: true });

    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
    const filepath = path.join(uploadsDir, filename);

    await writeFile(filepath, buffer);

    return { success: true, url: `/uploads/anuncios/${filename}` };
  } catch (error) {
    console.error("Error uploading file:", error);
    return { success: false, error: "Error al subir el archivo" };
  }
}
