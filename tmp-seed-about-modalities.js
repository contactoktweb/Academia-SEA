const { createClient } = require('@sanity/client');

const client = createClient({
    projectId: 'dp7io9u0',
    dataset: 'production',
    token: 'sksg4V1UqmFEFT0uGEcvaSnKMiY66t0K4Fq40qaOs3KXXl4NwCWj8SkLr7tfmTcpBDYWXe5ClqLxHU40kmDTF588r61cw1vSzBdTJtPVYKU29dRVEQj51xmdevMe5Wt65Tf9YUgW5pwdNOxZPStUQ3csGcQuaodWkHiSDFdiQ0fV7Xhn3B8K',
    useCdn: false,
    apiVersion: '2026-03-04',
});

async function run() {
    const modalitiesDoc = {
        _id: 'aboutModalities',
        _type: 'aboutModalities',
        badge: 'Programa Educativo',
        titulo: 'Nuestras Modalidades',
        descripcion: 'Elige la modalidad que mejor se adapte a tu estilo de vida. Misma calidad, mismo compromiso.',
        presencial: {
            titulo: 'Clases Presenciales',
            descripcion: 'Experimenta la inmersión total con clases dinámicas en nuestras modernas instalaciones. Interacción inmediata y ambiente de aprendizaje colaborativo.',
            beneficios: ['Grupos reducidos', 'Tecnología educativa', 'Interacción real', 'Ambiente seguro'],
        },
        online: {
            titulo: 'Clases en Línea',
            descripcion: 'Aprende desde cualquier lugar con nuestra plataforma interactiva. Clases en vivo con profesores expertos y material digital exclusivo.',
            beneficios: ['Plataforma interactiva', 'Clases en vivo', 'Flexibilidad total', 'Certificación igual'],
        }
    };

    console.log('Creating aboutModalities document...');
    await client.createOrReplace(modalitiesDoc);
    console.log('Nuestra Escuela Modalities configuration uploaded successfully!');
}

run().catch(console.error);
