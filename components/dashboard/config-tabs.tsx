"use client";

import { useState, useTransition } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, Calendar, DollarSign, ListTodo, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createSchoolCycle, toggleCycleStatus, deleteSchoolCycle, deleteChargeConcept, deletePaymentPlan } from "@/app/dashboard/configuracion/actions";
import { createChargeConcept, createPaymentPlan } from "@/app/dashboard/pagos/actions"; // Reusing existing action

export function ConfigTabsClient({ data }: { data: any }) {
  const { cycles, concepts, plans } = data;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // States for new Cycle form
  const [newCycle, setNewCycle] = useState({ name: "", startDate: "", endDate: "" });
  
  // States for new Concept form
  const [newConcept, setNewConcept] = useState({ name: "", amount: "", type: "TUITION" });

  // States for new Plan form
  const [newPlan, setNewPlan] = useState({ name: "", amount: "", frequency: "MONTHLY", installments: "1" });

  const handleCreateCycle = () => {
    if (!newCycle.name || !newCycle.startDate || !newCycle.endDate) {
      toast.error("Llena todos los campos del ciclo");
      return;
    }
    startTransition(async () => {
      const res = await createSchoolCycle(newCycle);
      if (res.success) {
        toast.success("Ciclo creado exitosamente");
        setNewCycle({ name: "", startDate: "", endDate: "" });
        router.refresh();
      } else toast.error(res.error);
    });
  };

  const handleCreateConcept = () => {
    if (!newConcept.name || !newConcept.amount) {
      toast.error("Llena el nombre y monto del concepto");
      return;
    }
    startTransition(async () => {
      const res = await createChargeConcept({
        name: newConcept.name,
        amount: parseFloat(newConcept.amount),
        type: newConcept.type,
      });
      if (res.success) {
        toast.success("Concepto creado exitosamente");
        setNewConcept({ name: "", amount: "", type: "TUITION" });
        router.refresh();
      } else toast.error(res.error);
    });
  };

  const handleCreatePlan = () => {
    if (!newPlan.name || !newPlan.amount || !newPlan.installments) {
      toast.error("Llena los campos obligatorios del plan");
      return;
    }
    startTransition(async () => {
      const res = await createPaymentPlan({
        name: newPlan.name,
        amount: parseFloat(newPlan.amount),
        frequency: newPlan.frequency,
        installments: parseInt(newPlan.installments),
      });
      if (res.success) {
        toast.success("Plan creado exitosamente");
        setNewPlan({ name: "", amount: "", frequency: "MONTHLY", installments: "1" });
        router.refresh();
      } else toast.error(res.error);
    });
  };

  const handleDelete = async (action: any, id: string, entityName: string) => {
    if (!confirm(`¿Estás seguro de eliminar este ${entityName}?`)) return;
    startTransition(async () => {
      const res = await action(id);
      if (res.success) {
        toast.success(`${entityName} eliminado`);
        router.refresh();
      } else {
        toast.error(res.error);
      }
    });
  };

  return (
    <Tabs defaultValue="ciclos" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-8">
        <TabsTrigger value="ciclos" className="flex items-center gap-2"><Calendar className="w-4 h-4"/> Ciclos Escolares</TabsTrigger>
        <TabsTrigger value="conceptos" className="flex items-center gap-2"><DollarSign className="w-4 h-4"/> Conceptos de Cobro</TabsTrigger>
        <TabsTrigger value="planes" className="flex items-center gap-2"><ListTodo className="w-4 h-4"/> Planes de Pago</TabsTrigger>
      </TabsList>

      {/* TABS CONTENT: CICLOS */}
      <TabsContent value="ciclos" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Añadir Nuevo Ciclo</CardTitle>
            <CardDescription>Crea un nuevo periodo académico (ej. Semestre 2024-B)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="space-y-2">
                <Label>Nombre del Ciclo</Label>
                <Input placeholder="Ej. Verano 2024" value={newCycle.name} onChange={e => setNewCycle({...newCycle, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Fecha Inicio</Label>
                <Input type="date" value={newCycle.startDate} onChange={e => setNewCycle({...newCycle, startDate: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Fecha Fin</Label>
                <Input type="date" value={newCycle.endDate} onChange={e => setNewCycle({...newCycle, endDate: e.target.value})} />
              </div>
              <Button onClick={handleCreateCycle} disabled={isPending}>
                {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />} Agregar Ciclo
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ciclos Registrados</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Inicio</TableHead>
                  <TableHead>Fin</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cycles.length === 0 && <TableRow><TableCell colSpan={5} className="text-center">No hay ciclos registrados</TableCell></TableRow>}
                {cycles.map((cycle: any) => (
                  <TableRow key={cycle.id}>
                    <TableCell className="font-medium">{cycle.name}</TableCell>
                    <TableCell>{new Date(cycle.startDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(cycle.endDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          checked={cycle.isActive} 
                          onCheckedChange={(checked) => {
                            startTransition(async () => {
                              await toggleCycleStatus(cycle.id, checked);
                              router.refresh();
                            });
                          }} 
                        />
                        <span className="text-sm">{cycle.isActive ? 'Activo' : 'Inactivo'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(deleteSchoolCycle, cycle.id, 'ciclo')} disabled={isPending}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      {/* TABS CONTENT: CONCEPTOS */}
      <TabsContent value="conceptos" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Añadir Concepto Base</CardTitle>
            <CardDescription>Crea precios estándar para inscripciones, colegiaturas, credenciales, etc.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="space-y-2">
                <Label>Nombre del Concepto</Label>
                <Input placeholder="Ej. Colegiatura Mensual" value={newConcept.name} onChange={e => setNewConcept({...newConcept, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Monto por Defecto ($)</Label>
                <Input type="number" step="0.01" value={newConcept.amount} onChange={e => setNewConcept({...newConcept, amount: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  value={newConcept.type} onChange={e => setNewConcept({...newConcept, type: e.target.value})}
                >
                  <option value="TUITION">Colegiatura</option>
                  <option value="ENROLLMENT">Inscripción</option>
                  <option value="EXAM_FEE">Examen</option>
                  <option value="BOOKS">Materiales</option>
                  <option value="OTHER">Otro</option>
                </select>
              </div>
              <Button onClick={handleCreateConcept} disabled={isPending}>
                {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />} Agregar
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Catálogo de Cobros</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Concepto</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Monto Base</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {concepts.length === 0 && <TableRow><TableCell colSpan={4} className="text-center">No hay conceptos</TableCell></TableRow>}
                {concepts.map((concept: any) => (
                  <TableRow key={concept.id}>
                    <TableCell className="font-medium">{concept.name}</TableCell>
                    <TableCell className="text-xs">{concept.type}</TableCell>
                    <TableCell className="font-mono">${concept.amount.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(deleteChargeConcept, concept.id, 'concepto')} disabled={isPending}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      {/* TABS CONTENT: PLANES */}
      <TabsContent value="planes" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Añadir Plan de Pago Maestro</CardTitle>
            <CardDescription>Define esquemas de pago (ej. 6 cuotas mensuales) que luego puedes asignar a los alumnos.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              <div className="space-y-2 md:col-span-2">
                <Label>Nombre del Plan</Label>
                <Input placeholder="Ej. Plan Semestral Básico" value={newPlan.name} onChange={e => setNewPlan({...newPlan, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Monto Total ($)</Label>
                <Input type="number" step="0.01" value={newPlan.amount} onChange={e => setNewPlan({...newPlan, amount: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Nº de Cuotas</Label>
                <Input type="number" min="1" value={newPlan.installments} onChange={e => setNewPlan({...newPlan, installments: e.target.value})} />
              </div>
              <Button onClick={handleCreatePlan} disabled={isPending}>
                {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />} Guardar
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Esquemas Registrados</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Monto Total</TableHead>
                  <TableHead>Cuotas</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans.length === 0 && <TableRow><TableCell colSpan={4} className="text-center">No hay planes</TableCell></TableRow>}
                {plans.map((plan: any) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium">{plan.name}</TableCell>
                    <TableCell className="font-mono">${plan.amount.toFixed(2)}</TableCell>
                    <TableCell>{plan.installments} cuotas</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(deletePaymentPlan, plan.id, 'plan')} disabled={isPending}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
