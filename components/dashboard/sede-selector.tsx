"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { MapPin, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateUserActiveSede } from "@/app/dashboard/alumnos/actions";
import { toast } from "sonner";

const SEDES_MAP: Record<string, string> = {
  SEAAUTLAN: "Autlán",
  SEAGRULLO: "El Grullo",
  SEAUNION: "Unión de Tula",
  EN_LINEA: "En Línea",
};

export function SedeSelector() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const user = session?.user as any;
  const isAdmin = user?.role === "ADMIN";

  if (!isAdmin) return null;

  const currentSede = user?.sede || "SEAAUTLAN";

  async function handleSedeChange(newSede: string) {
    if (newSede === currentSede) return;

    startTransition(async () => {
      const res = await updateUserActiveSede(newSede);
      if (res.success) {
        await update({ sede: newSede });
        router.refresh();
        toast.success(`Sede activa cambiada a ${SEDES_MAP[newSede] || newSede}`);
      } else {
        toast.error(res.error || "Error al cambiar de sede");
      }
    });
  }

  return (
    <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 rounded-full px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-200">
      <MapPin className="h-3.5 w-3.5 text-sea-blue dark:text-sky-400 shrink-0" />
      <span className="hidden sm:inline text-slate-500 font-normal">Sede:</span>
      <Select value={currentSede} onValueChange={handleSedeChange} disabled={isPending}>
        <SelectTrigger className="h-6 border-none bg-transparent p-0 text-xs font-bold shadow-none focus:ring-0 focus:outline-none gap-1">
          <SelectValue placeholder="Selecciona sede" />
          {isPending && <Loader2 className="h-3 w-3 animate-spin ml-1" />}
        </SelectTrigger>
        <SelectContent align="end">
          <SelectItem value="SEAAUTLAN">Autlán</SelectItem>
          <SelectItem value="SEAGRULLO">El Grullo</SelectItem>
          <SelectItem value="SEAUNION">Unión de Tula</SelectItem>
          <SelectItem value="EN_LINEA">En Línea</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
