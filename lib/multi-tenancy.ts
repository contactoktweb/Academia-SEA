import { auth } from "@/lib/auth";

export async function getSedeCondition() {
  const session = await auth();
  if (!session?.user?.sede) {
    // Fallback safe condition if no session
    return { sede: "SEAAUTLAN" as any };
  }
  // Even ADMINs must be scoped to their current active sede
  return { sede: session.user.sede as any };
}
