
const YAML = require('js-yaml');
const fs = require('fs');

const merge = async () => {
  try {

    const files = fs.readdirSync('./core');

    files.forEach(file => {
      console.log(`Loading ${file}...`);
      const fData = YAML.load(fs.readFileSync(`./core/${file}`));
      Object.keys(fData).forEach(dataKey => {
        if(!dataKey.startsWith('__')) return;
        delete fData[dataKey];
      })
      if(!fs.existsSync('_output')) fs.mkdirSync('_output');
      fs.writeFileSync(`_output/${file.split('.')[0]}.json`, JSON.stringify(fData, null, 4));
    });

  } catch(e) {
    console.error(e);
    process.exit(-1);
  }

};

merge();