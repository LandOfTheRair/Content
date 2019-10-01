
const YAML = require('yamljs');
const path = require('path');
const recurse = require('recursive-readdir');
const fs = require('fs');

const mergeRegions = async () => {
  try {
    const globalDroptable = YAML.load(`${__dirname}/../../content/droptables/Global.yml`);

    const files = await recurse(`droptables/regions`);

    const droptables = files.map(file => {
      const droptable = YAML.load(file);

      const fileName = path.basename(file, path.extname(file));

      return { regionName: fileName, drops: globalDroptable.concat(droptable) };
    });

    console.log(`Loading ${droptables.length} regions droptables...`);

    if(!fs.existsSync('_output')) fs.mkdirSync('_output');
    fs.writeFileSync('_output/droptable-regions.json', JSON.stringify(droptables, null, 4));

  } catch(e) {
    console.error(e);
    process.exit(-1);
  }

};

const mergeMaps = async () => {
  try {
    const files = await recurse(`droptables/maps`);

    const droptables = files.map(file => {
      const droptable = YAML.load(file);

      const fileName = path.basename(file, path.extname(file));

      return { mapName: fileName, drops: droptable };
    })

    console.log(`Loading ${droptables.length} maps droptables...`);

    if(!fs.existsSync('_output')) fs.mkdirSync('_output');
    fs.writeFileSync('_output/droptable-maps.json', JSON.stringify(droptables, null, 4));

  } catch(e) {
    console.error(e);
    process.exit(-1);
  }

};

mergeRegions();
mergeMaps();