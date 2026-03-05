const { createClient } = require('@sanity/client');

const client = createClient({
    projectId: 'dp7io9u0',
    dataset: 'production',
    token: 'sksg4V1UqmFEFT0uGEcvaSnKMiY66t0K4Fq40qaOs3KXXl4NwCWj8SkLr7tfmTcpBDYWXe5ClqLxHU40kmDTF588r61cw1vSzBdTJtPVYKU29dRVEQj51xmdevMe5Wt65Tf9YUgW5pwdNOxZPStUQ3csGcQuaodWkHiSDFdiQ0fV7Xhn3B8K',
    useCdn: false,
    apiVersion: '2026-03-04',
});

async function run() {
    const timelineDoc = {
        _id: 'aboutTimeline',
        _type: 'aboutTimeline',
        badge: 'Trayectoria',
        titulo: 'Nuestra historia en el tiempo',
        hitos: [
            { _key: 'h1', anio: '2008', titulo: 'Fundación', icono: 'Anchor', descripcion: 'Nace Academia SEA en la región de Jalisco con la misión de ofrecer enseñanza de calidad.' },
            { _key: 'h2', anio: '2012', titulo: 'Expansión', icono: 'MapPin', descripcion: 'Abrimos nuestra segunda sede y ampliamos la oferta a nivel secundaria y primaria.' },
            { _key: 'h3', anio: '2016', titulo: 'Certificaciones', icono: 'GraduationCap', descripcion: 'Nos convertimos en centro aplicador de TOEFL y TOEIC en la región.' },
            { _key: 'h4', anio: '2020', titulo: 'Era Digital', icono: 'Monitor', descripcion: 'Lanzamos clases en línea manteniendo la calidad de la enseñanza presencial.' },
            { _key: 'h5', anio: '2024', titulo: 'Hoy', icono: 'Trophy', descripcion: '3 sedes, más de 5000 alumnos formados y reconocimiento como líderes en Jalisco.' },
        ]
    };

    console.log('Updating aboutTimeline document with icons...');
    await client.createOrReplace(timelineDoc);
    console.log('Nuestra Escuela Timeline updated with icons successfully!');
}

run().catch(console.error);
