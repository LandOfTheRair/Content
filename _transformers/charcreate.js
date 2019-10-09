
const YAML = require('yamljs');
const fs = require('fs');

const merge = async () => {
  try {
    const file = YAML.load('core/charselect.yml');

    if(!fs.existsSync('_output')) fs.mkdirSync('_output');
    fs.writeFileSync('_output/charselect.json', JSON.stringify(file, null, 4));

  } catch(e) {
    console.error(e);
    process.exit(-1);
  }

};

merge();