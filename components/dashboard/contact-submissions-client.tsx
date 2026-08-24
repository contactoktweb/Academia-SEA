"use client";

import { useState, useMemo, useTransition } from "react";
import {
  ContactSubmissionItem,
  LeadSubmissionItem,
  updateSubmissionStatus,
  deleteSubmission,
} from "@/app/dashboard/contactos/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Mail,
  Phone,
  MessageSquare,
  Sparkles,
  Search,
  Filter,
  Eye,
  Trash2,
  CheckCircle2,
  Clock,
  ExternalLink,
  Users,
  Inbox,
  Calendar,
  Save,
  Loader2,
  RefreshCw,
  LayoutTemplate,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type CombinedSubmission =
  | (ContactSubmissionItem & { kind: "contact" })
  | (LeadSubmissionItem & { kind: "lead" });

interface ContactSubmissionsClientProps {
  contacts: ContactSubmissionItem[];
  leads: LeadSubmissionItem[];
}

export function ContactSubmissionsClient({
  contacts: initialContacts,
  leads: initialLeads,
}: ContactSubmissionsClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [activeTab, setActiveTab] = useState<"all" | "leads" | "contacts">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Selected item for detail modal
  const [selectedItem, setSelectedItem] = useState<CombinedSubmission | null>(null);
  const [modalStatus, setModalStatus] = useState<string>("");
  const [modalNotes, setModalNotes] = useState<string>("");
  const [isSavingDetails, setIsSavingDetails] = useState(false);

  // Item for delete confirmation
  const [itemToDelete, setItemToDelete] = useState<CombinedSubmission | null>(null);

  // Combine datasets
  const allSubmissions: CombinedSubmission[] = useMemo(() => {
    const formattedContacts: CombinedSubmission[] = initialContacts.map((c) => ({
      ...c,
      kind: "contact",
    }));
    const formattedLeads: CombinedSubmission[] = initialLeads.map((l) => ({
      ...l,
      kind: "lead",
    }));

    return [...formattedContacts, ...formattedLeads].sort(
      (a, b) =>
        new Date(b.submittedAt || 0).getTime() -
        new Date(a.submittedAt || 0).getTime()
    );
  }, [initialContacts, initialLeads]);

  // Metrics
  const metrics = useMemo(() => {
    const total = allSubmissions.length;
    const leadsCount = initialLeads.length;
    const contactsCount = initialContacts.length;
    const pendingCount = allSubmissions.filter(
      (s) => s.status === "pendiente" || !s.status
    ).length;
    const resolvedCount = allSubmissions.filter(
      (s) => s.status === "resuelto" || s.status === "inscrito"
    ).length;

    return { total, leadsCount, contactsCount, pendingCount, resolvedCount };
  }, [allSubmissions, initialLeads, initialContacts]);

  // Filtered submissions
  const filteredSubmissions = useMemo(() => {
    return allSubmissions.filter((item) => {
      // Tab filter
      if (activeTab === "leads" && item.kind !== "lead") return false;
      if (activeTab === "contacts" && item.kind !== "contact") return false;

      // Status filter
      if (statusFilter !== "all") {
        if (statusFilter === "pendiente" && item.status !== "pendiente" && item.status) {
          return false;
        } else if (statusFilter !== "pendiente" && item.status !== statusFilter) {
          return false;
        }
      }

      // Search filter
      if (searchTerm.trim() !== "") {
        const term = searchTerm.toLowerCase();
        const name = (item.fullName || "").toLowerCase();
        const email = (item.email || "").toLowerCase();
        const phone = (item.phone || "").toLowerCase();
        const sede = item.kind === "contact" ? (item.sedeInteres || "").toLowerCase() : (item.country || "").toLowerCase();
        const subject = item.kind === "contact" ? (item.subject || "").toLowerCase() : (item.target || "").toLowerCase();
        const notes = (item.notes || "").toLowerCase();

        return (
          name.includes(term) ||
          email.includes(term) ||
          phone.includes(term) ||
          sede.includes(term) ||
          subject.includes(term) ||
          notes.includes(term)
        );
      }

      return true;
    });
  }, [allSubmissions, activeTab, statusFilter, searchTerm]);

  // Handle open details modal
  const handleOpenDetails = (item: CombinedSubmission) => {
    setSelectedItem(item);
    setModalStatus(item.status || "pendiente");
    setModalNotes(item.notes || "");
  };

  // Handle save modal updates
  const handleSaveDetails = async () => {
    if (!selectedItem) return;
    setIsSavingDetails(true);

    try {
      const res = await updateSubmissionStatus(
        selectedItem._id,
        modalStatus,
        modalNotes
      );

      if (res.success) {
        toast.success("Registro actualizado con éxito");
        setSelectedItem(null);
        startTransition(() => {
          router.refresh();
        });
      } else {
        toast.error(res.error || "No se pudo actualizar el registro");
      }
    } catch (error) {
      toast.error("Ocurrió un error inesperado");
    } finally {
      setIsSavingDetails(false);
    }
  };

  // Handle delete submission
  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      const res = await deleteSubmission(itemToDelete._id);
      if (res.success) {
        toast.success("Registro eliminado correctamente");
        setItemToDelete(null);
        if (selectedItem?._id === itemToDelete._id) {
          setSelectedItem(null);
        }
        startTransition(() => {
          router.refresh();
        });
      } else {
        toast.error(res.error || "No se pudo eliminar el registro");
      }
    } catch (error) {
      toast.error("Error al eliminar el registro");
    }
  };

  // Status Badge Helper
  const renderStatusBadge = (status: string, kind: "contact" | "lead") => {
    switch (status) {
      case "pendiente":
      case "":
      case undefined:
        return (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200/70">
            <span className="size-1.5 rounded-full bg-amber-500" />
            Pendiente
          </div>
        );
      case "en_seguimiento":
        return (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200/70">
            <span className="size-1.5 rounded-full bg-blue-500" />
            En Seguimiento
          </div>
        );
      case "resuelto":
      case "inscrito":
        return (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/70">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            {kind === "lead" ? "Inscrito" : "Atendido"}
          </div>
        );
      case "cancelado":
      case "archivado":
        return (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200/70">
            <span className="size-1.5 rounded-full bg-slate-400" />
            {kind === "lead" ? "Cancelado" : "Archivado"}
          </div>
        );
      default:
        return (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200/70">
            {status}
          </div>
        );
    }
  };

  const cleanPhoneForWhatsApp = (rawPhone: string) => {
    let clean = rawPhone.replace(/\D/g, "");
    if (clean.length === 10) {
      clean = `52${clean}`;
    }
    return clean;
  };

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Formularios de Inicio y Contacto</h2>
          <p className="text-sm text-slate-500 mt-1">
            Visualiza, gestiona y da seguimiento a los envíos del formulario de inicio y mensajes de contacto.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              startTransition(() => {
                router.refresh();
                toast.success("Registros sincronizados");
              });
            }}
            disabled={isPending}
            className="flex items-center gap-1.5"
          >
            <RefreshCw className={`size-4 ${isPending ? "animate-spin" : ""}`} />
            <span>Actualizar</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-slate-200/80 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-600">
              Total Registros
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-blue-50 text-sea-blue flex items-center justify-center">
              <Inbox className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{metrics.total}</div>
            <p className="text-xs text-slate-500 mt-1">
              Todos los formularios recibidos
            </p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/80 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-600">
              Formulario Inicio
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-blue-50 text-sea-blue flex items-center justify-center">
              <LayoutTemplate className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{metrics.leadsCount}</div>
            <p className="text-xs text-slate-500 mt-1">
              Capturados desde la página principal
            </p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/80 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-600">
              Mensajes de Contacto
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <MessageSquare className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{metrics.contactsCount}</div>
            <p className="text-xs text-slate-500 mt-1">
              Formularios de la página de contacto
            </p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/80 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-600">
              Pendientes de Atención
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <Clock className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{metrics.pendingCount}</div>
            <p className="text-xs text-slate-500 mt-1">
              Requieren llamada o WhatsApp
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card with Tabs */}
      <Card className="border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col gap-4">
          <Tabs
            value={activeTab}
            onValueChange={(val) => setActiveTab(val as any)}
            className="w-full"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <TabsList className="bg-slate-100 p-1">
                <TabsTrigger value="all" className="text-xs sm:text-sm font-medium">
                  Todos ({metrics.total})
                </TabsTrigger>
                <TabsTrigger value="leads" className="text-xs sm:text-sm font-medium">
                  Formulario Inicio ({metrics.leadsCount})
                </TabsTrigger>
                <TabsTrigger value="contacts" className="text-xs sm:text-sm font-medium">
                  Contacto Web ({metrics.contactsCount})
                </TabsTrigger>
              </TabsList>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative min-w-[200px] flex-1 sm:flex-initial">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Buscar por nombre, email o tel..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 h-9 text-xs sm:text-sm bg-slate-50/50"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[160px] h-9 text-xs sm:text-sm">
                    <SelectValue placeholder="Estado..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="pendiente">🟡 Pendientes</SelectItem>
                    <SelectItem value="en_seguimiento">🔵 En Seguimiento</SelectItem>
                    <SelectItem value="resuelto">🟢 Atendidos / Resueltos</SelectItem>
                    <SelectItem value="inscrito">🟢 Inscritos (Inicio)</SelectItem>
                    <SelectItem value="cancelado">🔴 Cancelados / Archivados</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Tabs>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80">
                <TableHead className="w-[160px]">Origen</TableHead>
                <TableHead>Nombre y Contacto</TableHead>
                <TableHead>Detalles / Consulta</TableHead>
                <TableHead className="w-[140px]">Fecha</TableHead>
                <TableHead className="w-[140px]">Estado</TableHead>
                <TableHead className="text-right w-[150px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubmissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Inbox className="size-8 text-slate-300" />
                      <p className="font-medium text-slate-600">No se encontraron registros</p>
                      <p className="text-xs text-slate-400">
                        {searchTerm || statusFilter !== "all"
                          ? "Intenta modificar los filtros de búsqueda."
                          : "Aún no hay formularios enviados en esta sección."}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredSubmissions.map((item) => {
                  const isLead = item.kind === "lead";
                  const waNumber = cleanPhoneForWhatsApp(item.phone || "");
                  const waMessage = isLead
                    ? encodeURIComponent(`Hola ${item.fullName}, te contactamos de Academia SEA sobre tu solicitud para iniciar cursos de inglés.`)
                    : encodeURIComponent(`Hola ${item.fullName}, te contactamos de Academia SEA para dar seguimiento a tu consulta sobre "${item.subject}".`);

                  return (
                    <TableRow key={item._id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Origen */}
                      <TableCell>
                        {isLead ? (
                          <div className="flex items-center gap-2">
                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-600 border border-slate-200/60">
                              <LayoutTemplate className="size-3.5 stroke-[1.5]" />
                            </div>
                            <span className="text-xs font-medium text-slate-700 whitespace-nowrap">
                              Formulario Inicio
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-600 border border-slate-200/60">
                              <MessageSquare className="size-3.5 stroke-[1.5]" />
                            </div>
                            <span className="text-xs font-medium text-slate-700 whitespace-nowrap">
                              Contacto
                            </span>
                          </div>
                        )}
                      </TableCell>

                      {/* Nombre y Contacto */}
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 text-sm">
                            {item.fullName || "Sin nombre"}
                          </span>
                          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                            {item.email && (
                              <span className="flex items-center gap-1 hover:text-sea-blue transition-colors">
                                <Mail className="size-3 text-slate-400 stroke-[1.5]" />
                                <a href={`mailto:${item.email}`}>{item.email}</a>
                              </span>
                            )}
                            {item.phone && (
                              <span className="flex items-center gap-1 hover:text-emerald-600 transition-colors font-medium">
                                <Phone className="size-3 text-slate-400 stroke-[1.5]" />
                                <a href={`tel:${item.phone}`}>{item.phone}</a>
                              </span>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      {/* Detalles / Consulta */}
                      <TableCell>
                        <div className="flex flex-col max-w-[280px]">
                          {isLead ? (
                            <>
                              <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold">
                                <span>{item.target || "Para mí"}</span>
                                {item.ageRange && (
                                  <span className="text-slate-400 font-normal">
                                    &bull; {item.ageRange}
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-slate-500 truncate mt-0.5">
                                País: {item.country || "México"} {item.state ? `(${item.state})` : ""}
                              </span>
                            </>
                          ) : (
                            <>
                              <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold">
                                <span className="text-sea-blue font-bold">[{item.sedeInteres || "Sede N/A"}]</span>
                                <span>{item.subject}</span>
                              </div>
                              {item.message && (
                                <p className="text-xs text-slate-500 line-clamp-1 italic mt-0.5">
                                  "{item.message}"
                                </p>
                              )}
                            </>
                          )}
                        </div>
                      </TableCell>

                      {/* Fecha */}
                      <TableCell className="text-xs text-slate-500 whitespace-nowrap">
                        {item.submittedAt ? (
                          new Date(item.submittedAt).toLocaleDateString("es-MX", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        ) : (
                          "Sin fecha"
                        )}
                      </TableCell>

                      {/* Estado */}
                      <TableCell>
                        {renderStatusBadge(item.status, item.kind)}
                      </TableCell>

                      {/* Acciones */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* WhatsApp Direct Action */}
                          {item.phone && (
                            <a
                              href={`https://wa.me/${waNumber}?text=${waMessage}`}
                              target="_blank"
                              rel="noreferrer"
                              title="Contactar por WhatsApp"
                              className="inline-flex items-center justify-center h-8 w-8 rounded-md text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                            >
                              <MessageSquare className="size-4 stroke-[1.5]" />
                            </a>
                          )}

                          {/* Detail Modal Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDetails(item)}
                            title="Ver detalles completos"
                            className="h-8 w-8 p-0 text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                          >
                            <Eye className="size-4 stroke-[1.5]" />
                          </Button>

                          {/* Delete Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setItemToDelete(item)}
                            title="Eliminar registro"
                            className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="size-4 stroke-[1.5]" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Detail / Edit Dialog */}
      {selectedItem && (
        <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
          <DialogContent className="sm:max-w-[620px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-1">
                {selectedItem.kind === "lead" ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                    <span className="size-1.5 rounded-full bg-sea-blue" />
                    Formulario Inicio
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                    <span className="size-1.5 rounded-full bg-indigo-500" />
                    Mensaje de Contacto
                  </span>
                )}
                <span className="text-xs text-slate-400">
                  {selectedItem.submittedAt
                    ? new Date(selectedItem.submittedAt).toLocaleString("es-MX", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                    : ""}
                </span>
              </div>
              <DialogTitle className="text-xl font-bold text-slate-900">
                {selectedItem.fullName || "Sin nombre"}
              </DialogTitle>
              <DialogDescription>
                Información detallada proporcionada por el usuario y seguimiento administrativo.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {/* Contact Info Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-sm">
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase block mb-0.5">
                    Correo Electrónico
                  </span>
                  <a
                    href={`mailto:${selectedItem.email}`}
                    className="font-medium text-sea-blue hover:underline flex items-center gap-1.5"
                  >
                    <Mail className="size-3.5" />
                    {selectedItem.email || "No proporcionado"}
                  </a>
                </div>

                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase block mb-0.5">
                    Teléfono / WhatsApp
                  </span>
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${selectedItem.phone}`}
                      className="font-medium text-slate-800 hover:underline flex items-center gap-1.5"
                    >
                      <Phone className="size-3.5" />
                      {selectedItem.phone || "No proporcionado"}
                    </a>
                    {selectedItem.phone && (
                      <a
                        href={`https://wa.me/${cleanPhoneForWhatsApp(selectedItem.phone)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-600 hover:underline text-xs font-bold"
                      >
                        (WhatsApp)
                      </a>
                    )}
                  </div>
                </div>

                {selectedItem.kind === "contact" ? (
                  <>
                    <div>
                      <span className="text-xs font-semibold text-slate-500 uppercase block mb-0.5">
                        Sede de Interés
                      </span>
                      <span className="font-bold text-sea-blue">{selectedItem.sedeInteres}</span>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-500 uppercase block mb-0.5">
                        Motivo de Consulta
                      </span>
                      <span className="font-bold text-slate-800">{selectedItem.subject}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <span className="text-xs font-semibold text-slate-500 uppercase block mb-0.5">
                        ¿Para quién es? / Edad
                      </span>
                      <span className="font-bold text-slate-800">
                        {selectedItem.target} {selectedItem.ageRange ? `(${selectedItem.ageRange})` : ""}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-500 uppercase block mb-0.5">
                        Ubicación del Prospecto
                      </span>
                      <span className="font-bold text-slate-800">
                        {selectedItem.country || "México"} {selectedItem.state ? `- ${selectedItem.state}` : ""}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Message Box if contact */}
              {selectedItem.kind === "contact" && selectedItem.message && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Mensaje enviado por el usuario:
                  </label>
                  <div className="p-3.5 bg-blue-50/50 border border-blue-100 rounded-xl text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                    "{selectedItem.message}"
                  </div>
                </div>
              )}

              {/* Status Update Field */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Estado de Atención
                  </label>
                  <Select value={modalStatus} onValueChange={setModalStatus}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendiente">🟡 Pendiente por Contactar</SelectItem>
                      <SelectItem value="en_seguimiento">🔵 En Seguimiento / Contactado</SelectItem>
                      {selectedItem.kind === "lead" ? (
                        <SelectItem value="inscrito">🟢 Inscrito en Curso</SelectItem>
                      ) : (
                        <SelectItem value="resuelto">🟢 Atendido / Resuelto</SelectItem>
                      )}
                      {selectedItem.kind === "lead" ? (
                        <SelectItem value="cancelado">🔴 Cancelado / No Interesado</SelectItem>
                      ) : (
                        <SelectItem value="archivado">🔴 Archivado</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end gap-2">
                  <a
                    href={`https://wa.me/${cleanPhoneForWhatsApp(selectedItem.phone || "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-xs"
                  >
                    <MessageSquare className="size-4" />
                    Abrir WhatsApp
                  </a>
                  <a
                    href={`mailto:${selectedItem.email}`}
                    className="inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors"
                  >
                    <Mail className="size-4" />
                    Email
                  </a>
                </div>
              </div>

              {/* Internal Notes */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Notas Internas del Asesor / Administrador
                </label>
                <Textarea
                  placeholder="Escribe comentarios sobre la llamada, acuerdos, horarios acordados o detalles del seguimiento..."
                  value={modalNotes}
                  onChange={(e) => setModalNotes(e.target.value)}
                  rows={3}
                  className="resize-none text-sm"
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => setSelectedItem(null)}
                disabled={isSavingDetails}
              >
                Cerrar
              </Button>
              <Button
                onClick={handleSaveDetails}
                disabled={isSavingDetails}
                className="bg-sea-blue hover:bg-sea-blue-dark text-white flex items-center gap-1.5"
              >
                {isSavingDetails ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Save className="size-4" />
                )}
                Guardar Cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Alert Dialog */}
      {itemToDelete && (
        <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Eliminar este registro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción eliminará permanentemente la consulta de{" "}
                <strong>{itemToDelete.fullName}</strong>. Esta acción no se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Eliminar Registro
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
