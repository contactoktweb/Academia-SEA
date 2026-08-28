import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function getSedeCondition() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { sede: "SEAAUTLAN" as any };
    }

    // Para administradores, consultar la sede activa en tiempo real de la base de datos
    // evitando que permanezcan datos cacheados o desfasados del token JWT
    if ((session.user as any).role === "ADMIN") {
      const dbUser = await db.user.findUnique({
        where: { id: session.user.id },
        select: { sede: true },
      });
      if (dbUser?.sede) {
        return { sede: dbUser.sede as any };
      }
    }

    if (session.user.sede) {
      return { sede: session.user.sede as any };
    }
  } catch (error) {
    console.error("Error in getSedeCondition:", error);
  }

  return { sede: "SEAAUTLAN" as any };
}

