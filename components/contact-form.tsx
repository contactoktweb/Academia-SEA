"use client";

import { useState, useTransition } from "react";
import { submitContactMessage, ContactFormInput } from "@/app/(site)/contacto/actions";
import { toast } from "sonner";
import {
  Send,
  Loader2,
  CheckCircle2,
  MapPin,
  Mail,
  Phone,
  MessageSquare,
  HelpCircle,
  Sparkles,
  ArrowRight,
  BookOpen,
  DollarSign,
  FileSignature,
  Award,
  Building,
} from "lucide-react";
import { WhatsappIcon } from "@/components/whatsapp-icon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SEDES_OPTIONS = [
  { value: "Autlán", label: "Sede Autlán de Navarro" },
  { value: "El Grullo", label: "Sede El Grullo" },
  { value: "Unión de Tula", label: "Sede Unión de Tula" },
  { value: "En Línea", label: "Modalidad En Línea (Virtual)" },
  { value: "General", label: "Información General" },
];

const SUBJECT_OPTIONS = [
  { value: "Cursos", label: "Información de Cursos de Inglés" },
  { value: "Costos", label: "Costos, Mensualidades y Promociones" },
  { value: "Inscripción", label: "Proceso de Admisión e Inscripción" },
  { value: "Certificaciones", label: "Certificaciones Oficiales (TOEFL / CENNI)" },
  { value: "Convenios", label: "Convenios Empresariales y Familiares" },
  { value: "Otro", label: "Otra Consulta o Sugerencia" },
];

export function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<any>(null);

  const [formData, setFormData] = useState<ContactFormInput>({
    fullName: "",
    email: "",
    phone: "",
    sedeInteres: "Autlán",
    subject: "Cursos",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim() || formData.fullName.length < 2) {
      toast.error("Por favor ingresa tu nombre completo");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      toast.error("Por favor ingresa un correo electrónico válido");
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 6) {
      toast.error("Por favor ingresa tu número de teléfono o WhatsApp");
      return;
    }
    if (!formData.message.trim() || formData.message.length < 5) {
      toast.error("Por favor escribe tu consulta o mensaje");
      return;
    }

    startTransition(async () => {
      const res = await submitContactMessage(formData);
      if (res.success) {
        setIsSubmitted(true);
        setSubmittedData(formData);
        toast.success("¡Mensaje enviado con éxito! Nos comunicaremos contigo pronto.");
      } else {
        toast.error(res.error || "Ocurrió un error al enviar tu mensaje");
      }
    });
  };

  if (isSubmitted) {
    return (
      <div className="rounded-3xl border border-emerald-200/80 bg-gradient-to-b from-emerald-50/80 to-white p-8 md:p-10 shadow-xl shadow-emerald-500/5 text-center animate-in fade-in zoom-in-95 duration-300">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-6 shadow-md shadow-emerald-600/10">
          <CheckCircle2 className="h-10 w-10 animate-bounce" />
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-100/60 px-4 py-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-3">
          <Sparkles className="h-3.5 w-3.5" />
          Mensaje Recibido
        </div>

        <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          ¡Gracias por escribirnos, {submittedData?.fullName?.split(" ")[0]}!
        </h3>

        <p className="mt-3 text-slate-600 text-sm md:text-base max-w-md mx-auto leading-relaxed">
          Hemos recibido tu consulta sobre <strong>{submittedData?.subject}</strong> para la sede <strong>{submittedData?.sedeInteres}</strong>. Un asesor académico se pondrá en contacto contigo a la brevedad.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="https://wa.me/523171035100?text=Hola,%20acabo%20de%20enviar%20un%20mensaje%20desde%20el%20formulario%20de%20contacto%20y%20me%20gustar%C3%ADa%20atenci%C3%B3n%20r%C3%A1pida."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-[#25d366] hover:bg-[#20ba59] px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-green-600/20 transition-all hover:-translate-y-0.5"
          >
            <WhatsappIcon className="h-5 w-5" />
            <span>Chatear por WhatsApp ahora</span>
          </a>

          <button
            type="button"
            onClick={() => {
              setIsSubmitted(false);
              setFormData({
                fullName: "",
                email: "",
                phone: "",
                sedeInteres: "Autlán",
                subject: "Cursos",
                message: "",
              });
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 px-6 py-3.5 text-sm font-bold text-slate-700 transition-colors"
          >
            Enviar otro mensaje
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative rounded-3xl border border-slate-200/80 bg-white/95 backdrop-blur-md p-6 sm:p-8 md:p-10 shadow-xl shadow-slate-200/50"
    >
      <div className="mb-6 flex flex-col gap-1.5">
        <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-[#0066cc]">
          <MessageSquare className="h-3.5 w-3.5" />
          Envíanos un mensaje
        </span>
        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          ¿Tienes dudas o deseas atención personalizada?
        </h3>
        <p className="text-xs sm:text-sm text-slate-500">
          Llena este breve formulario y nuestro equipo se comunicará contigo vía WhatsApp o correo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {/* Nombre Completo */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Nombre Completo *</label>
          <div className="relative">
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Ej. Sofía Hernández"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0066cc] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20 transition-all"
            />
          </div>
        </div>

        {/* Teléfono / WhatsApp */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Teléfono / WhatsApp *</label>
          <div className="relative">
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="Ej. 317 123 4567"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0066cc] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20 transition-all"
            />
          </div>
        </div>

        {/* Correo Electrónico */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Correo Electrónico *</label>
          <div className="relative">
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="sofia@ejemplo.com"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0066cc] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20 transition-all"
            />
          </div>
        </div>

        {/* Sede de Interés */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Sede o Modalidad de Interés</label>
          <Select
            value={formData.sedeInteres}
            onValueChange={(val) => setFormData((prev) => ({ ...prev, sedeInteres: val }))}
          >
            <SelectTrigger className="w-full h-[46px] rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 focus:border-[#0066cc] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20 shadow-none cursor-pointer">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                <SelectValue placeholder="Selecciona una sede" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border border-slate-200 shadow-xl bg-white z-50">
              {SEDES_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-sm">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Asunto / Motivo */}
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Motivo de Contacto</label>
          <Select
            value={formData.subject}
            onValueChange={(val) => setFormData((prev) => ({ ...prev, subject: val }))}
          >
            <SelectTrigger className="w-full h-[46px] rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 focus:border-[#0066cc] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20 shadow-none cursor-pointer">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-slate-400 shrink-0" />
                <SelectValue placeholder="Selecciona el motivo" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border border-slate-200 shadow-xl bg-white z-50">
              {SUBJECT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-sm">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Mensaje */}
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Mensaje o Pregunta *</label>
          <textarea
            name="message"
            required
            rows={4}
            value={formData.message}
            onChange={handleChange}
            placeholder="Escribe aquí tu consulta sobre horarios, niveles, costos o cualquier inquietud..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0066cc] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20 transition-all resize-none"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block"></span>
          Tus datos están protegidos y solo se usarán para asesorarte.
        </p>

        <button
          type="submit"
          disabled={isPending}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0066cc] hover:bg-[#0052a3] text-white font-bold text-sm px-8 py-3.5 shadow-lg shadow-blue-600/25 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 cursor-pointer"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Enviando mensaje...</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>Enviar Mensaje</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
