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

async function uploadImages() {
    try {
        console.log('Fetching coursesPage doc...');
        const doc = await client.getDocument('coursesPage');

        if (!doc) {
            console.log('Document coursesPage not found!');
            return;
        }

        const staticImages = [
            "course-preschool.jpg",
            "course-primary.jpg",
            "course-secondary-new.png",
            "course-adults.jpg",
            "course-business.jpg"
        ];

        let courses = doc.cursos || [];
        let updated = false;

        for (let i = 0; i < courses.length; i++) {
            // Only upload if imagery is missing and there is a mapped local image
            if (!courses[i].imagen?.asset && i < staticImages.length) {
                const imagePath = path.join(__dirname, 'public', 'images', staticImages[i]);
                if (fs.existsSync(imagePath)) {
                    console.log(`Uploading ${staticImages[i]} for course ${courses[i].titulo}...`);
                    const asset = await client.assets.upload('image', fs.createReadStream(imagePath), {
                        filename: staticImages[i]
                    });
                    console.log(`Upload complete. Asset ID: ${asset._id}`);

                    courses[i].imagen = {
                        _type: 'image',
                        asset: {
                            _type: 'reference',
                            _ref: asset._id
                        }
                    };
                    updated = true;
                } else {
                    console.log(`File not found: ${imagePath}`);
                }
            }
        }

        if (updated) {
            console.log('Patching coursesPage document with new images...');
            await client.patch('coursesPage')
                .set({ cursos: courses })
                .commit();
            console.log('Successfully updated coursesPage with images!');
        } else {
            console.log('No new images to upload.');
        }

    } catch (err) {
        console.error('Error:', err);
    }
}

uploadImages();
