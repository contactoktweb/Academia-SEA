import { Metadata } from "next";
import Link from "next/link";
import { 
  CheckCircle2, 
  PhoneCall, 
  MessageSquare, 
  Clock, 
  GraduationCap, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  Languages, 
  BookMarked, 
  BadgeCheck 
} from "lucide-react";

export const metadata: Metadata = {
  title: "¡Registro Recibido! Próximos Pasos | Academia SEA",
  description: "Gracias por registrarte en Academia SEA. En unos minutos un asesor educativo se pondrá en contacto contigo para brindarte tu oferta especial.",
  robots: {
    index: false,
    follow: false,
  },
};

interface FormularioPageProps {
  searchParams: Promise<{
    leadId?: string;
    name?: string;
    country?: string;
    target?: string;
    ageRange?: string;
    phone?: string;
  }>;
}

export default async function FormularioAgradecimientoPage(props: FormularioPageProps) {
  const searchParams = await props.searchParams;
  const rawName = searchParams?.name ? decodeURIComponent(searchParams.name) : "";
  const leadName = rawName || "Aspirante";
  const rawPhone = searchParams?.phone ? decodeURIComponent(searchParams.phone) : "";
  const rawTarget = searchParams?.target ? decodeURIComponent(searchParams.target) : "Para mí";
  const rawAge = searchParams?.ageRange ? decodeURIComponent(searchParams.ageRange) : "";

  // WhatsApp Pre-filled message
  const whatsappNumber = "523171035728"; // Academia SEA WhatsApp
  const whatsappText = encodeURIComponent(
    `Hola Academia SEA, me acabo de registrar en su página web (${leadName}) y me gustaría recibir información sobre la oferta especial para el curso de inglés (${rawTarget}).`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappText}`;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 pt-28 md:pt-36 pb-20">
      {/* ─── Hero Section: Status & Immediate Assurance ─── */}
      <section className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Success Pill */}
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200/80 px-4 py-1.5 text-xs font-bold text-emerald-800 shadow-xs mb-6 animate-in fade-in zoom-in duration-300">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>¡Solicitud recibida con éxito!</span>
        </div>

        {/* Motivational Pre-title */}
        <p className="text-sm md:text-base font-extrabold italic text-[#0066cc] uppercase tracking-wider mb-3">
          ¡Éxito! Este año cumples tu meta de hablar inglés
        </p>

        {/* Single H1 on Page */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15] max-w-3xl mx-auto">
          En unos 5 a 10 minutos, <br className="hidden sm:inline" />
          te contactaremos para ayudarte con tu{" "}
          <span className="text-[#0066cc]">oferta especial</span>.
        </h1>

        {/* Reassuring Paragraph */}
        <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Hola <strong className="text-slate-900">{leadName}</strong>, hemos registrado tus datos. Un asesor educativo especializado de Academia SEA te llamará al{" "}
          {rawPhone ? <strong className="text-slate-900">{rawPhone}</strong> : "número registrado"}{" "}
          para resolver todas tus dudas sobre horarios, profesores y aplicar tu promoción.
        </p>

        {/* Action Box: Immediate WhatsApp Contact */}
        <div className="mt-8 rounded-2xl bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/60 border border-slate-100 max-w-xl mx-auto text-center space-y-4">
          <p className="text-sm font-semibold text-slate-700 flex items-center justify-center gap-2">
            <Clock className="h-4 w-4 text-amber-500" />
            ¿Ansioso por comenzar de inmediato?
          </p>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#ff6600] to-[#ff5000] hover:from-[#ff5500] hover:to-[#e64600] text-white font-extrabold text-base sm:text-lg py-4 px-8 shadow-lg shadow-orange-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.99]"
          >
            <MessageSquare className="h-5 w-5" />
            <span>¡Escríbenos por WhatsApp ya!</span>
          </a>

          <p className="text-xs text-slate-500 leading-relaxed pt-1">
            *También es posible que te enviemos un mensaje directo de WhatsApp para facilitarte el contacto. ¡Mantente atento a tu teléfono!
          </p>
        </div>
      </section>

      {/* ─── Next Steps Section ─── */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-16 sm:mt-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            ¿Cuáles son los próximos pasos?
          </h2>
          <p className="text-sm sm:text-base text-slate-500 mt-2">
            El camino más rápido y confiable para dominar el idioma inglés
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="rounded-2xl bg-white p-6 border border-slate-200/70 shadow-sm hover:shadow-md transition-shadow relative flex flex-col">
            <div className="h-12 w-12 rounded-xl bg-blue-50 text-[#0066cc] flex items-center justify-center mb-4 font-bold text-lg">
              <PhoneCall className="h-6 w-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
              Paso 1
            </span>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              1. Te contactaremos
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Un asesor educativo te llamará para conocer tus objetivos y presentarte las modalidades disponibles (Presencial u Online en vivo).
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl bg-white p-6 border border-slate-200/70 shadow-sm hover:shadow-md transition-shadow relative flex flex-col">
            <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 font-bold text-lg">
              <Sparkles className="h-6 w-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">
              Paso 2
            </span>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              2. Asesoría y Oferta Especial
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Te ayudamos a elegir el mejor horario, nivel y aplicamos tus descuentos o becas de temporada manteniendo tus datos 100% seguros.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl bg-white p-6 border border-slate-200/70 shadow-sm hover:shadow-md transition-shadow relative flex flex-col">
            <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 font-bold text-lg">
              <GraduationCap className="h-6 w-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">
              Paso 3
            </span>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              3. ¡Comienzas tu curso!
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Recibirás de inmediato tu acceso a la plataforma o detalles de tu sede física y tu material Macmillan para arrancar con éxito.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Placement Test Callout ─── */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-14">
        <div className="rounded-3xl bg-gradient-to-br from-[#1a2b4a] via-[#1e3a5f] to-[#122238] p-8 sm:p-10 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 grid md:grid-cols-12 items-center gap-6">
            <div className="md:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 border border-blue-400/30 px-3 py-1 text-xs font-semibold text-blue-200">
                <Award className="h-3.5 w-3.5" />
                Diagnóstico Oficial Gratuito
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                ¿Quieres ir conociendo tu nivel de inglés actual?
              </h3>
              <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                Toma nuestro examen de ubicación interactivo en solo 5 minutos. Conoce al instante tu puntaje y nivel MCER (A1 a C1).
              </p>
            </div>
            <div className="md:col-span-4 flex justify-start md:justify-end">
              <Link
                href="/examen-ubicacion"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-[#1a2b4a] shadow-lg transition-all hover:bg-slate-100 hover:scale-105"
              >
                <span>Hacer Examen Gratis</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Trust and Official Certifications Bar ─── */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-14 pt-8 border-t border-slate-200 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">
          Más de 15 años de respaldo académico oficial
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 text-slate-500">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <GraduationCap className="h-5 w-5 text-slate-700" />
            <span>Validez Oficial SEP</span>
          </div>
          <div className="flex items-center gap-2 font-semibold text-sm">
            <Languages className="h-5 w-5 text-slate-700" />
            <span>Preparación TOEFL & TOEIC</span>
          </div>
          <div className="flex items-center gap-2 font-semibold text-sm">
            <BookMarked className="h-5 w-5 text-slate-700" />
            <span>Metodología Macmillan</span>
          </div>
          <div className="flex items-center gap-2 font-semibold text-sm">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <span>Sedes en Jalisco & Online</span>
          </div>
        </div>
      </section>
    </main>
  );
}
