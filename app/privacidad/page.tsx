"use client"

import { ShieldCheck, ChevronDown } from "lucide-react"
import { useState } from "react"

const sections = [
  {
    id: "A",
    title: "Identidad y domicilio del Responsable",
    content:
      'Academia SEA, con domicilio en Jalisco, Mexico, es responsable del tratamiento de los datos personales que nos proporcione, los cuales seran protegidos conforme a lo dispuesto por la Ley Federal de Proteccion de Datos Personales en Posesion de los Particulares ("la Ley"), su Reglamento y los Lineamientos del Aviso de Privacidad.',
  },
  {
    id: "B",
    title: "Datos personales que se recaban",
    content:
      "Para las finalidades senaladas en el presente Aviso de Privacidad, podemos recabar sus datos personales de distintas formas: cuando usted nos los proporciona directamente, cuando visita nuestro sitio web o utiliza nuestros servicios en linea, y cuando obtenemos informacion a traves de otras fuentes que estan permitidas por la Ley. Los datos personales que recabamos incluyen: nombre completo, direccion, correo electronico, numero telefonico, fecha de nacimiento, datos de identificacion oficial, comprobante de domicilio y datos academicos.",
  },
  {
    id: "C",
    title: "Datos personales sensibles",
    content:
      'Le informamos que para cumplir con las finalidades previstas en este Aviso de Privacidad, no es necesario que nos proporcione datos personales considerados como "sensibles" por la Ley. En caso de requerir datos de salud para actividades academicas especificas, se le solicitara su consentimiento expreso por separado.',
  },
  {
    id: "D",
    title: "Finalidades del tratamiento de datos",
    content:
      "Los datos personales que recabamos seran utilizados para las siguientes finalidades necesarias: registro e inscripcion de alumnos, administracion de expedientes academicos, emision de constancias y certificados, comunicacion de avisos y notificaciones escolares, control de asistencia y evaluaciones, facturacion y cobranza de colegiaturas, y atencion de solicitudes de informacion.",
  },
  {
    id: "E",
    title: "Finalidades secundarias",
    content:
      "De manera adicional, utilizaremos su informacion personal para las siguientes finalidades que no son necesarias para la prestacion del servicio, pero que nos permiten brindarle una mejor atencion: envio de comunicaciones promocionales, invitaciones a eventos academicos y culturales, elaboracion de estadisticas y reportes internos, y encuestas de satisfaccion. En caso de que no desee que sus datos personales sean tratados para estas finalidades secundarias, puede comunicarlo al correo electronico de contacto de la academia.",
  },
  {
    id: "F",
    title: "Mecanismos para manifestar la negativa al tratamiento",
    content:
      "Usted puede manifestar su negativa para el tratamiento de sus datos personales para las finalidades secundarias en cualquier momento, comunicandose con nuestro departamento de datos personales a traves del correo electronico de la academia o presentandose directamente en cualquiera de nuestras sucursales.",
  },
  {
    id: "G",
    title: "Transferencias de datos personales",
    content:
      "Le informamos que sus datos personales pueden ser transferidos y tratados dentro y fuera del pais, a las siguientes entidades: autoridades educativas (SEP) para la emision de certificaciones y validacion de estudios, organismos certificadores internacionales (ETS para TOEFL y TOEIC) para la aplicacion y registro de examenes de certificacion, y autoridades competentes en caso de ser requerido por disposicion legal.",
  },
  {
    id: "H",
    title: "Derechos ARCO (Acceso, Rectificacion, Cancelacion y Oposicion)",
    content:
      "Usted tiene derecho a conocer que datos personales tenemos de usted, para que los utilizamos y las condiciones del uso que les damos (Acceso). Asimismo, es su derecho solicitar la correccion de su informacion personal en caso de que este desactualizada, sea inexacta o incompleta (Rectificacion); que la eliminemos de nuestros registros cuando considere que no esta siendo utilizada adecuadamente (Cancelacion); asi como oponerse al uso de sus datos personales para fines especificos (Oposicion). Para ejercer estos derechos, debera presentar una solicitud por escrito en cualquiera de nuestras sucursales o enviar un correo electronico al departamento de datos personales de la academia.",
  },
  {
    id: "I",
    title: "Procedimiento para ejercer los Derechos ARCO",
    content:
      "La solicitud debera contener: nombre completo del titular, domicilio o correo electronico para comunicar la respuesta, documentos que acrediten la identidad del titular, descripcion clara y precisa de los datos personales respecto de los cuales se busca ejercer alguno de los derechos mencionados, y cualquier otro elemento o documento que facilite la localizacion de los datos personales. La academia respondera en un plazo maximo de 20 dias habiles contados desde la fecha en que se recibio la solicitud.",
  },
  {
    id: "J",
    title: "Uso de cookies y tecnologias de rastreo",
    content:
      "Le informamos que en nuestro sitio web utilizamos cookies y otras tecnologias a traves de las cuales es posible monitorear su comportamiento como usuario de Internet, brindarle un mejor servicio y experiencia al navegar en nuestra pagina, asi como ofrecerle nuevos productos y servicios basados en sus preferencias. Los datos personales que obtenemos de estas tecnologias de rastreo son: horario de navegacion, tiempo de navegacion en nuestra pagina de Internet, secciones consultadas y paginas de Internet accedidas previo a la nuestra.",
  },
  {
    id: "K",
    title: "Modificaciones al Aviso de Privacidad",
    content:
      "Nos reservamos el derecho de efectuar en cualquier momento modificaciones o actualizaciones al presente Aviso de Privacidad, para la atencion de novedades legislativas, politicas internas o nuevos requerimientos para la prestacion u ofrecimiento de nuestros servicios. Estas modificaciones estaran disponibles al publico a traves de nuestro sitio web www.academiasea.mx y en nuestras instalaciones fisicas.",
  },
  {
    id: "L",
    title: "Consentimiento",
    content:
      "Al proporcionar sus datos personales a Academia SEA, ya sea de forma directa o a traves de nuestros medios electronicos, usted manifiesta su consentimiento para que sus datos sean tratados conforme a los terminos y condiciones del presente Aviso de Privacidad. Si usted no manifiesta su oposicion para que sus datos personales sean transferidos, se entendera que ha otorgado su consentimiento para ello.",
  },
]

function AccordionItem({ section }: { section: (typeof sections)[0] }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-md">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center gap-4 p-6 text-left transition-colors hover:bg-secondary/50"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sea-blue/10 text-sm font-extrabold text-sea-blue">
          {section.id}
        </span>
        <span className="flex-1 text-sm font-bold text-heading lg:text-base">{section.title}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-border px-6 pb-6 pt-4">
            <p className="text-sm leading-relaxed text-muted-foreground">{section.content}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PrivacidadPage() {
  return (
    <>
      {/* Hero - minimal legal style */}
      <section className="relative overflow-hidden bg-[#0c1b3a]">
        <div className="pointer-events-none absolute -top-40 -left-40 h-[400px] w-[400px] rounded-full bg-sea-blue/10 blur-[140px]" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sea-blue to-sea-blue-light shadow-lg shadow-sea-blue/20">
              <ShieldCheck className="h-8 w-8 text-white" />
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-wider text-slate-300 backdrop-blur-sm">
              Documento Legal
            </span>
            <h1 className="mt-6 text-pretty text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
              Aviso de Privacidad Integral
            </h1>
            <p className="mt-4 text-base text-slate-400">
              Clientes y Alumnos de Academia SEA
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 z-10 w-full">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
            <path d="M0 60V30C360 0 720 10 1080 30C1260 40 1380 45 1440 30V60H0Z" className="fill-background" />
          </svg>
        </div>
      </section>

      {/* Content - accordion style */}
      <section className="bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          {/* Quick nav */}
          <div className="mb-12 flex flex-wrap items-center justify-center gap-2">
            {sections.map((s) => (
              <span
                key={s.id}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-xs font-bold text-muted-foreground"
              >
                {s.id}
              </span>
            ))}
          </div>

          {/* Accordion */}
          <div className="flex flex-col gap-3">
            {sections.map((section) => (
              <AccordionItem key={section.id} section={section} />
            ))}
          </div>

          {/* Footer note */}
          <div className="mt-16 overflow-hidden rounded-3xl bg-gradient-to-br from-sea-blue/10 to-mint/10 p-px">
            <div className="rounded-3xl bg-card p-8 text-center">
              <ShieldCheck className="mx-auto mb-3 h-8 w-8 text-sea-blue" />
              <p className="text-sm font-semibold text-heading">Ultima actualizacion: Enero 2024</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Para cualquier duda o aclaracion sobre este Aviso de Privacidad, contactenos en
                cualquiera de nuestras sucursales o a traves de nuestras lineas telefonicas.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
