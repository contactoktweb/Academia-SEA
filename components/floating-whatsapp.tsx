import Link from "next/link"
import { WhatsappIcon } from "@/components/whatsapp-icon"

interface FloatingWhatsAppProps {
    /** Full international number without spaces or +. E.g. 523213875702 */
    numero: string
    mensaje?: string
}

export function FloatingWhatsApp({ numero, mensaje }: FloatingWhatsAppProps) {
    if (!numero) return null

    const encodedMsg = mensaje
        ? `?text=${encodeURIComponent(mensaje)}`
        : ""
    const href = `https://wa.me/${numero}${encodedMsg}`

    return (
        <Link
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contáctanos por WhatsApp"
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] shadow-lg shadow-black/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30 hover:bg-[#20b858]"
        >
            <WhatsappIcon className="h-7 w-7 text-white" />
        </Link>
    )
}
