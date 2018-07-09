const package = require('../package.json');
const path    = require('path');
const rimraf  = require('rimraf');

const baseDistDir   = path.join(__dirname, `../dist/${package.directories.panelName}`);

console.log('Cleaning directory', baseDistDir);

rimraf.sync(baseDistDir);

console.log('Done.');
