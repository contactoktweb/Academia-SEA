import { db } from "@/lib/db";
import { getSedeCondition } from "@/lib/multi-tenancy";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit2, Trash2, Users } from "lucide-react";
import Link from "next/link";
import { FamilyDialog } from "./family-dialogs";

export async function FamiliesTable() {
  const sedeCondition = await getSedeCondition();
  const families = await db.family.findMany({
    where: {
      links: {
        some: {
          studentProfile: {
            user: {
              ...sedeCondition,
              deletedAt: null,
            },
          },
        },
      },
    },
    include: {
      links: {
        where: {
          studentProfile: {
            user: {
              ...sedeCondition,
              deletedAt: null,
            },
          },
        },
        include: {
          studentProfile: { include: { user: true } },
        },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Familias</h2>
          <p className="text-muted-foreground">
            Administra los registros de familias y contactos.
          </p>
        </div>
        <FamilyDialog mode="add" />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Familias Registradas</CardTitle>
            <CardDescription>Total de familias: {families.length}</CardDescription>
          </div>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Familia</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead>Estudiantes</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {families.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No hay familias registradas aún.
                  </TableCell>
                </TableRow>
              ) : (
                families.map((family) => (
                  <TableRow key={family.id}>
                    <TableCell className="font-medium">{family.name}</TableCell>
                    <TableCell>{family.phone || "N/A"}</TableCell>
                    <TableCell className="text-sm">{family.email || "N/A"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                      {family.address || "N/A"}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded">
                        {family.links.length}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <FamilyDialog mode="edit" family={family} />
                        <FamilyDialog mode="delete" family={family} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
