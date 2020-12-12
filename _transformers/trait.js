
const YAML = require('yamljs');
const fs = require('fs');

const merge = async () => {
  try {

    const files = fs.readdirSync('./traits').map(f => YAML.load(`./traits/${f}`));
    const file = Object.assign({}, ...files);

    if(!fs.existsSync('_output')) fs.mkdirSync('_output');
    fs.writeFileSync('_output/traits.json', JSON.stringify(file, null, 4));

    console.log(`Loading ${Object.values(file).length} traits...`);

  } catch(e) {
    console.error(e);
    process.exit(-1);
  }

};

merge();