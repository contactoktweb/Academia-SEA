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
    console.log('Uploading logos...');
    const logoHeader = await uploadAsset('public/images/SEA_LOGO-05.png');
    const logoFooter = await uploadAsset('public/images/SEA_LOGO-02.png');

    const configDoc = {
        _id: 'globalConfig',
        _type: 'globalConfig',
        logo: logoHeader ? {
            _type: 'image',
            asset: {
                _type: "reference",
                _ref: logoHeader._id
            },
            alt: 'Logo de Academia SEA'
        } : undefined,
        logoFooter: logoFooter ? {
            _type: 'image',
            asset: {
                _type: "reference",
                _ref: logoFooter._id
            },
            alt: 'Logo de Academia SEA Blanco'
        } : undefined,
        emailContacto: 'info@academiasea.com',
        telefonoContacto: '321 387 57 02',
        whatsapp: '+523213875702',
        direccion: 'El Grullo, Autlán y Unión de Tula, Jalisco',
        redesSociales: [
            {
                _key: 'social1',
                plataforma: 'facebook',
                url: 'https://www.facebook.com/AcademiaSEA'
            }
        ]
    };

    console.log('Creating/Updating globalConfig document...');
    await client.createOrReplace(configDoc);
    console.log('Global configuration uploaded successfully!');
}

run().catch(console.error);
