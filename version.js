const { writeFileSync } = require('fs');
const path = require('path');

const gitCommitInfo = require('git-commit-info');

const info = gitCommitInfo();
const version = require('./package.json').version;
const data =Object.assign({version:version},info);
const infoJson = JSON.stringify(data, null, 2);


writeFileSync(path.join(__dirname, '/src/assets/git-version.json'), infoJson);

