"use client";

import { useState, useTransition, useEffect } from "react";
import { getInbox, getOutbox, getContacts, sendMessage, markAsRead } from "@/app/dashboard/mensajes/actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown, Send, Inbox, SendHorizontal, Edit, Loader2, ArrowLeft, Mail, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

type Tab = "inbox" | "sent" | "compose";

interface MessagesClientProps {
  currentUserId: string;
}

export function MessagesClient({ currentUserId }: MessagesClientProps) {
  const [activeTab, setActiveTab] = useState<Tab>("inbox");
  const [inbox, setInbox] = useState<any[]>([]);
  const [outbox, setOutbox] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
  const [isLoading, startTransition] = useTransition();

  // Compose State
  const [openCombobox, setOpenCombobox] = useState(false);
  const [composeReceiverId, setComposeReceiverId] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeContent, setComposeContent] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    startTransition(async () => {
      const [inboxRes, outboxRes, contactsRes] = await Promise.all([
        getInbox(),
        getOutbox(),
        getContacts(),
      ]);

      if (inboxRes.success) setInbox(inboxRes.data || []);
      if (outboxRes.success) setOutbox(outboxRes.data || []);
      if (contactsRes.success) setContacts(contactsRes.data || []);
    });
  };

  const handleSelectMessage = async (msg: any, isInbox: boolean) => {
    setSelectedMessage({ ...msg, isInbox });
    
    // Mark as read if it's from inbox and unread
    if (isInbox && !msg.isRead) {
      const res = await markAsRead(msg.id);
      if (res.success) {
        setInbox(prev => prev.map(m => m.id === msg.id ? { ...m, isRead: true } : m));
      }
    }
  };

  const handleSend = async () => {
    if (!composeReceiverId || !composeContent) {
      toast.error("Por favor, selecciona un destinatario y escribe un mensaje.");
      return;
    }

    setIsSending(true);
    const res = await sendMessage(composeReceiverId, composeSubject, composeContent);
    setIsSending(false);

    if (res.success) {
      toast.success("Mensaje enviado correctamente");
      setComposeReceiverId("");
      setComposeSubject("");
      setComposeContent("");
      loadData();
      setActiveTab("sent");
    } else {
      toast.error(res.error || "Error al enviar mensaje");
    }
  };

  const renderMessageList = (messages: any[], isInbox: boolean) => {
    if (messages.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4 p-8">
          <Mail className="h-12 w-12 text-slate-300" />
          <p>No hay mensajes en esta bandeja.</p>
        </div>
      );
    }

    return (
      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-2">
          {messages.map((msg) => (
            <button
              key={msg.id}
              onClick={() => handleSelectMessage(msg, isInbox)}
              className={cn(
                "w-full text-left p-4 rounded-lg border transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 flex flex-col gap-1",
                selectedMessage?.id === msg.id && "bg-slate-100 border-slate-300 dark:bg-slate-800 dark:border-slate-600",
                isInbox && !msg.isRead && "bg-blue-50/50 border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/30 font-medium"
              )}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-sm font-semibold truncate pr-2">
                  {isInbox ? msg.sender.name : `Para: ${msg.receiver.name}`}
                </span>
                <span className="text-xs text-slate-500 whitespace-nowrap">
                  {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true, locale: es })}
                </span>
              </div>
              <div className="text-sm font-medium truncate">{msg.subject || "Sin Asunto"}</div>
              <div className="text-xs text-slate-500 truncate mt-1">{msg.content}</div>
            </button>
          ))}
        </div>
      </ScrollArea>
    );
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-180px)] min-h-[600px]">
      {/* Sidebar Navigation */}
      <Card className="w-full md:w-64 lg:w-72 shrink-0 h-full flex flex-col">
        <div className="p-4">
          <Button 
            className="w-full justify-start shadow-sm" 
            onClick={() => { setActiveTab("compose"); setSelectedMessage(null); }}
          >
            <Edit className="mr-2 h-4 w-4" />
            Redactar Mensaje
          </Button>
        </div>
        <Separator />
        <div className="p-2 flex flex-col gap-1 flex-1">
          <Button
            variant={activeTab === "inbox" && !selectedMessage ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => { setActiveTab("inbox"); setSelectedMessage(null); }}
          >
            <Inbox className="mr-2 h-4 w-4" />
            Bandeja de Entrada
            {inbox.filter(m => !m.isRead).length > 0 && (
              <span className="ml-auto bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                {inbox.filter(m => !m.isRead).length}
              </span>
            )}
          </Button>
          <Button
            variant={activeTab === "sent" && !selectedMessage ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => { setActiveTab("sent"); setSelectedMessage(null); }}
          >
            <SendHorizontal className="mr-2 h-4 w-4" />
            Enviados
          </Button>
        </div>
      </Card>

      {/* Main Content Area */}
      <Card className="flex-1 min-w-0 h-full flex flex-col overflow-hidden">
        {isLoading && !selectedMessage && activeTab !== "compose" ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          </div>
        ) : selectedMessage ? (
          /* Message Reader View */
          <div className="flex flex-col h-full">
            <div className="p-4 border-b flex items-center gap-2 bg-slate-50/50 dark:bg-slate-900/50">
              <Button variant="ghost" size="icon" onClick={() => setSelectedMessage(null)} className="md:hidden mr-2">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex-1">
                <h3 className="text-xl font-bold">{selectedMessage.subject || "Sin Asunto"}</h3>
                <div className="text-sm text-slate-500 mt-1 flex justify-between">
                  <span>
                    {selectedMessage.isInbox 
                      ? <span className="font-medium text-slate-700 dark:text-slate-300">De: {selectedMessage.sender.name} ({selectedMessage.sender.email})</span>
                      : <span className="font-medium text-slate-700 dark:text-slate-300">Para: {selectedMessage.receiver.name} ({selectedMessage.receiver.email})</span>
                    }
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(selectedMessage.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            <ScrollArea className="flex-1 p-6">
              <div className="whitespace-pre-wrap text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedMessage.content}
              </div>
            </ScrollArea>
          </div>
        ) : activeTab === "compose" ? (
          /* Compose View */
          <div className="flex flex-col h-full">
            <div className="p-4 border-b bg-slate-50/50 dark:bg-slate-900/50">
              <h3 className="text-lg font-semibold flex items-center">
                <Edit className="mr-2 h-5 w-5" /> Nuevo Mensaje
              </h3>
            </div>
            <div className="p-6 flex flex-col gap-4 flex-1">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Destinatario</label>
                <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openCombobox}
                      className="w-full justify-between"
                    >
                      {composeReceiverId
                        ? contacts.find((c) => c.id === composeReceiverId)?.name
                        : "Selecciona un profesor o estudiante..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Buscar por nombre..." />
                      <CommandList>
                        <CommandEmpty>No se encontró nadie.</CommandEmpty>
                        <CommandGroup>
                          {contacts.map((contact) => (
                            <CommandItem
                              key={contact.id}
                              value={contact.name}
                              onSelect={() => {
                                setComposeReceiverId(contact.id);
                                setOpenCombobox(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  composeReceiverId === contact.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              <div className="flex flex-col">
                                <span>{contact.name}</span>
                                <span className="text-xs text-slate-500">
                                  {contact.role === "TEACHER" ? "Profesor" : contact.role === "STUDENT" ? "Estudiante" : "Administrador"} - {contact.email}
                                </span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Asunto</label>
                <Input 
                  placeholder="Asunto del mensaje" 
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-sm font-medium">Mensaje</label>
                <Textarea 
                  placeholder="Escribe tu mensaje aquí..." 
                  className="flex-1 resize-none min-h-[200px]"
                  value={composeContent}
                  onChange={(e) => setComposeContent(e.target.value)}
                />
              </div>

              <div className="flex justify-end pt-4 border-t mt-auto">
                <Button onClick={handleSend} disabled={isSending}>
                  {isSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                  Enviar Mensaje
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* List View (Inbox/Sent) */
          <div className="flex flex-col h-full">
            <div className="p-4 border-b bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
              <h3 className="text-lg font-semibold flex items-center">
                {activeTab === "inbox" ? <Inbox className="mr-2 h-5 w-5" /> : <SendHorizontal className="mr-2 h-5 w-5" />}
                {activeTab === "inbox" ? "Bandeja de Entrada" : "Mensajes Enviados"}
              </h3>
              <Button variant="ghost" size="sm" onClick={loadData}>
                Actualizar
              </Button>
            </div>
            <div className="p-0 flex-1">
              {activeTab === "inbox" 
                ? renderMessageList(inbox, true)
                : renderMessageList(outbox, false)}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
