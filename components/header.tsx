"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/nosotros", label: "Nuestra Escuela" },
  { href: "/cursos", label: "Cursos" },
  { href: "/certificaciones", label: "Certificaciones" },
  { href: "/contacto", label: "Contacto" },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sea-blue">
            <span className="text-lg font-bold text-primary-foreground">S</span>
          </div>
          <span className="text-xl font-bold text-heading">
            Academia <span className="text-sea-blue">SEA</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegacion principal">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary hover:text-sea-blue"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/contacto"
            className="rounded-xl bg-sea-blue px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-sea-blue-light"
          >
            Inscribete
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="rounded-lg p-2 text-foreground lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Cerrar menu" : "Abrir menu"}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-card lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4" aria-label="Menu movil">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contacto"
              onClick={() => setMobileOpen(false)}
              className="mt-2 rounded-xl bg-sea-blue px-5 py-3 text-center text-sm font-semibold text-primary-foreground"
            >
              Inscribete
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
