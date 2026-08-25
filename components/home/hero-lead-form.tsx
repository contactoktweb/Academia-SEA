"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { submitHeroLead } from "@/app/(site)/comenzar/actions";
import { toast } from "sonner";
import {
  Loader2,
  ShieldCheck,
  BadgePercent,
  User,
  GraduationCap,
  Mail,
  Smartphone,
  Phone,
  Globe,
  MapPin,
  Calendar,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const COUNTRIES = [
  { name: "México", code: "mx", dial: "+52" },
  { name: "Colombia", code: "co", dial: "+57" },
  { name: "Estados Unidos", code: "us", dial: "+1" },
  { name: "Perú", code: "pe", dial: "+51" },
  { name: "Ecuador", code: "ec", dial: "+593" },
  { name: "Chile", code: "cl", dial: "+56" },
  { name: "Argentina", code: "ar", dial: "+54" },
  { name: "Otro País", code: "otro", dial: "" },
];

const MEXICAN_STATES = [
  "Jalisco",
  "Colima",
  "Ciudad de México",
  "Estado de México",
  "Michoacán",
  "Nuevo León",
  "Nayarit",
  "Guanajuato",
  "Querétaro",
  "Sinaloa",
  "Sonora",
  "Baja California",
  "Puebla",
  "Veracruz",
  "Yucatán",
  "Quintana Roo",
  "Chiapas",
  "Aguascalientes",
  "Otro Estado",
];

const COLOMBIAN_DEPARTMENTS = [
  "Atlántico",
  "Bogotá D.C.",
  "Antioquia",
  "Valle del Cauca",
  "Cundinamarca",
  "Santander",
  "Bolívar",
  "Caldas",
  "Risaralda",
  "Otro Departamento",
];

const AGE_RANGES = [
  "18-24 años",
  "25-34 años",
  "35-49 años",
  "50+ años",
  "15-17 años (Jóvenes / Teens)",
  "8-14 años (Niños / Junior)",
  "4-7 años (Infantil / Kids)",
];

export function HeroLeadForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("México");
  const [state, setState] = useState("Jalisco");
  const [phoneType, setPhoneType] = useState<"Celular" | "Fijo">("Celular");
  const [phoneCode, setPhoneCode] = useState("+52");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [target, setTarget] = useState<"Para mí" | "Para mi hijo/a">("Para mí");
  const [ageRange, setAgeRange] = useState("18-24 años");

  // Estado de revelado progresivo
  const [expandedAll, setExpandedAll] = useState(false);

  const hasName = firstName.trim().length >= 2 && lastName.trim().length >= 2;
  const hasEmail = email.trim().length >= 5 && email.includes("@");
  const hasPhone = phoneNumber.trim().replace(/\D/g, "").length >= 7;

  const showEmailSection = expandedAll || hasName || email.length > 0;
  const showPhoneSection = expandedAll || (hasName && (hasEmail || phoneNumber.length > 0));
  const showFinalSection = expandedAll || (hasName && hasEmail && hasPhone);

  const handleCountryChange = (newCountryName: string) => {
    setCountry(newCountryName);
    const found = COUNTRIES.find((c) => c.name === newCountryName);
    if (found) {
      setPhoneCode(found.dial);
      if (newCountryName === "México") setState("Jalisco");
      else if (newCountryName === "Colombia") setState("Atlántico");
      else setState("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim()) {
      setExpandedAll(true);
      toast.error("Por favor completa tu nombre y apellido");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setExpandedAll(true);
      toast.error("Por favor ingresa un correo electrónico válido");
      return;
    }
    if (!phoneNumber.trim() || phoneNumber.replace(/\D/g, "").length < 7) {
      setExpandedAll(true);
      toast.error("Por favor ingresa un número de teléfono válido");
      return;
    }

    const fullPhone = phoneCode ? `${phoneCode} ${phoneNumber.trim()}` : phoneNumber.trim();

    startTransition(async () => {
      const res = await submitHeroLead({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        country,
        state,
        phoneType,
        phone: fullPhone,
        target,
        ageRange,
      });

      if (res.success && res.leadId) {
        const countryCode = COUNTRIES.find((c) => c.name === country)?.code || "mx";
        const targetParam = encodeURIComponent(target);
        const ageRangeParam = encodeURIComponent(ageRange);
        const nameParam = encodeURIComponent(`${firstName.trim()} ${lastName.trim()}`);
        const phoneParam = encodeURIComponent(fullPhone);

        router.push(
          `/comenzar/formulario?country=${countryCode}&leadId=${res.leadId}&name=${nameParam}&target=${targetParam}&ageRange=${ageRangeParam}&phone=${phoneParam}`
        );
      } else {
        toast.error(res.error || "Ocurrió un error al enviar el formulario");
      }
    });
  };

  // Progreso visual estimado
  const progressPercent = showFinalSection
    ? 100
    : showPhoneSection
    ? 66
    : showEmailSection
    ? 33
    : 15;

  return (
    <div className="relative w-full max-w-[430px] mx-auto rounded-3xl bg-white p-6 sm:p-7 shadow-[0_15px_40px_rgba(0,0,0,0.06)] border border-slate-200/80 transition-all duration-300">
      {/* Barra de progreso minimalista */}
      <div className="absolute top-0 left-6 right-6 h-1 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#ff6600] transition-all duration-500 ease-out rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Badge Minimalista con Icono Profesional */}
      <div className="text-center pt-2 mb-4">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-orange-200/80 bg-orange-50/80 px-3.5 py-1 text-[11px] font-bold text-[#ff6600] mb-2 tracking-wider uppercase shadow-2xs">
          <BadgePercent className="h-3.5 w-3.5 text-[#ff6600] stroke-[2.2]" />
          <span>Promoción Especial 2026</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 leading-snug">
          Aprende inglés con una{" "}
          <span className="text-[#ff6600]">Oferta Especial</span>
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5 text-sm text-slate-700">
        {/* Toggle [ Para mí | Para mi hijo/a ] con Iconos Vectoriales */}
        <div className="grid grid-cols-2 rounded-xl border border-slate-200 bg-slate-50 p-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setTarget("Para mí")}
            className={`py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              target === "Para mí"
                ? "bg-white text-slate-900 shadow-xs font-bold border border-slate-200/80"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <User className="h-3.5 w-3.5 text-[#ff6600]" />
            <span>Para mí</span>
          </button>
          <button
            type="button"
            onClick={() => setTarget("Para mi hijo/a")}
            className={`py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              target === "Para mi hijo/a"
                ? "bg-white text-slate-900 shadow-xs font-bold border border-slate-200/80"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <GraduationCap className="h-3.5 w-3.5 text-amber-500" />
            <span>Para mi hijo/a</span>
          </button>
        </div>

        {/* PASO 1: Nombre & Apellido */}
        <div className="space-y-1">
          <div className="grid grid-cols-2 gap-2.5">
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Nombre *"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-3 pr-2 text-slate-900 placeholder:text-slate-400 focus:border-[#ff6600] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#ff6600]/20 transition-all text-xs sm:text-sm"
              />
            </div>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Apellido *"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-3 pr-2 text-slate-900 placeholder:text-slate-400 focus:border-[#ff6600] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#ff6600]/20 transition-all text-xs sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* PASO 2: Correo Electrónico (Se expande suavemente) */}
        {showEmailSection && (
          <div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="relative">
              <input
                type="email"
                required
                placeholder="Correo electrónico *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-9 pr-3 text-slate-900 placeholder:text-slate-400 focus:border-[#ff6600] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#ff6600]/20 transition-all text-xs sm:text-sm"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        )}

        {/* PASO 3: Teléfono / WhatsApp (Se expande suavemente) */}
        {showPhoneSection && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
            {/* Toggle Tipo [ Celular | Fijo ] con Iconos Vectoriales */}
            <div className="grid grid-cols-2 rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-[11px] font-semibold">
              <button
                type="button"
                onClick={() => setPhoneType("Celular")}
                className={`py-1.5 px-2 rounded-md transition-all flex items-center justify-center gap-1.5 ${
                  phoneType === "Celular"
                    ? "bg-white text-slate-800 shadow-2xs font-bold border border-slate-200/60"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Smartphone className="h-3.5 w-3.5 text-emerald-600" />
                <span>Celular / WhatsApp</span>
              </button>
              <button
                type="button"
                onClick={() => setPhoneType("Fijo")}
                className={`py-1.5 px-2 rounded-md transition-all flex items-center justify-center gap-1.5 ${
                  phoneType === "Fijo"
                    ? "bg-white text-slate-800 shadow-2xs font-bold border border-slate-200/60"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Phone className="h-3.5 w-3.5 text-slate-600" />
                <span>Teléfono Fijo</span>
              </button>
            </div>

            {/* Input Teléfono con Lada */}
            <div className="flex items-center gap-2">
              {phoneCode && (
                <span className="shrink-0 rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs font-bold text-slate-600 flex items-center gap-1">
                  <Phone className="h-3 w-3 text-slate-400" />
                  {phoneCode}
                </span>
              )}
              <input
                type="tel"
                required
                placeholder="Número de teléfono *"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3 text-slate-900 placeholder:text-slate-400 focus:border-[#ff6600] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#ff6600]/20 transition-all text-xs sm:text-sm"
              />
            </div>
          </div>
        )}

        {/* PASO 4: Ubicación, Edad y Botón de Envío (Se expande cuando el teléfono está listo) */}
        {showFinalSection ? (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
            {/* País y Estado en fila con Selectores Personalizados */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Select value={country} onValueChange={handleCountryChange}>
                  <SelectTrigger className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50/70 px-2.5 text-xs text-slate-800 focus:border-[#ff6600] focus:ring-1 focus:ring-[#ff6600]/20 shadow-none cursor-pointer">
                    <div className="flex items-center gap-1.5 truncate">
                      <Globe className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <SelectValue placeholder="País" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border border-slate-200 shadow-xl bg-white z-50">
                    {COUNTRIES.map((c) => (
                      <SelectItem key={c.name} value={c.name} className="text-xs">
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                {country === "México" ? (
                  <Select value={state} onValueChange={(val) => setState(val)}>
                    <SelectTrigger className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50/70 px-2.5 text-xs text-slate-800 focus:border-[#ff6600] focus:ring-1 focus:ring-[#ff6600]/20 shadow-none cursor-pointer">
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <SelectValue placeholder="Estado" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border border-slate-200 shadow-xl bg-white max-h-56 z-50">
                      {MEXICAN_STATES.map((st) => (
                        <SelectItem key={st} value={st} className="text-xs">
                          {st}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : country === "Colombia" ? (
                  <Select value={state} onValueChange={(val) => setState(val)}>
                    <SelectTrigger className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50/70 px-2.5 text-xs text-slate-800 focus:border-[#ff6600] focus:ring-1 focus:ring-[#ff6600]/20 shadow-none cursor-pointer">
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <SelectValue placeholder="Departamento" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border border-slate-200 shadow-xl bg-white max-h-56 z-50">
                      {COLOMBIAN_DEPARTMENTS.map((dept) => (
                        <SelectItem key={dept} value={dept} className="text-xs">
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Estado / Región"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50/70 pl-8 pr-2.5 text-xs text-slate-800 focus:border-[#ff6600] focus:bg-white focus:outline-none"
                    />
                    <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                  </div>
                )}
              </div>
            </div>

            {/* Rango de Edad con Selector Personalizado */}
            <div className="space-y-1">
              <Select value={ageRange} onValueChange={(val) => setAgeRange(val)}>
                <SelectTrigger className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50/70 px-3 text-xs text-slate-800 focus:border-[#ff6600] focus:ring-1 focus:ring-[#ff6600]/20 shadow-none cursor-pointer">
                  <div className="flex items-center gap-2 truncate">
                    <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <SelectValue placeholder="Selecciona rango de edad" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-xl border border-slate-200 shadow-xl bg-white z-50">
                  {AGE_RANGES.map((ar) => (
                    <SelectItem key={ar} value={ar} className="text-xs">
                      {ar}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Disclaimer */}
            <p className="text-[10px] leading-relaxed text-slate-500 pt-1">
              Al enviar mis datos autorizo a recibir información y acepto la{" "}
              <Link href="/privacidad" className="underline text-slate-700 hover:text-[#ff6600]">
                Política de Privacidad
              </Link>.
            </p>

            {/* Botón CTA Final */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#ff6600] hover:bg-[#e65500] text-white font-extrabold text-sm sm:text-base shadow-md shadow-orange-500/20 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <span>Comienza ahora</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        ) : (
          /* Botón Siguiente cuando aún no ha terminado de rellenar */
          <button
            type="button"
            onClick={() => {
              setExpandedAll(true);
            }}
            className="w-full py-3 px-5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer mt-1"
          >
            <span>Continuar registro</span>
            <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
          </button>
        )}

        <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px] text-slate-400">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>Tus datos están 100% protegidos y seguros</span>
        </div>
      </form>
    </div>
  );
}
