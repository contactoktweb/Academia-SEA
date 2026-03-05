import { defineQuery } from "next-sanity";

export const GLOBAL_CONFIG_QUERY = defineQuery(`
  *[_type == "globalConfig"][0] {
    logo {
      asset->,
      alt
    },
    logoFooter {
      asset->,
      alt
    },
    emailContacto,
    telefonoContacto,
    whatsapp,
    direccion,
    redesSociales[] {
      _key,
      plataforma,
      url
    }
  }
`);

export const HERO_HOME_QUERY = defineQuery(`
  *[_type == "heroHome"][0] {
    badge,
    tituloPrincipal,
    subtitulo,
    ctaTexto,
    ctaLink,
    anhosExperiencia,
    imagenSalon {
      asset->
    },
    imagenProfesor {
      asset->
    }
  }
`);

export const WHY_SECTION_QUERY = defineQuery(`
  *[_type == "whySection"][0] {
    badge,
    titulo,
    descripcion,
    features[] {
      _key,
      icono,
      titulo,
      descripcion
    }
  }
`);

export const COURSES_TEASER_QUERY = defineQuery(`
  *[_type == "coursesTeaser"][0] {
    badge,
    titulo,
    cursosDestacados[] {
      titulo,
      categoria,
      duracion,
      rating,
      imagen {
        asset->
      },
      slug
    }
  }
`);

export const CERTIFICATIONS_TEASER_QUERY = defineQuery(`
  *[_type == "certificationsTeaser"][0] {
    badge,
    titulo,
    descripcion,
    beneficios,
    textoBoton,
    imagen {
      asset->
    }
  }
`);

export const CTA_SECTION_QUERY = defineQuery(`
  *[_type == "ctaSection"][0] {
    titulo,
    descripcion,
    botonPrimarioTexto,
    botonPrimarioLink,
    botonSecundarioTexto,
    botonSecundarioLink
  }
`);

export const ABOUT_HERO_QUERY = defineQuery(`
  *[_type == "aboutHero"][0] {
    badge,
    titulo,
    tituloResaltado,
    subtitulo
  }
`);

export const ABOUT_TIMELINE_QUERY = defineQuery(`
  *[_type == "aboutTimeline"][0] {
    badge,
    titulo,
    hitos[] {
      _key,
      anio,
      titulo,
      descripcion
    }
  }
`);

export const ABOUT_PHILOSOPHY_QUERY = defineQuery(`
  *[_type == "aboutPhilosophy"][0] {
    badge,
    titulo,
    mision {
      titulo,
      contenido
    },
    vision {
      titulo,
      contenido
    }
  }
`);

export const ABOUT_VALUES_QUERY = defineQuery(`
  *[_type == "aboutValues"][0] {
    badge,
    titulo,
    valores[] {
      _key,
      icono,
      titulo,
      descripcion
    }
  }
`);

export const ABOUT_MODALITIES_QUERY = defineQuery(`
  *[_type == "aboutModalities"][0] {
    badge,
    titulo,
    descripcion,
    presencial {
      titulo,
      descripcion,
      beneficios
    },
    online {
      titulo,
      descripcion,
      beneficios
    }
  }
`);


export const COURSES_PAGE_QUERY = defineQuery(`
  *[_type == "coursesPage"][0] {
    hero,
    cursos[] {
      _key,
      titulo,
      badge,
      icono,
      "imageUrl": imagen.asset->url,
      descripcion,
      highlights
    },
    ctaFinal
  }
`);

export const CERTIFICATIONS_PAGE_QUERY = defineQuery(`
  *[_type == "certificationsPage"][0] {
    hero {
      badge,
      titulo,
      tituloResaltado,
      subtitulo,
      tags[] {
        _key,
        label,
        sub
      }
    },
    internacionales {
      titulo,
      descripcion,
      lista[] {
        _key,
        title,
        description,
        features,
        tag
      }
    },
    nacionales {
      titulo,
      descripcion,
      lista[] {
        _key,
        title,
        description,
        features
      }
    },
    ctaFinal
  }
`);

export const CONTACT_PAGE_QUERY = defineQuery(`
  *[_type == "contactPage"][0] {
    hero {
      badge,
      titulo,
      tituloResaltado,
      subtitulo
    },
    proceso {
      badge,
      titulo,
      pasos[] {
        _key,
        paso,
        titulo,
        descripcion
      }
    },
    requisitos {
      titulo,
      lista
    },
    sedes {
      badge,
      titulo,
      ubicaciones[] {
        _key,
        nombre,
        telefono,
        whatsapp,
        horarios
      }
    },
    descargas {
      calendario {
        titulo,
        descripcion,
        textoBoton,
        "archivoUrl": archivo.asset->url
      },
      reglamento {
        titulo,
        descripcion,
        textoBoton,
        "archivoUrl": archivo.asset->url
      }
    },
    ctaFinal {
      titulo,
      descripcion,
      textoBoton
    }
  }
`);

export const PRIVACY_PAGE_QUERY = defineQuery(`
  *[_type == "privacyPage"][0] {
    hero {
      badge,
      titulo,
      subtitulo
    },
    secciones[] {
      _key,
      id,
      titulo,
      contenido
    },
    notaFinal {
      fechaActualizacion,
      texto
    }
  }
`);


