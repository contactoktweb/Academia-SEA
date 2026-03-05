const { createClient } = require('@sanity/client');

const client = createClient({
    projectId: 'dp7io9u0',
    dataset: 'production',
    token: 'sksg4V1UqmFEFT0uGEcvaSnKMiY66t0K4Fq40qaOs3KXXl4NwCWj8SkLr7tfmTcpBDYWXe5ClqLxHU40kmDTF588r61cw1vSzBdTJtPVYKU29dRVEQj51xmdevMe5Wt65Tf9YUgW5pwdNOxZPStUQ3csGcQuaodWkHiSDFdiQ0fV7Xhn3B8K',
    useCdn: false,
    apiVersion: '2026-03-04',
});

async function run() {
    const coursesDoc = {
        _id: 'coursesPage',
        _type: 'coursesPage',
        hero: {
            badge: 'Metodología Macmillan',
            titulo: 'Un curso para cada',
            tituloResaltado: 'etapa de tu vida.',
            subtitulo: 'Desde preescolar hasta nivel empresarial, todos nuestros programas combinan la metodología Macmillan Education con docentes certificados y tecnología de punta.',
        },
        cursos: [
            {
                _key: 'c1',
                titulo: 'Nivel Preescolar',
                badge: 'Primera Infancia',
                icono: 'Baby',
                accentFrom: 'from-sea-blue-light',
                accentTo: 'to-sea-blue',
                badgeBg: 'bg-sea-blue-light/20 text-sea-dark',
                descripcion: 'Introducimos a los mas pequeños al idioma ingles a traves de cuentos, musica y juegos. En esta etapa crucial, los niños adquieren idiomas de forma natural.',
                highlights: ['Cuentos y musica', 'Juegos interactivos', 'Adquisicion natural', 'Ambiente seguro'],
                // Note: Field for static reference if not using Sanity Assets yet, 
                // but the schema uses 'imagen' as an image type. 
                // I will add a fallback logic in the frontend to use the original paths if image asset is missing.
            },
            {
                _key: 'c2',
                titulo: 'Nivel Primaria',
                badge: 'Niños',
                icono: 'BookOpen',
                accentFrom: 'from-amber-500',
                accentTo: 'to-yellow-soft',
                badgeBg: 'bg-yellow-soft text-amber-700',
                descripcion: 'Combina aprendizaje y diversion con actividades interactivas, juegos, canciones y material visual. Los niños aprenden ingles de forma natural y con confianza.',
                highlights: ['Aprendizaje ludico', 'Canciones y juegos', 'Material visual', 'Confianza en el idioma'],
            },
            {
                _key: 'c3',
                titulo: 'Nivel Secundaria',
                badge: 'Adolescentes',
                icono: 'Users',
                accentFrom: 'from-[#059669]',
                accentTo: 'to-mint',
                badgeBg: 'bg-mint/20 text-accent-foreground',
                descripcion: 'Disenado para estudiantes de secundaria, alineado con estandares SEP. Desarrolla competencias comunicativas mientras refuerza la formacion academica.',
                highlights: ['Alineado con la SEP', 'Preparacion para certificaciones', 'Enfoque comunicativo', 'Actividades dinamicas'],
            },
            {
                _key: 'c4',
                titulo: 'Jovenes y Adultos',
                badge: 'Basico a Avanzado',
                icono: 'GraduationCap',
                accentFrom: 'from-sea-blue',
                accentTo: 'to-sea-blue-light',
                badgeBg: 'bg-sea-blue/10 text-sea-blue',
                descripcion: 'Programa para llevar al alumno desde un nivel basico hasta avanzado. Enfoque comunicativo que desarrolla las cuatro habilidades: comprension auditiva, expresion oral, comprension lectora y expresion escrita.',
                highlights: ['4 habilidades del idioma', 'Metodologia Macmillan', 'Niveles A1 a C1', 'Grupos reducidos'],
            },
            {
                _key: 'c5',
                titulo: 'Curso Empresarial',
                badge: 'Corporativo',
                icono: 'Briefcase',
                accentFrom: 'from-sea-dark',
                accentTo: 'to-sea-blue',
                badgeBg: 'bg-sea-dark/10 text-sea-dark',
                descripcion: 'Programas para empresas que buscan capacitar a su personal. Enfocado en ingles de negocios, presentaciones, negociaciones y comunicacion corporativa.',
                highlights: ['Ingles de negocios', 'Presentaciones', 'Negociaciones', 'A medida de su empresa'],
            },
        ],
        ctaFinal: {
            titulo: 'No encuentras lo que buscas?',
            descripcion: 'Contactanos para una asesoria personalizada. Te ayudamos a elegir el curso perfecto para ti.',
            textoBoton: 'Contactar un asesor',
        }
    };

    console.log('Creating coursesPage document...');
    await client.createOrReplace(coursesDoc);
    console.log('Courses Page configuration uploaded successfully!');
}

run().catch(console.error);
