import { db } from "@/lib/db"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { PlusCircle, Edit2, Trash2 } from "lucide-react"
import Link from "next/link"

export async function FamiliesTable() {
  // 1. Fetch data asynchronously
  const families = await db.familyMember.findMany({
    include: {
      // Add your relations here
    },
    orderBy: { name: "asc" },
  })

  // 2. Render the UI with data
  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Familias</h2>
          <p className="text-muted-foreground">
            Administra los datos de familias y tutores.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/familias/nuevo">
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir Familia
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Familias Registradas</CardTitle>
          <CardDescription>Total de familias: {families.length}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Familia</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Alumnos</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {families.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No hay familias registradas aún.
                  </TableCell>
                </TableRow>
              ) : (
                families.map((family) => (
                  <TableRow key={family.id}>
                    <TableCell className="font-medium">{family.name}</TableCell>
                    <TableCell>{family.email || "-"}</TableCell>
                    <TableCell>
                      <span className="text-sm">{/* Add count */}</span>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                        Activo
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="h-8 w-8 p-0"
                        >
                          <Link href={`/dashboard/familias/${family.id}`}>
                            <Edit2 className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
  )
}
