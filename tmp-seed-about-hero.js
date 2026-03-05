const { createClient } = require('@sanity/client');

const client = createClient({
    projectId: 'dp7io9u0',
    dataset: 'production',
    token: 'sksg4V1UqmFEFT0uGEcvaSnKMiY66t0K4Fq40qaOs3KXXl4NwCWj8SkLr7tfmTcpBDYWXe5ClqLxHU40kmDTF588r61cw1vSzBdTJtPVYKU29dRVEQj51xmdevMe5Wt65Tf9YUgW5pwdNOxZPStUQ3csGcQuaodWkHiSDFdiQ0fV7Xhn3B8K',
    useCdn: false,
    apiVersion: '2026-03-04',
});

async function run() {
    const heroDoc = {
        _id: 'aboutHero',
        _type: 'aboutHero',
        badge: 'Desde 2008 en Jalisco',
        titulo: 'Donde aprender inglés',
        tituloResaltado: 'transforma vidas.',
        subtitulo: 'Más de 15 años formando estudiantes exitosos con una metodología que combina innovación, calidez humana y resultados comprobables. Desde preescolar hasta el mundo empresarial.',
    };

    console.log('Creating aboutHero document...');
    await client.createOrReplace(heroDoc);
    console.log('Nosotros Hero configuration uploaded successfully!');
}

run().catch(console.error);
