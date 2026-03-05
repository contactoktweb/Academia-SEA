const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');
//
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
    console.log('Uploading course images...');
    const imgPrimaria = await uploadAsset('public/images/course-primary.jpg');
    const imgSecundaria = await uploadAsset('public/images/course-secondary-new.png');
    const imgAdultos = await uploadAsset('public/images/course-adults.jpg');

    const teaserDoc = {
        _id: 'coursesTeaser',
        _type: 'coursesTeaser',
        badge: 'Catálogo Académico',
        titulo: 'Programas Destacados',
        cursosDestacados: [
            {
                _key: 'c1',
                titulo: 'Nivel Primaria',
                categoria: 'Niños',
                duracion: 'Horarios flexibles',
                rating: '5.0',
                slug: 'nivel-primaria',
                imagen: imgPrimaria ? { _type: 'image', asset: { _type: "reference", _ref: imgPrimaria._id } } : undefined,
            },
            {
                _key: 'c2',
                titulo: 'Nivel Secundaria',
                categoria: 'Adolescentes',
                duracion: 'Horarios flexibles',
                rating: '4.9',
                slug: 'nivel-secundaria',
                imagen: imgSecundaria ? { _type: 'image', asset: { _type: "reference", _ref: imgSecundaria._id } } : undefined,
            },
            {
                _key: 'c3',
                titulo: 'Jóvenes y Adultos',
                categoria: 'Básico a Avanzado',
                duracion: 'Horarios flexibles',
                rating: '5.0',
                slug: 'jovenes-y-adultos',
                imagen: imgAdultos ? { _type: 'image', asset: { _type: "reference", _ref: imgAdultos._id } } : undefined,
            }
        ]
    };

    console.log('Creating coursesTeaser document (embedded)...');
    await client.createOrReplace(teaserDoc);
    console.log('Programas Destacados configuration uploaded successfully!');
}

run().catch(console.error);
