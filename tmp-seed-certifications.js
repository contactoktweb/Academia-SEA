const { createClient } = require('@sanity/client');

const client = createClient({
    projectId: 'dp7io9u0',
    dataset: 'production',
    token: 'sksg4V1UqmFEFT0uGEcvaSnKMiY66t0K4Fq40qaOs3KXXl4NwCWj8SkLr7tfmTcpBDYWXe5ClqLxHU40kmDTF588r61cw1vSzBdTJtPVYKU29dRVEQj51xmdevMe5Wt65Tf9YUgW5pwdNOxZPStUQ3csGcQuaodWkHiSDFdiQ0fV7Xhn3B8K',
    useCdn: false,
    apiVersion: '2026-03-04',
});

async function run() {
    const certDoc = {
        _id: 'certificationsPage',
        _type: 'certificationsPage',
        hero: {
            badge: 'Centro Aplicador Autorizado',
            titulo: 'Certifica tu inglés con',
            tituloResaltado: 'validez oficial.',
            subtitulo: 'Somos centro aplicador autorizado de exámenes TOEFL y TOEIC. Te preparamos y certificamos con reconocimiento internacional y nacional.',
            tags: [
                { _key: 't1', label: 'TOEFL', sub: 'Internacional' },
                { _key: 't2', label: 'TOEIC', sub: 'Internacional' },
                { _key: 't3', label: 'CENNI', sub: 'Nacional (SEP)' },
                { _key: 't4', label: 'ELeT', sub: 'Nacional' },
            ]
        },
        internacionales: {
            titulo: 'Certificaciones TOEFL y TOEIC',
            descripcion: 'Examenes reconocidos mundialmente para certificar tu nivel de ingles en contextos academicos y profesionales.',
            lista: [
                {
                    _key: 'i1',
                    title: "TOEFL ITP",
                    description: "Mide la competencia en ingles academico. Ampliamente aceptado por universidades e instituciones educativas.",
                    features: ["Comprension auditiva", "Estructura y expresion escrita", "Comprension de lectura", "Puntuacion de 310 a 677"],
                    accent: "from-sea-blue to-sea-blue-light",
                    tag: "Academico",
                },
                {
                    _key: 'i2',
                    title: "TOEFL Primary",
                    description: "Para niños de 8 años en adelante. Evalua comprension auditiva y lectora en formato amigable.",
                    features: ["Niños a partir de 8 años", "Comprension auditiva y lectora", "Formato interactivo", "Reconocido internacionalmente"],
                    accent: "from-amber-500 to-yellow-soft",
                    tag: "Niños 8+",
                },
                {
                    _key: 'i3',
                    title: "TOEFL Junior",
                    description: "Para estudiantes de 11+ años. Evalua comprension auditiva, lenguaje y lectura.",
                    features: ["Estudiantes de 11+ años", "Comprension auditiva", "Forma y significado", "Comprension de lectura"],
                    accent: "from-[#059669] to-mint",
                    tag: "Jovenes 11+",
                },
                {
                    _key: 'i4',
                    title: "TOEIC L&R",
                    description: "Mide la capacidad de comprension del ingles en contexto laboral internacional.",
                    features: ["Comprension auditiva", "Comprension de lectura", "Enfoque laboral", "Puntuacion de 10 a 990"],
                    accent: "from-sea-dark to-sea-blue",
                    tag: "Profesional",
                },
                {
                    _key: 'i5',
                    title: "TOEIC S&W",
                    description: "Evalua habilidades productivas: expresion oral y escrita en contextos profesionales.",
                    features: ["Expresion oral", "Expresion escrita", "Contexto profesional", "Evaluacion integral"],
                    accent: "from-sea-blue to-sea-blue-light",
                    tag: "Profesional",
                },
            ]
        },
        nacionales: {
            titulo: 'Certificaciones CENNI y ELeT',
            descripcion: 'Certificaciones con validez oficial en Mexico otorgadas por la SEP y organismos nacionales.',
            lista: [
                {
                    _key: 'n1',
                    title: "Certificacion CENNI",
                    icon: "Flag",
                    description: "Otorgada por la SEP, certifica el nivel de dominio de un idioma extranjero con base en el Marco Comun Europeo de Referencia para las Lenguas.",
                    features: [
                        "Otorgada por la SEP",
                        "Basada en el MCER",
                        "Niveles A1 hasta C2",
                        "Validez oficial en Mexico",
                        "Requisito para docentes de idiomas",
                        "Util para titulacion universitaria",
                    ],
                },
                {
                    _key: 'n2',
                    title: "Examen ELeT",
                    icon: "FileCheck",
                    description: "Evaluacion disenada para medir el nivel de competencia en ingles, con aplicacion en contextos academicos y profesionales en Mexico.",
                    features: [
                        "Evaluacion integral de 4 habilidades",
                        "Contextos academicos y profesionales",
                        "Estandares internacionales",
                        "Evaluacion estandarizada",
                        "Aceptado por instituciones en Mexico",
                    ],
                },
            ]
        },
        ctaFinal: {
            titulo: 'Certifica tu nivel de ingles hoy',
            descripcion: 'Contactanos para conocer las proximas fechas de aplicacion y prepararte con nuestros cursos especializados.',
            primaryButtonText: 'Solicitar informacion',
            secondaryButtonText: 'Ver cursos de preparacion',
        }
    };

    console.log('Creating certificationsPage document...');
    await client.createOrReplace(certDoc);
    console.log('Certifications Page configuration uploaded successfully!');
}

run().catch(console.error);
