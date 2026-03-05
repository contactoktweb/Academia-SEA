const { createClient } = require('@sanity/client');

const client = createClient({
    projectId: 'dp7io9u0',
    dataset: 'production',
    token: 'sksg4V1UqmFEFT0uGEcvaSnKMiY66t0K4Fq40qaOs3KXXl4NwCWj8SkLr7tfmTcpBDYWXe5ClqLxHU40kmDTF588r61cw1vSzBdTJtPVYKU29dRVEQj51xmdevMe5Wt65Tf9YUgW5pwdNOxZPStUQ3csGcQuaodWkHiSDFdiQ0fV7Xhn3B8K',
    useCdn: false,
    apiVersion: '2026-03-04',
});

async function run() {
    const philosophyDoc = {
        _id: 'aboutPhilosophy',
        _type: 'aboutPhilosophy',
        badge: 'Filosofía',
        titulo: 'Misión y Visión',
        mision: {
            titulo: 'Misión',
            contenido: 'Formar personas competentes en el idioma inglés a través de una metodología de enseñanza innovadora que integra la calidez humana, la tecnología y el compromiso con la excelencia académica, transformando la vida de nuestros estudiantes y abriéndoles las puertas a un mundo de oportunidades globales.',
        },
        vision: {
            titulo: 'Visión',
            contenido: 'Ser la institución líder en la enseñanza del idioma inglés en la región, reconocida por la calidad humana de nuestro equipo, la efectividad de nuestra metodología y la capacidad de inspirar a cada estudiante a alcanzar su máximo potencial, convirtiéndonos en el puente definitivo hacia su éxito profesional y personal.',
        }
    };

    console.log('Creating aboutPhilosophy document...');
    await client.createOrReplace(philosophyDoc);
    console.log('Nuestra Escuela Philosophy configuration uploaded successfully!');
}

run().catch(console.error);
