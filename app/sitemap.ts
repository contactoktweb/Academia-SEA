import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://www.academiasea.mx'

    // Definimos las rutas principales del sitio
    const routes = [
        '',
        '/nosotros',
        '/cursos',
        '/certificaciones',
        '/contacto',
        '/privacidad',
    ]

    return routes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: route === '' ? 1 : 0.8,
    }))
}
