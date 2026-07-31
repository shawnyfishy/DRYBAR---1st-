const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const inputDir = path.join(__dirname, '..', 'pictures');
const outputDir = path.join(__dirname, '..', 'public', 'images');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const files = fs.readdirSync(inputDir).filter((f) => f.match(/\.(jpg|jpeg|png)$/i));

console.log(`Found ${files.length} images to process...`);

async function processImages() {
  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const baseName = path.parse(file).name;
    const outputPath = path.join(outputDir, `${baseName}.webp`);

    console.log(`Processing ${file} -> ${baseName}.webp ...`);

    await sharp(inputPath)
      .resize(1920, 1920, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 85 })
      .toFile(outputPath);
  }

  console.log('Finished processing all images!');
}

processImages().catch((err) => {
  console.error('Error processing images:', err);
  process.exit(1);
});
