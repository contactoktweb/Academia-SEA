const { createClient } = require('@sanity/client');

const client = createClient({
    projectId: 'dp7io9u0',
    dataset: 'production',
    token: 'sksg4V1UqmFEFT0uGEcvaSnKMiY66t0K4Fq40qaOs3KXXl4NwCWj8SkLr7tfmTcpBDYWXe5ClqLxHU40kmDTF588r61cw1vSzBdTJtPVYKU29dRVEQj51xmdevMe5Wt65Tf9YUgW5pwdNOxZPStUQ3csGcQuaodWkHiSDFdiQ0fV7Xhn3B8K',
    useCdn: false,
    apiVersion: '2026-03-04',
});

async function run() {
    const ctaDoc = {
        _id: 'ctaSection',
        _type: 'ctaSection',
        titulo: 'Impulsa tu carrera en Comercio Exterior hoy mismo',
        descripcion: 'Únete a la nueva generación de expertos logísticos. Inscríbete ahora y transforma tu futuro profesional con Academia SEA.',
        botonPrimarioTexto: 'Inscribirme Ahora',
        botonPrimarioLink: '/inscripcion',
        botonSecundarioTexto: 'Solicitar Información',
        botonSecundarioLink: '/contacto',
    };

    console.log('Creating ctaSection document...');
    await client.createOrReplace(ctaDoc);
    console.log('CTA configuration uploaded successfully!');
}

run().catch(console.error);
