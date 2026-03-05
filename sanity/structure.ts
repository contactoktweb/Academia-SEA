import type { StructureResolver } from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Contenido Web')
    .items([
      // Our Singleton global configuration
      S.listItem()
        .title('Configuración Global')
        .id('globalConfig')
        .child(
          S.document()
            .schemaType('globalConfig')
            .documentId('globalConfig')
        ),
      S.listItem()
        .title('Hero - Inicio')
        .id('heroHome')
        .child(
          S.document()
            .schemaType('heroHome')
            .documentId('heroHome')
        ),
      S.listItem()
        .title('¿Por qué elegirnos?')
        .id('whySection')
        .child(
          S.document()
            .schemaType('whySection')
            .documentId('whySection')
        ),
      S.divider(),
      // Courses
      S.listItem()
        .title('Programas Destacados')
        .id('coursesTeaser')
        .child(
          S.document()
            .schemaType('coursesTeaser')
            .documentId('coursesTeaser')
        ),
      S.listItem()
        .title('Certificaciones con Valor y Curricular Real')
        .id('certificationsTeaser')
        .child(
          S.document()
            .schemaType('certificationsTeaser')
            .documentId('certificationsTeaser')
        ),
      S.listItem()
        .title('Inscripción / CTA Final (Inicio)')
        .id('ctaSection')
        .child(
          S.document()
            .schemaType('ctaSection')
            .documentId('ctaSection')
        ),
      S.divider(),
      // Nuestra Escuela
      S.listItem()
        .title('Nuestra Escuela - Hero')
        .id('aboutHero')
        .child(
          S.document()
            .schemaType('aboutHero')
            .documentId('aboutHero')
        ),
      S.listItem()
        .title('Nuestra Escuela - Trayectoria')
        .id('aboutTimeline')
        .child(
          S.document()
            .schemaType('aboutTimeline')
            .documentId('aboutTimeline')
        ),
      S.listItem()
        .title('Nuestra Escuela - Filosofía')
        .id('aboutPhilosophy')
        .child(
          S.document()
            .schemaType('aboutPhilosophy')
            .documentId('aboutPhilosophy')
        ),
      S.listItem()
        .title('Nuestra Escuela - Valores')
        .id('aboutValues')
        .child(
          S.document()
            .schemaType('aboutValues')
            .documentId('aboutValues')
        ),
      S.listItem()
        .title('Nuestra Escuela - Modalidades')
        .id('aboutModalities')
        .child(
          S.document()
            .schemaType('aboutModalities')
            .documentId('aboutModalities')
        ),
      S.divider(),
      // Contacto
      S.listItem()
        .title('Cursos')
        .id('coursesPage')
        .child(
          S.document()
            .schemaType('coursesPage')
            .documentId('coursesPage')
        ),
      S.listItem()
        .title('Certificaciones')
        .id('certificationsPage')
        .child(
          S.document()
            .schemaType('certificationsPage')
            .documentId('certificationsPage')
        ),
      S.listItem()
        .title('Privacidad')
        .id('privacyPage')
        .child(
          S.document()
            .schemaType('privacyPage')
            .documentId('privacyPage')
        ),
      S.listItem()
        .title('Contacto')
        .id('contactPage')
        .child(
          S.document()
            .schemaType('contactPage')
            .documentId('contactPage')
        ),
      // Divider
      S.divider(),
      // The rest of the document types
      ...S.documentTypeListItems().filter(
        (listItem) => !['globalConfig', 'heroHome', 'whySection', 'coursesTeaser', 'certificationsTeaser', 'ctaSection', 'aboutHero', 'aboutTimeline', 'aboutPhilosophy', 'aboutValues', 'aboutModalities', 'coursesPage', 'certificationsPage', 'contactPage', 'privacyPage'].includes(listItem.getId() || '')
      ),
    ])
