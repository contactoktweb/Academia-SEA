const { createClient } = require('@sanity/client');

const client = createClient({
    projectId: 'dp7io9u0',
    dataset: 'production',
    token: 'sksg4V1UqmFEFT0uGEcvaSnKMiY66t0K4Fq40qaOs3KXXl4NwCWj8SkLr7tfmTcpBDYWXe5ClqLxHU40kmDTF588r61cw1vSzBdTJtPVYKU29dRVEQj51xmdevMe5Wt65Tf9YUgW5pwdNOxZPStUQ3csGcQuaodWkHiSDFdiQ0fV7Xhn3B8K',
    useCdn: false,
    apiVersion: '2026-03-04',
});

async function run() {
    const aboutDoc = {
        _id: 'aboutPage',
        _type: 'aboutPage',
        hero: {
            badge: 'Desde 2008 en Jalisco',
            titulo: 'Donde aprender inglés',
            tituloResaltado: 'transforma vidas.',
            subtitulo: 'Más de 15 años formando estudiantes exitosos con una metodología que combina innovación, calidez humana y resultados comprobables. Desde preescolar hasta el mundo empresarial.',
        },
        timeline: [
            { _key: 't1', anio: '2008', titulo: 'Fundación', descripcion: 'Nace Academia SEA en la región de Jalisco con la misión de ofrecer enseñanza de calidad.' },
            { _key: 't2', anio: '2012', titulo: 'Expansión', descripcion: 'Abrimos nuestra segunda sede y ampliamos la oferta a nivel secundaria y primaria.' },
            { _key: 't3', anio: '2016', titulo: 'Certificaciones', descripcion: 'Nos convertimos en centro aplicador de TOEFL y TOEIC en la región.' },
            { _key: 't4', anio: '2020', titulo: 'Era Digital', descripcion: 'Lanzamos clases en línea manteniendo la calidad de la enseñanza presencial.' },
            { _key: 't5', anio: '2024', titulo: 'Hoy', descripcion: '3 sedes, más de 5000 alumnos formados y reconocimiento como líderes en Jalisco.' },
        ],
        misionVision: {
            mision: {
                titulo: 'Misión',
                contenido: 'Formar personas competentes en el idioma ingles a traves de una metodologia de enseñanza innovadora, con docentes altamente capacitados, utilizando tecnologia de punta y fomentando valores que contribuyan al desarrollo integral de nuestros alumnos.',
            },
            vision: {
                titulo: 'Visión',
                contenido: 'Ser la institucion lider en la enseñanza del idioma ingles en la region, reconocida por la calidad de nuestros programas, la excelencia de nuestros docentes y la formacion integral que brindamos a nuestros estudiantes para competir en un entorno globalizado.',
            },
        },
        valores: [
            { _key: 'v1', icono: 'Shield', titulo: 'Responsabilidad y compromiso', descripcion: 'Cumplimos cada meta y acuerdo con nuestros alumnos y sus familias.', color: 'from-sea-blue to-sea-blue-light' },
            { _key: 'v2', icono: 'ThumbsUp', titulo: 'Honestidad', descripcion: 'Actuamos con total transparencia e integridad en cada paso de nuestra labor.', color: 'from-[#059669] to-mint' },
            { _key: 'v3', icono: 'Sparkles', titulo: 'Excelencia en el servicio', descripcion: 'Brindamos la mejor atencion buscando los maximos estandares educativos.', color: 'from-amber-500 to-yellow-soft' },
            { _key: 'v4', icono: 'Flame', titulo: 'Pasión por lo que hacemos', descripcion: 'Amamos enseñar y ese entusiasmo transforma la experiencia en el aula.', color: 'from-red-500 to-orange-400' },
            { _key: 'v5', icono: 'Award', titulo: 'Calidad', descripcion: 'Metodologia probada y materiales didacticos de nivel internacional.', color: 'from-sea-dark to-sea-blue' },
            { _key: 'v6', icono: 'Users', titulo: 'Respeto y humildad', descripcion: 'Creamos un ambiente armonioso donde todas las personas son valoradas.', color: 'from-[#059669] to-mint' },
        ],
        modalidades: {
            presencial: {
                titulo: 'Clases Presenciales',
                descripcion: 'Asiste a nuestras instalaciones en El Grullo, Autlan o Union de Tula. Aulas equipadas, grupos reducidos e interaccion directa con docentes certificados.',
                beneficios: ['Grupos reducidos', 'Tecnologia educativa', 'Material Macmillan', 'Horarios flexibles'],
            },
            online: {
                titulo: 'Clases en Línea',
                descripcion: 'Aprende desde cualquier lugar con conexion a internet. Misma calidad, metodologia y seguimiento personalizado con herramientas digitales interactivas.',
                beneficios: ['Plataforma interactiva', 'Clases en vivo', 'Material digital', 'Total flexibilidad'],
            },
        },
    };

    console.log('Creating aboutPage document...');
    await client.createOrReplace(aboutDoc);
    console.log('About page configuration uploaded successfully!');
}

run().catch(console.error);
