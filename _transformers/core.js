
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
      });

      // special transforms for this file
      if(file === 'rngdungeonconfig.yml') {
        Object.keys(fData.decor).forEach(decorKey => fData.decor[decorKey] = fData.decor[decorKey].flat());

        Object.keys(fData.floors).forEach(floorKey => {
          if(fData.floors[floorKey].allowFluids) fData.floors[floorKey].fluids = fData.floors[floorKey].fluids.flat();

          // don't flatten these, they're picked from intentionally
          // if(fData.floors[floorKey].allowTrees) fData.floors[floorKey].trees = fData.floors[floorKey].trees.flat();

          fData.floors[floorKey].decor = fData.floors[floorKey].decor.flat(Infinity);
        });

        fData.configs.roomDecor.forEach(({ decors }) => {
          decors.forEach(decorConfig => {
            decorConfig.decor = decorConfig.decor.flat();
          });
        });
      }

      if(!fs.existsSync('_output')) fs.mkdirSync('_output');
      fs.writeFileSync(`_output/${file.split('.')[0]}.json`, JSON.stringify(fData, null, 4));
    });

  } catch(e) {
    console.error(e);
    process.exit(-1);
  }

};

merge();