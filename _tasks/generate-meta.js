
const fs = require('fs');

async function getData() {
  let baseData = { hash: 'invalid' };
  try {
    const fetch = require('node-fetch');
    const data = await fetch('https://api.github.com/repos/LandOfTheRair/Content/commits/master');
    const json = await data.json();
  
    baseData = { hash: json.sha.substring(0, 7) };
  } catch {
    const { gitDescribeSync } = require('git-describe');
    baseData = gitDescribeSync({ dirtyMark: false, dirtySemver: false });
  }

  fs.writeFileSync('_output/meta.json', JSON.stringify(baseData));
}

getData();

