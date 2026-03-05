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
    console.log('Uploading certifications image...');
    // Note: Certifications teaser was using an unsplash URL in code, but there is certifications-preview.jpg in public/images
    const imgCert = await uploadAsset('public/images/certifications-preview.jpg');

    const certDoc = {
        _id: 'certificationsTeaser',
        _type: 'certificationsTeaser',
        badge: 'Aval Institucional',
        titulo: 'Certificaciones con Valor Curricular Real',
        descripcion: 'En Academia SEA, no solo adquieres conocimientos teóricos; obtienes credenciales que validan tus competencias frente a los empleadores más exigentes de la industria.',
        textoBoton: 'Conoce Nuestros Avales',
        beneficios: [
            "Reconocimiento nacional e internacional",
            "Aval de instituciones de alto prestigio",
            "Incremento de oportunidades laborales",
            "Actualización constante de conocimientos"
        ],
        imagen: imgCert ? { _type: 'image', asset: { _type: "reference", _ref: imgCert._id } } : undefined,
    };

    console.log('Creating certificationsTeaser document...');
    await client.createOrReplace(certDoc);
    console.log('Certifications configuration uploaded successfully!');
}

run().catch(console.error);
