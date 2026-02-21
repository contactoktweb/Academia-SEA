"use client"

import { Mail } from "lucide-react"
import { useState } from "react"

export function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (email) setSubmitted(true)
  }

  return (
    <section className="relative overflow-hidden bg-sea-dark py-20 lg:py-24">
      {/* Decorative dots */}
      <div className="pointer-events-none absolute top-8 left-8 grid grid-cols-5 gap-3 opacity-20">
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className="h-2 w-2 rounded-full bg-sea-blue-light" />
        ))}
      </div>

      <div className="mx-auto max-w-2xl px-4 text-center lg:px-8">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-sea-blue/20 px-4 py-1.5 text-xs font-semibold text-sea-blue-light">
          <Mail className="h-3.5 w-3.5" />
          Newsletter
        </div>
        <h2 className="text-pretty text-3xl font-bold text-primary-foreground md:text-4xl">
          Mantente informado
        </h2>
        <p className="mt-4 text-base leading-relaxed text-footer-foreground/80">
          Suscribete a nuestro boletin para recibir noticias, promociones y actualizaciones sobre
          nuestros cursos y certificaciones.
        </p>

        {submitted ? (
          <div className="mt-8 rounded-xl border border-mint/30 bg-mint/10 px-6 py-4">
            <p className="text-sm font-semibold text-mint">
              Gracias por suscribirte. Pronto recibiras noticias de Academia SEA.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Correo electronico
            </label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              required
              className="w-full max-w-sm rounded-xl border border-footer-foreground/20 bg-footer-bg px-4 py-3 text-sm text-primary-foreground placeholder:text-footer-foreground/40 focus:border-sea-blue focus:ring-2 focus:ring-sea-blue/30 focus:outline-none sm:flex-1"
            />
            <button
              type="submit"
              className="w-full rounded-xl bg-sea-blue px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-sea-blue-light hover:shadow-lg sm:w-auto"
            >
              Suscribirme
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
