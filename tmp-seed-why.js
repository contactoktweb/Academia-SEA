const { createClient } = require('@sanity/client');

const client = createClient({
    projectId: 'dp7io9u0',
    dataset: 'production',
    token: 'sksg4V1UqmFEFT0uGEcvaSnKMiY66t0K4Fq40qaOs3KXXl4NwCWj8SkLr7tfmTcpBDYWXe5ClqLxHU40kmDTF588r61cw1vSzBdTJtPVYKU29dRVEQj51xmdevMe5Wt65Tf9YUgW5pwdNOxZPStUQ3csGcQuaodWkHiSDFdiQ0fV7Xhn3B8K',
    useCdn: false,
    apiVersion: '2026-03-04',
});

async function run() {
    const whyDoc = {
        _id: 'whySection',
        _type: 'whySection',
        badge: 'Ventaja Competitiva',
        titulo: '¿Por qué elegir Academia SEA?',
        descripcion: 'Nos dedicamos a formar a los líderes del mañana en la enseñanza del idioma inglés, proporcionando herramientas reales para el mundo profesional y académico.',
        features: [
            {
                _key: 'feat1',
                icono: 'BookOpen',
                titulo: 'Metodología Macmillan',
                descripcion: 'Aprendizaje basado en la reconocida metodología de Macmillan Education con un enfoque comunicativo y práctico.'
            },
            {
                _key: 'feat2',
                icono: 'Award',
                titulo: 'Excelencia Académica',
                descripcion: 'Docentes certificados y en constante capacitación, comprometidos con el éxito de cada estudiante.'
            },
            {
                _key: 'feat3',
                icono: 'Users',
                titulo: 'Grupos Reducidos',
                descripcion: 'Atención personalizada que garantiza una mejor interacción y ritmo de aprendizaje para cada alumno.'
            },
            {
                _key: 'feat4',
                icono: 'Globe2',
                titulo: 'Visión Global',
                descripcion: 'Programas diseñados para que el alumno desarrolle confianza y competencia en el idioma para un entorno internacional.'
            }
        ]
    };

    console.log('Creating/Updating whySection document...');
    await client.createOrReplace(whyDoc);
    console.log('Why Section configuration uploaded successfully!');
}

run().catch(console.error);
