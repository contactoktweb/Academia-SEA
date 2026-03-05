const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');

const client = createClient({
    projectId: 'dp7io9u0',
    dataset: 'production',
    token: 'sksg4V1UqmFEFT0uGEcvaSnKMiY66t0K4Fq40qaOs3KXXl4NwCWj8SkLr7tfmTcpBDYWXe5ClqLxHU40kmDTF588r61cw1vSzBdTJtPVYKU29dRVEQj51xmdevMe5Wt65Tf9YUgW5pwdNOxZPStUQ3csGcQuaodWkHiSDFdiQ0fV7Xhn3B8K',
    useCdn: false,
    apiVersion: '2026-03-04',
});

async function uploadAsset(filePath) {
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        return null;
    }
    const asset = await client.assets.upload('image', fs.createReadStream(filePath), {
        filename: path.basename(filePath)
    });
    return asset;
}

async function run() {
    console.log('Uploading hero images...');
    const imgSalon = await uploadAsset('public/images/hero-classroom.png');
    const imgProfesor = await uploadAsset('public/images/hero-teacher.png');

    const heroDoc = {
        _id: 'heroHome',
        _type: 'heroHome',
        badge: 'Institución Certificada',
        tituloPrincipal: 'Excelencia académica en la enseñanza del inglés.',
        subtitulo: 'Formando líderes bilingües en Jalisco por más de 15 años. Respaldados por la metodología Macmillan y certificaciones con validez oficial internacional.',
        ctaTexto: 'Iniciar Inscripción',
        ctaLink: '/contacto',
        anhosExperiencia: '15+',
        imagenSalon: imgSalon ? {
            _type: 'image',
            asset: { _type: "reference", _ref: imgSalon._id }
        } : undefined,
        imagenProfesor: imgProfesor ? {
            _type: 'image',
            asset: { _type: "reference", _ref: imgProfesor._id }
        } : undefined,
    };

    console.log('Creating/Updating heroHome document...');
    await client.createOrReplace(heroDoc);
    console.log('Hero configuration uploaded successfully!');
}

run().catch(console.error);
