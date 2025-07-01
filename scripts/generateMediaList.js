
const fs = require('fs');
const path = require('path');

const mediaFolder = path.join(__dirname, '../public/media');
const outputFile = path.join(__dirname, '../public/mediaList.json');

const files = fs.readdirSync(mediaFolder);

const mediaList = files
  .filter((file) => /\.(jpg|jpeg|png|mp4)$/i.test(file))
  .sort((a, b) => parseInt(a) - parseInt(b))
  .map((file) => {
    const ext = path.extname(file).toLowerCase();
    const type = ext === '.mp4' ? 'video' : 'image';
    return {
      type,
      src: `/media/${file}`
    };
  });

fs.writeFileSync(outputFile, JSON.stringify(mediaList, null, 2));
console.log('✅ mediaList.json güncellendi!');
