
const fs = require('fs');

const { gitDescribeSync } = require('git-describe');

fs.writeFileSync('_output/meta.json', JSON.stringify(gitDescribeSync({ dirtyMark: false, dirtySemver: false })));
