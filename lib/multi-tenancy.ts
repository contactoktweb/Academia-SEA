import { auth } from "@/lib/auth";

export async function getSedeCondition() {
  const session = await auth();
  if (!session?.user || session.user.role === "ADMIN") {
    return {};
  }
  return { sede: session.user.sede as any };
}
