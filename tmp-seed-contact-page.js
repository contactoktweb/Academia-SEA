const { createClient } = require('@sanity/client');

const client = createClient({
    projectId: 'dp7io9u0',
    dataset: 'production',
    token: 'sksg4V1UqmFEFT0uGEcvaSnKMiY66t0K4Fq40qaOs3KXXl4NwCWj8SkLr7tfmTcpBDYWXe5ClqLxHU40kmDTF588r61cw1vSzBdTJtPVYKU29dRVEQj51xmdevMe5Wt65Tf9YUgW5pwdNOxZPStUQ3csGcQuaodWkHiSDFdiQ0fV7Xhn3B8K',
    useCdn: false,
    apiVersion: '2026-03-04',
});

async function run() {
    const contactDoc = {
        _id: 'contactPage',
        _type: 'contactPage',
        hero: {
            badge: '3 Sedes en Jalisco',
            titulo: 'Estamos cerca de ti,',
            tituloResaltado: 'inscríbete hoy.',
            subtitulo: 'Visítanos en cualquiera de nuestras sucursales o contáctanos por WhatsApp. Te guiamos paso a paso en tu proceso de inscripción.',
        },
        proceso: {
            badge: 'Paso a paso',
            titulo: 'Proceso de Inscripcion',
            pasos: [
                {
                    _key: 'p1',
                    paso: '1',
                    titulo: 'Contactanos',
                    descripcion: 'Comunicate por telefono o WhatsApp para recibir informacion sobre horarios y costos.',
                    icono: 'Phone',
                },
                {
                    _key: 'p2',
                    paso: '2',
                    titulo: 'Examen de colocacion',
                    descripcion: 'Realizamos una evaluacion para ubicar tu nivel actual y asignarte al grupo adecuado.',
                    icono: 'ClipboardList',
                },
                {
                    _key: 'p3',
                    paso: '3',
                    titulo: 'Documentacion',
                    descripcion: 'Presenta los documentos requeridos para formalizar tu inscripcion.',
                    icono: 'FileText',
                },
                {
                    _key: 'p4',
                    paso: '4',
                    titulo: 'Inicia tus clases',
                    descripcion: 'Comienza a aprender ingles con nuestra metodologia Macmillan Education.',
                    icono: 'Users',
                },
            ]
        },
        requisitos: {
            titulo: 'Requisitos de Inscripcion',
            lista: [
                'Identificacion oficial (INE, pasaporte o credencial escolar)',
                'Comprobante de domicilio reciente',
                'Fotografia tamaño infantil (2 fotos)',
                'Pago de inscripcion',
            ]
        },
        sedes: {
            badge: 'Ubicaciones',
            titulo: 'Nuestras Sucursales',
            ubicaciones: [
                {
                    _key: 's1',
                    nombre: 'El Grullo',
                    telefono: '321 387 57 02',
                    whatsapp: '523213875702',
                    horarios: 'Lunes a Viernes: 4:00 PM - 8:00 PM | Sabados: 10:00 AM - 2:00 PM',
                    accent: 'from-sea-blue to-sea-blue-light',
                },
                {
                    _key: 's2',
                    nombre: 'Autlan',
                    telefono: '317 382 30 60',
                    whatsapp: '523173823060',
                    horarios: 'Lunes a Viernes: 4:00 PM - 8:00 PM | Sabados: 10:00 AM - 2:00 PM',
                    accent: 'from-[#059669] to-mint',
                },
                {
                    _key: 's3',
                    nombre: 'Union de Tula',
                    telefono: '321 387 57 02',
                    whatsapp: '523213875702',
                    horarios: 'Lunes a Viernes: 4:00 PM - 8:00 PM | Sabados: 10:00 AM - 2:00 PM',
                    accent: 'from-amber-500 to-yellow-soft',
                },
            ]
        },
        descargas: {
            calendario: {
                titulo: 'Calendario Escolar',
                descripcion: 'Consulta las fechas importantes, periodos de inscripcion, examenes y vacaciones.',
                textoBoton: 'Descargar Calendario',
            },
            reglamento: {
                titulo: 'Reglamento Escolar',
                descripcion: 'Conoce las normas y lineamientos de la academia para una convivencia armoniosa.',
                textoBoton: 'Consultar Reglamento',
            }
        },
        ctaFinal: {
            titulo: 'Comience tu camino hoy',
            descripcion: 'No esperes mas para aprender ingles. Inscribete ahora y se parte de la comunidad Academia SEA.',
            textoBoton: 'INSCRIBETE AHORA',
        }
    };

    console.log('Creating contactPage document...');
    await client.createOrReplace(contactDoc);
    console.log('Contact Page configuration uploaded successfully!');
}

run().catch(console.error);
