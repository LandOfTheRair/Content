
const YAML = require('yamljs');
const fs = require('fs');

const merge = async () => {
  try {

    const files = fs.readdirSync('./core');

    files.forEach(file => {
      const fData = YAML.load(`./core/${file}`);
      if(!fs.existsSync('_output')) fs.mkdirSync('_output');
      fs.writeFileSync(`_output/${file.split('.')[0]}.json`, JSON.stringify(fData, null, 4));
    });

  } catch(e) {
    console.error(e);
    process.exit(-1);
  }

};

merge();