"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Menu, X, User } from "lucide-react"
import { usePathname } from "next/navigation"

import { urlFor } from "@/sanity/lib/image"

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/nosotros", label: "Nuestra Escuela" },
  { href: "/cursos", label: "Cursos" },
  { href: "/certificaciones", label: "Certificaciones" },
  { href: "/privacidad", label: "Privacidad" },
  { href: "/contacto", label: "Contacto" },
]

export function Header({ data }: { data?: any }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const logoUrl = data?.logo?.asset ? urlFor(data.logo.asset).url() : "/images/SEA_LOGO-05.png"
  const logoAlt = !data?.logo?.alt || data.logo.alt.toLowerCase().includes("logo")
    ? "Academia SEA - Escuela de Inglés con Excelencia Académica en Jalisco"
    : data.logo.alt

  return (
    <div className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "pt-2" : "pt-4"}`}>
      <header className={`mx-auto max-w-[1440px] px-4 md:px-6 transition-all duration-300`}>
        <div className={`relative flex items-center justify-between rounded-full bg-white backdrop-blur-md border border-slate-200/50 shadow-sm transition-all duration-300 px-6 h-16 ${scrolled ? "shadow-md" : ""}`}>
          {/* Logo */}
          <Link href="/" className="relative z-50 flex flex-shrink-0 items-center gap-2">
            <Image
              src={logoUrl}
              alt={logoAlt}
              width={160}
              height={40}
              className="w-28 md:w-36 h-auto object-contain transition-transform duration-300 hover:scale-[1.02]"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-2 lg:flex" aria-label="Navegacion principal">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors hover:bg-slate-100 hover:text-sea-blue ${isActive ? "bg-slate-100 text-sea-blue" : "text-slate-700"
                    }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* CTA & Login */}
          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-1.5 text-sm font-bold text-slate-700 transition-all hover:bg-slate-100 hover:text-sea-blue"
              title="Acceso Usuarios"
            >
              <User className="h-4 w-4" />
              <span>Ingresar</span>
            </Link>
            <Link
              href="/contacto"
              className="rounded-full bg-sea-blue px-6 py-1.5 text-sm font-bold text-white transition-all hover:bg-sea-blue-light hover:scale-105 shadow-md shadow-sea-blue/20"
            >
              Inscríbete
            </Link>
          </div>

          {/* Mobile toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href="/login"
              className="flex items-center justify-center rounded-full border border-slate-200 p-2 text-slate-700"
              aria-label="Acceso Usuarios"
            >
              <User className="h-5 w-5" />
            </Link>
            <button
              className="rounded-full p-2 text-slate-700 hover:bg-slate-100 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileOpen ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0 mt-0"
            }`}
        >
          <div className="rounded-3xl bg-white/95 backdrop-blur-md border border-slate-200/50 shadow-xl p-3 flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-2xl px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-slate-100 hover:text-sea-blue ${isActive ? "bg-slate-100 text-sea-blue" : "text-slate-700"
                    }`}
                >
                  {link.label}
                </Link>
              )
            })}
            <Link
              href="/contacto"
              onClick={() => setMobileOpen(false)}
              className="mt-1 rounded-2xl bg-sea-blue px-4 py-3 text-center text-sm font-bold text-white shadow-md"
            >
              Inscríbete
            </Link>
          </div>
        </div>
      </header>
    </div>
  )
}
