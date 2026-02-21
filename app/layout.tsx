import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: {
    default: 'Academia SEA | Escuela de Ingles en Jalisco',
    template: '%s | Academia SEA',
  },
  description:
    'Academia SEA es un centro de aprendizaje lider en Jalisco en la ensenanza del idioma ingles con mas de 15 anos de experiencia. Cursos para todas las edades, certificaciones TOEFL, TOEIC y CENNI.',
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
      'Centro de aprendizaje lider en Jalisco con mas de 15 anos de experiencia en la ensenanza del idioma ingles.',
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
      <body className={`${inter.variable} font-sans antialiased`}>
        <Header />
        <main>{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
