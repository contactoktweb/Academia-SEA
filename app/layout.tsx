import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { Analytics } from '@vercel/analytics/next'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import './globals.css'
//
const gotham = localFont({
  src: [
    {
      path: '../public/gotham-book/gotham book/Gotham-Book.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/gotham-bold/gotham bold/Gotham-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/gotham-black/gotham black/Gotham-Black.ttf',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-gotham',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Academia SEA | Escuela de Ingles en Jalisco',
    template: '%s | Academia SEA',
  },
  description:
    'Academia SEA es un centro de aprendizaje lider en Jalisco en la enseñanza del idioma ingles con mas de 15 años de experiencia. Cursos para todas las edades, certificaciones TOEFL, TOEIC y CENNI.',
  keywords: [
    'escuela de ingles',
    'academia de ingles Jalisco',
    'cursos de ingles',
    'TOEFL',
    'TOEIC',
    'CENNI',
    'Academia SEA',
    'ingles Autlan',
    'ingles El Grullo',
    'ingles Union de Tula',
  ],
  openGraph: {
    title: 'Academia SEA | Escuela de Ingles en Jalisco',
    description:
      'Centro de aprendizaje lider en Jalisco con mas de 15 años de experiencia en la enseñanza del idioma ingles.',
    url: 'https://www.academiasea.mx',
    siteName: 'Academia SEA',
    locale: 'es_MX',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#3B82F6',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${gotham.variable} font-sans antialiased`}>
        <Header />
        <main>{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
