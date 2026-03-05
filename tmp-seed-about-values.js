const { createClient } = require('@sanity/client');

const client = createClient({
    projectId: 'dp7io9u0',
    dataset: 'production',
    token: 'sksg4V1UqmFEFT0uGEcvaSnKMiY66t0K4Fq40qaOs3KXXl4NwCWj8SkLr7tfmTcpBDYWXe5ClqLxHU40kmDTF588r61cw1vSzBdTJtPVYKU29dRVEQj51xmdevMe5Wt65Tf9YUgW5pwdNOxZPStUQ3csGcQuaodWkHiSDFdiQ0fV7Xhn3B8K',
    useCdn: false,
    apiVersion: '2026-03-04',
});

async function run() {
    const valuesDoc = {
        _id: 'aboutValues',
        _type: 'aboutValues',
        badge: 'Lo que nos define',
        titulo: 'Nuestros Valores',
        valores: [
            {
                _key: 'v1',
                titulo: 'Responsabilidad y compromiso',
                descripcion: 'Cumplimos cada meta y acuerdo con nuestros alumnos y sus familias, garantizando un acompañamiento real en su aprendizaje.',
                icono: 'Shield',
                color: 'from-blue-600 to-blue-400'
            },
            {
                _key: 'v2',
                titulo: 'Pasión por la enseñanza',
                descripcion: 'Amamos lo que hacemos y transmitimos ese entusiasmo en cada clase para motivar a nuestros estudiantes.',
                icono: 'Zap',
                color: 'from-amber-500 to-orange-400'
            },
            {
                _key: 'v3',
                titulo: 'Innovación educativa',
                descripcion: 'Evolucionamos constantemente integrando nuevas herramientas y metodologías para facilitar el aprendizaje.',
                icono: 'Monitor',
                color: 'from-emerald-500 to-teal-400'
            },
            {
                _key: 'v4',
                titulo: 'Calidez y cercanía',
                descripcion: 'Creamos un ambiente seguro y familiar donde cada alumno se siente valorado y escuchado.',
                icono: 'Users',
                color: 'from-rose-500 to-pink-400'
            },
            {
                _key: 'v5',
                titulo: 'Excelencia académica',
                descripcion: 'Buscamos los más altos estándares en cada nivel educativo, desde preescolar hasta certificaciones avanzadas.',
                icono: 'Award',
                color: 'from-indigo-600 to-indigo-400'
            },
            {
                _key: 'v6',
                titulo: 'Integridad y Ética',
                descripcion: 'Actuamos con honestidad y transparencia en todos nuestros procesos administrativos y académicos.',
                icono: 'Globe',
                color: 'from-slate-700 to-slate-500'
            }
        ]
    };

    console.log('Creating aboutValues document...');
    await client.createOrReplace(valuesDoc);
    console.log('Nuestra Escuela Values configuration uploaded successfully!');
}

run().catch(console.error);
