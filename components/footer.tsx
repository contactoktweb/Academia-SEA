import Link from "next/link"
import Image from "next/image"
import { Facebook, Phone, MapPin, Clock, Heart } from "lucide-react"

import { urlFor } from "@/sanity/lib/image"

export function Footer({ data }: { data?: any }) {
  const logoFooterUrl = data?.logoFooter?.asset
    ? urlFor(data.logoFooter.asset).url()
    : data?.logo?.asset
      ? urlFor(data.logo.asset).url()
      : "/images/SEA_LOGO-02.png"

  const logoAlt = data?.logoFooter?.alt || data?.logo?.alt || "Academia SEA Logo Blanco"
  const facebookLink = data?.redesSociales?.find((r: any) => r.plataforma === "facebook")?.url || "https://www.facebook.com/AcademiaSEA"

  return (
    <footer className="bg-footer-bg text-footer-foreground">
      <div className="mx-auto max-w-[1440px] px-4 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src={logoFooterUrl}
                alt={logoAlt}
                width={250}
                height={60}
                className="h-14 w-auto object-contain transition-transform duration-300 hover:scale-[1.02]"
              />
            </Link>
            <p className="text-sm leading-relaxed text-footer-foreground/80">
              Centro de aprendizaje lider en Jalisco en la enseñanza del idioma ingles con mas de 15 años de experiencia.
            </p>
            <a
              href={facebookLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-footer-foreground/80 transition-colors hover:text-sea-blue-light"
              aria-label="Facebook de Academia SEA"
            >
              <Facebook className="h-5 w-5" />
              <span>/AcademiaSEA</span>
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary-foreground">
              Enlaces
            </h3>
            <ul className="flex flex-col gap-3">
              {[
                { href: "/", label: "Inicio" },
                { href: "/nosotros", label: "Nuestra Escuela" },
                { href: "/cursos", label: "Cursos" },
                { href: "/certificaciones", label: "Certificaciones" },
                { href: "/privacidad", label: "Aviso de Privacidad" },
                { href: "/contacto", label: "Contacto" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-footer-foreground/80 transition-colors hover:text-sea-blue-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Horarios */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary-foreground">
              Horarios
            </h3>
            <ul className="flex flex-col gap-3 text-sm text-footer-foreground/80">
              <li className="flex items-start gap-2">
                <Clock className="mt-0.5 h-4 w-4 shrink-0" />
                <span>Lunes a Viernes: 4:00 PM - 8:00 PM</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="mt-0.5 h-4 w-4 shrink-0" />
                <span>Sabados: 10:00 AM - 2:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary-foreground">
              Contacto
            </h3>
            <ul className="flex flex-col gap-3 text-sm text-footer-foreground/80">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{data?.direccion || "El Grullo, Autlan y Union de Tula, Jalisco"}</span>
              </li>
              {data?.telefonoContacto && (
                <li className="flex items-start gap-2">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{data.telefonoContacto}</span>
                </li>
              )}
              {data?.emailContacto && (
                <li className="flex items-start gap-2">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 hidden" /> {/* dummy icon to maintain spacing if needed, or use Phone/Mail */}
                  <span className="truncate">{data.emailContacto}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-footer-foreground/20 pt-8 md:flex-row">
          <div className="flex flex-col items-center gap-2 md:items-start text-xs text-footer-foreground/60">
            <p>
              &copy; {new Date().getFullYear()} Academia SEA. Todos los derechos reservados.
            </p>
          </div>
          <div className="flex flex-col items-center gap-4 md:flex-row">
            <Link
              href="/privacidad"
              className="text-xs text-footer-foreground/60 transition-colors hover:text-sea-blue-light"
            >
              Aviso de Privacidad
            </Link>
            <span className="hidden text-footer-foreground/40 md:inline-block">•</span>
            <a
              href="https://www.kytcode.lat"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-row items-center gap-1.5 text-xs font-medium text-footer-foreground/80 transition-colors hover:text-white"
            >
              Desarrollado por K&T
              <Heart className="h-3.5 w-3.5 fill-white text-white transition-transform duration-300 group-hover:scale-110" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
