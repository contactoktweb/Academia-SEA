import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Aviso de Privacidad",
  description:
    "Aviso de Privacidad Integral para clientes y alumnos de Academia SEA.",
  openGraph: {
    title: "Aviso de Privacidad | Academia SEA",
    description: "Aviso de Privacidad Integral de Academia SEA.",
  },
}

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

export default function PrivacidadPage() {
  return (
    <section className="bg-background py-16 lg:py-24">
      <div className="mx-auto max-w-3xl px-4 lg:px-8">
        <div className="mb-12">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-sea-blue">
            Legal
          </p>
          <h1 className="text-pretty text-3xl font-extrabold text-heading md:text-4xl">
            Aviso de Privacidad Integral
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">Clientes y Alumnos</p>
        </div>

        <div className="flex flex-col gap-10">
          {sections.map((section) => (
            <article key={section.id} className="flex flex-col gap-3">
              <h2 className="text-lg font-bold text-sea-blue">
                <span className="mr-2 text-heading">{section.id}.</span>
                {section.title}
              </h2>
              <p className="text-sm leading-relaxed text-foreground">
                {section.content}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-border bg-card p-6 text-center">
          <p className="text-xs text-muted-foreground">
            Ultima actualizacion: Enero 2024. Para cualquier duda o aclaracion sobre este
            Aviso de Privacidad, contactenos en cualquiera de nuestras sucursales o a traves de
            nuestras lineas telefonicas.
          </p>
        </div>
      </div>
    </section>
  )
}
