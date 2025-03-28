const fs = require('fs');
const path = require('path');
const https = require('https');

// Create directories if they don't exist
const publicImagesDir = path.join(__dirname, 'public', 'images');
const coursesImagesDir = path.join(publicImagesDir, 'courses');
fs.mkdirSync(publicImagesDir, { recursive: true });
fs.mkdirSync(coursesImagesDir, { recursive: true });

// Image URLs for different categories
const imageUrls = {
    class: {
        class8: 'https://img.freepik.com/free-vector/hand-drawn-back-school-background_23-2149464866.jpg',
        class9: 'https://img.freepik.com/free-vector/hand-drawn-back-school-background_23-2149464867.jpg',
        class10: 'https://img.freepik.com/free-vector/hand-drawn-back-school-background_23-2149464868.jpg',
        class11: 'https://img.freepik.com/free-vector/hand-drawn-back-school-background_23-2149464869.jpg',
        class12: 'https://img.freepik.com/free-vector/hand-drawn-back-school-background_23-2149464870.jpg'
    },
    competitive: {
        jee: 'https://img.freepik.com/free-vector/gradient-engineering-logo_23-2149379354.jpg',
        neet: 'https://img.freepik.com/free-vector/gradient-medical-logo_23-2149379355.jpg',
        gate: 'https://img.freepik.com/free-vector/gradient-technology-logo_23-2149379356.jpg',
        bank: 'https://img.freepik.com/free-vector/gradient-banking-logo_23-2149379357.jpg',
        ssc: 'https://img.freepik.com/free-vector/gradient-government-logo_23-2149379358.jpg',
        upsc: 'https://img.freepik.com/free-vector/gradient-civil-services-logo_23-2149379359.jpg'
    }
};

// Function to download an image
function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            if (response.statusCode === 200) {
                const fileStream = fs.createWriteStream(filepath);
                response.pipe(fileStream);
                fileStream.on('finish', () => {
                    fileStream.close();
                    console.log(`Downloaded: ${filepath}`);
                    resolve();
                });
            } else {
                reject(`Failed to download ${url}: ${response.statusCode}`);
            }
        }).on('error', (err) => {
            reject(`Error downloading ${url}: ${err.message}`);
        });
    });
}

// Download all images
async function downloadAllImages() {
    try {
        for (const category in imageUrls) {
            for (const subcategory in imageUrls[category]) {
                const url = imageUrls[category][subcategory];
                const filepath = path.join(coursesImagesDir, `${subcategory}.jpg`);
                await downloadImage(url, filepath);
            }
        }
        console.log('All images downloaded successfully!');
    } catch (error) {
        console.error('Error downloading images:', error);
    }
}

// Run the download
downloadAllImages(); 