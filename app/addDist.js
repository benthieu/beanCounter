const fse = require('fs-extra');
const path = require('path');
const fs = require('fs');

async function beforePack({targets, appOutDir}) {
    fse.copySync(path.join(__dirname, '../dist_angular'), __dirname);
}

module.exports = beforePack;
