
const YAML = require('yamljs');
const fs = require('fs');

const merge = async () => {
  try {

    const files = fs.readdirSync('./effectData').map(f => YAML.load(`./effectData/${f}`));
    const file = Object.assign({}, ...files);

    if(!fs.existsSync('_output')) fs.mkdirSync('_output');
    fs.writeFileSync('_output/effect-icons.json', JSON.stringify(file, null, 4));

  } catch(e) {
    console.error(e);
    process.exit(-1);
  }

};

merge();