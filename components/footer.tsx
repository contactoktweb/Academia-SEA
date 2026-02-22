import Link from "next/link"
import { Facebook, Phone, MapPin, Clock } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-footer-bg text-footer-foreground">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sea-blue">
                <span className="text-lg font-bold text-primary-foreground">S</span>
              </div>
              <span className="text-xl font-bold text-primary-foreground">
                Academia <span className="text-sea-blue-light">SEA</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-footer-foreground/80">
              Centro de aprendizaje lider en Jalisco en la enseñanza del idioma ingles con mas de 15 años de experiencia.
            </p>
            <a
              href="https://www.facebook.com/AcademiaSEA"
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
                { href: "/contacto", label: "Contacto" },
                { href: "/privacidad", label: "Aviso de Privacidad" },
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
                <span>Lunes a Viernes: 7:00 AM - 8:00 PM</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="mt-0.5 h-4 w-4 shrink-0" />
                <span>Sabados: 8:00 AM - 2:00 PM</span>
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
                <span>El Grullo, Autlan y Union de Tula, Jalisco</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0" />
                <span>321 387 57 02 (El Grullo)</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0" />
                <span>317 382 30 60 (Autlan)</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0" />
                <span>316 688 08 19 (Union de Tula)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-footer-foreground/20 pt-8 md:flex-row">
          <p className="text-xs text-footer-foreground/60">
            &copy; {new Date().getFullYear()} Academia SEA. Todos los derechos reservados.
          </p>
          <Link
            href="/privacidad"
            className="text-xs text-footer-foreground/60 transition-colors hover:text-sea-blue-light"
          >
            Aviso de Privacidad
          </Link>
        </div>
      </div>
    </footer>
  )
}
