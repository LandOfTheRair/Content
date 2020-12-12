
const YAML = require('yamljs');
const fs = require('fs');

const merge = async () => {
  try {

    const files = fs.readdirSync('./effectData').map(f => YAML.load(`./effectData/${f}`));
    const file = Object.assign({}, ...files);

    Object.values(file).forEach(eff => {
      eff.meta = eff.meta || {};
      eff.tooltip = eff.tooltip || {};
      eff.extra = eff.extra || {};
    });

    console.log(`Loading ${Object.values(file).length} effects...`);

    if(!fs.existsSync('_output')) fs.mkdirSync('_output');
    fs.writeFileSync('_output/effect-data.json', JSON.stringify(file, null, 4));

  } catch(e) {
    console.error(e);
    process.exit(-1);
  }

};

merge();