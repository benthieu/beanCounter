const fs = require('fs');
const path = require('path');

async function afterPack({targets, appOutDir}) {
    const files = fs.readdirSync(path.join(__dirname, '../dist_angular'));
    files.forEach((file) => {
        const pathRM = path.join(__dirname, '/', file);
        fs.rmSync(pathRM, { recursive: true, force: true });
    });
}

module.exports = afterPack;
