"use client"

import { ShieldCheck, ChevronDown } from "lucide-react"
import { useState } from "react"
import { SubpageHero } from "@/components/subpage-hero"

const sections = [
  {
    id: "A",
    title: "Identidad y domicilio del Responsable",
    content: (
      <>
        En virtud de lo dispuesto por la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (en adelante, la “LFPD”) y resto de disposiciones aplicables, Academia de inglés SEA (en adelante e indistintamente, “SEA” o el “Responsable”), con domicilio para oír y recibir notificaciones en Hidalgo #174 El Grullo, Jalisco, cp 48740; le informa de forma expresa:
        <br /><br />
        Datos de identificación y de contacto,<br />
        Datos de características personales,<br />
        Datos académicos y profesionales,<br />
        Datos laborales,<br />
        Datos patrimoniales y/o financieros.
      </>
    ),
  },
  {
    id: "B",
    title: "Datos personales recabados y sometidos a tratamiento. Datos de menores de edad",
    content: (
      <>
        Para el desarrollo de las finalidades descritas en el presente Aviso de Privacidad, recabamos o podemos recabar las siguientes categorías de datos personales:
        <br /><br />
        SEA no recaba directamente datos personales de menores de edad a través de formularios, cuestionarios, ni a través de su página web.
        <br /><br />
        SEA únicamente trata aquéllos datos personales proporcionados por sus padres y/o tutores, con el consentimiento de estos últimos, en todos los casos.
        <br /><br />
        Si cualquier titular de datos personales fuera menor de edad en el momento de proporcionar su información a SEA, el Responsable considerará que dicho titular cuenta con la autorización de sus padres o tutores para hacerlo y que ha informado a ellos de la finalidad de entrega de sus datos, salvo prueba o declaración en contrario.
        <br /><br />
        Los padres o tutores de menores de edad podrán ejercer en todo momento los derechos reconocidos por la LFPD en relación con los datos personales de los menores a su cargo, y dirigir cualquier aclaración sobre el uso de dichos datos al Responsable, a través de los medios establecidos en el presente Aviso de Privacidad.
        <br /><br />
        SEA recaba datos personales para cumplir con las finalidades originarias y necesarias derivadas de la relación jurídica entre usted y nosotros. Al proporcionar datos personales relacionados con sus familiares y/o con otro tipo de terceros, usted reconoce tener el consentimiento de éstos para que SEA trate sus datos personales exclusivamente para cumplir con las finalidades señaladas en el presente Aviso.
      </>
    ),
  },
  {
    id: "C",
    title: "Tratamiento de datos personales sensibles",
    content: "Para el cumplimiento de las finalidades indicadas en el siguiente apartado, el Responsable no recaba datos personales sensibles.",
  },
  {
    id: "D",
    title: "Finalidades del tratamiento",
    content: (
      <>
        <strong>a. Finalidades originarias y necesarias:</strong>
        <ul className="list-disc pl-5 mt-2 space-y-2">
          <li>Contratación de los servicios prestados por SEA, en sus modalidades presencial y online.</li>
          <li>Gestión, control, administración y actualización de la información relacionada con clientes y alumnos para la prestación de los servicios contratados.</li>
          <li>Gestión, control, administración y actualización de información de personas físicas que actúan como representantes legales o contactos designados de personas morales, que contratan servicios prestados por el Responsable.</li>
          <li>Gestión, control y administración de las comunicaciones entre el Responsable y los alumnos y clientes.</li>
          <li>Facturación de los servicios y productos proporcionados, así como su cobro judicial o extrajudicial.</li>
          <li>Impartición, evaluación y seguimiento de los cursos educativos impartidos por SEA, incluyendo la realización de pruebas de nivel sobre el conocimiento y uso de idiomas.</li>
          <li>En su caso, comunicación de los resultados sobre aprovechamiento y pruebas de nivel de los alumnos, hacia aquellas personas que han contratado los servicios del Responsable o hacia autoridades administrativas que legalmente deban conocerlos.</li>
          <li>Monitorización electrónica del aprovechamiento de los cursos impartidos por el Responsable.</li>
          <li>Atención a alumnos y clientes a través de medios electrónicos.</li>
          <li>Estadística y registro histórico de alumnos y clientes.</li>
        </ul>
        <br />
        En todo momento, usted podrá revocar su consentimiento para el tratamiento de sus datos personales en relación con las finalidades adicionales indicadas, mediante los mecanismos previstos en este Aviso de Privacidad y de conformidad con la legislación vigente.
      </>
    ),
  },
  {
    id: "E",
    title: "Transferencias de datos personales",
    content: (
      <>
        Sus datos personales pueden ser transferidos y tratados por personas distintas al Responsable en los siguientes supuestos:
        <ul className="list-decimal pl-5 mt-2 space-y-2">
          <li>Sociedades controladoras, subsidiarias o afiliadas del Responsable, o a una sociedad matriz; con finalidades de resguardo centralizado de la información, control de altas y bajas, cambios relacionados con su contrato, así como para la realización de funciones de estadística y registro histórico de clientes.</li>
          <li>Autoridades, organismos o entidades gubernamentales; en cumplimiento a las obligaciones contempladas en la legislación aplicable y/o en cumplimiento de requerimientos efectuados por las mismas.</li>
          <li>Empresas de cobranza, para la recuperación de créditos impagados y su cobro judicial o extrajudicial.</li>
          <li>Responsables de la relación jurídica o terceros con los cuales el alumno tenga una relación económica o civil (patrones, responsables del pago, padres o tutores).</li>
        </ul>
      </>
    ),
  },
  {
    id: "F",
    title: "Consentimiento para la transferencia de datos.",
    content: "Para efectuar las transferencias indicadas en los numerales 1 a 4 del apartado anterior, no se requiere su consentimiento de conformidad con el artículo 37 de la LFPD. En todos los demás casos, sus datos personales no serán transferidos a terceros sin su consentimiento, salvo las excepciones previstas en el artículo 37 de la LFPD y en todo caso cumpliendo las condiciones previstas en el artículo 17 del Reglamento de la LFPD.",
  },
  {
    id: "G",
    title: "Ejercicio de los derechos ARCO",
    content: (
      <>
        En todos aquellos casos legalmente procedentes, usted podrá ejercer en todo momento sus derechos de Acceso, Rectificación, Cancelación y Oposición (ARCO) a través de los procedimientos que hemos implementado.
        <br /><br />
        La solicitud correspondiente deberá cumplir con los requisitos establecidos en la legislación vigente, mediante escrito dirigido a nuestro Departamento de Datos Personales, al domicilio indicado en el inciso A de este Aviso. La solicitud deberá contener y acompañar lo siguiente:
        <ul className="list-disc pl-5 mt-2 mb-2 space-y-2">
          <li>Su nombre y domicilio u otro medio para comunicarle la respuesta a su solicitud;</li>
          <li>Los documentos que acrediten su identidad o, en su caso, la representación legal;</li>
          <li>La descripción clara y precisa de los datos personales respecto de los que se busca ejercer alguno de los Derechos ARCO; y</li>
          <li>Cualquier otro elemento o documento que facilite la localización de los datos personales.</li>
        </ul>
        El Responsable le comunicará, en un plazo máximo de veinte días hábiles, contados desde la fecha en que aquél reciba la solicitud correspondiente, la determinación adoptada. Si la solicitud resulta procedente, ésta se hará efectiva dentro de los quinces días hábiles siguientes a la fecha en que el Responsable comunique la respuesta. En caso de que la información proporcionada en su solicitud resulte errónea o insuficiente, o no se acompañen los documentos necesarios para acreditar su identidad o la representación legal correspondiente, el Responsable, dentro de los cinco días hábiles siguientes a la recepción de su solicitud, requerirá la subsanación de las deficiencias para poder dar trámite a la misma. En estos casos, usted contará con diez días hábiles para atender el requerimiento de subsanación, contados a partir del día siguiente en que hubiere recibido esta solicitud. La solicitud correspondiente se tendrá por no presentada si usted no responde dentro de dicho plazo.
        <br /><br />
        Alternativamente, usted podrá dirigir su solicitud a través de la dirección seaacademia@gmail.com, cumpliendo con todos los requisitos anteriormente enumerados, estableciendo como Asunto de la comunicación “Derechos ARCO y/o Revocación del consentimiento”. Los plazos del procedimiento serán los mismos a los mencionados en este apartado. El uso de medios electrónicos para el ejercicio de los derechos ARCO autoriza al Responsable para dar respuesta a la solicitud correspondiente a través del mismo medio, salvo que el propio titular indique otro medio de forma clara y expresa.
        <br /><br />
        Usted podrá obtener la información o datos personales solicitados a través de copias simples, documentos electrónicos en formatos convencionales (Word, PDF, etc.), o a través de cualquier otro medio legítimo que garantice y acredite el ejercicio efectivo del derecho solicitado.
        <br /><br />
        Usted será responsable de mantener actualizados sus datos personales en posesión del Responsable. Por lo anterior, usted garantiza y responde, en cualquier caso, de la veracidad, exactitud, vigencia y autenticidad de los datos personales facilitados, y se compromete a mantenerlos debidamente actualizados, comunicando cualquier cambio al Responsable.
      </>
    ),
  },
  {
    id: "H",
    title: "Revocación del consentimiento",
    content: "Usted podrá revocar su consentimiento para el tratamiento de sus datos personales, sin efectos retroactivos, en todos aquellos casos en que dicha revocación no suponga la imposibilidad de cumplir obligaciones derivadas de una relación jurídica vigente entre usted y el Responsable. El procedimiento para la revocación del consentimiento, en su caso, será el mismo que el establecido en el apartado inmediato anterior para el ejercicio de los derechos ARCO.",
  },
  {
    id: "I",
    title: "Limitaciones sobre el uso y divulgación de sus datos personales",
    content: "Usted podrá limitar el uso o divulgación de sus datos personales dirigiendo la solicitud correspondiente a nuestro Departamento de Datos Personales. Los requisitos para acreditar su identidad, así como el procedimiento para atender su solicitud serán los mismos que los señalados para el ejercicio de los derechos ARCO. El Responsable cuenta con medios y procedimientos para asegurar la inclusión de algunos de sus datos en listados de exclusión propios, cuando usted solicita su inclusión en ellos de forma expresa. El Responsable otorgará a los titulares que soliciten su registro, la constancia de inscripción correspondiente.",
  },
  {
    id: "J",
    title: "Medios automáticos para recabar datos personales",
    content: (
      <>
        El Responsable utiliza cookies para facilitar la navegación y la contratación de cursos online en el sitio web www.academiasea.com. Si usted navega a través de dicho sitio y/o contrata servicios online a través del mismo, las cookies utilizadas por SEA nos permitirán recopilar, analizar y conservar información técnica relacionada con sus hábitos de navegación y uso de dichos servicios, a través de dichos medios electrónicos que permiten recabar esta información de forma automática, en el momento mismo en que el usuario hace uso de nuestros servicios electrónicos. También podemos recolectar información usando “web beacons”, “pixel tags” o medios similares (genéricamente “web beacons”) que nos permiten obtener información no personal o agregada, como por ejemplo nombres de dominio, las áreas del sitio que usted visite, su sistema operativo, la versión de sistema operativo que usa, la versión del navegador y el URL previo a su visita. Esta información es usada para mejorar su experiencia en el sitio y entender patrones de tráfico.
        <br /><br />
        Para obtener información más detallada acerca de las cookies y la forma en que puede deshabilitarlas en función de su navegador y sistema operativo, recomendamos visitar el sitio www.allaboutcookies.org. Si desactiva las cookies, es posible que usted no pueda usar determinadas partes del sitio web www.academiasea.com.
      </>
    ),
  },
  {
    id: "K",
    title: "Modificaciones o actualizaciones al presente Aviso de Privacidad Integral",
    content: "El Responsable podrá modificar, actualizar, extender o de cualquier otra forma cambiar el contenido y alcance del presente Aviso de Privacidad, en cualquier momento y bajo su completa discreción. En tales casos, publicaremos dichos cambios en el sitio web www.academiasea.com Sección “Avisos de Privacidad”. También podrán comunicarse cambios al presente Aviso de Privacidad vía correo electrónico, cuando dicho medio hubiese sido establecido como canal de comunicación entre usted y el Responsable, durante la vigencia de una relación jurídica.",
  },
  {
    id: "L",
    title: "Negativa(s) para el tratamiento",
    content: "No deseo recibir información y ofertas comerciales sobre productos y/o servicios comercializados por el Responsable.",
  },
];

function AccordionItem({ section }: { section: (typeof sections)[0] | any }) {
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
        className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-border px-6 pb-6 pt-4">
            <div className="text-sm leading-relaxed text-muted-foreground">{section.content}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PrivacidadPage() {
  return (
    <>
      {/* Hero - Light themed centered */}
      <SubpageHero
        badge="Documento Legal"
        badgeIcon={ShieldCheck}
        title="Aviso de Privacidad Integral"
        subtitle="Clientes y Alumnos de Academia SEA"
      />

      {/* Content - accordion style */}
      <section className="bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">

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
              <p className="text-sm font-semibold text-heading">Ultima actualizacion: Enero 2021</p>
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
