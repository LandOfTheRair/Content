
const YAML = require('js-yaml');
const recurse = require('recursive-readdir');
const fs = require('fs');

const spawnerRealName = (path) => {
  const noDot = path.includes('.') ? path.split('.')[0] : path;
  const noSpawner = noDot.includes('spawners') ? noDot.split('spawners\\')[1] : noDot;
  return noSpawner.split(/[\\*]|[\/*]/g).map(x => x.slice(0, 1).toUpperCase() + x.slice(1)).join(' ');
};

const fixSpawners = async () => {
  const files = await recurse(`spawners`);

  files.forEach(file => {
    const spawnerData = YAML.load(fs.readFileSync(file));
    if(spawnerData.tag) return;

    delete spawnerData.name;

    if(!spawnerData.tag) spawnerData.tag = spawnerRealName(file);

    fs.writeFileSync(file, YAML.stringify(spawnerData));
  });
};

fixSpawners();

const fixMaps = async () => {
  const files = await recurse(`maps`);

  files.forEach(file => {
    const mapData = JSON.parse(fs.readFileSync(file));
    const spawners = mapData.layers[10].objects;

    spawners.forEach(spawner => {
      if(!spawner.properties.script) return;

      spawner.properties.tag = spawnerRealName(spawner.properties.script);
      spawner.propertytypes.tag = 'string';

      delete spawner.properties.script;
      delete spawner.propertytypes.script;
    });

    fs.writeFileSync(file, JSON.stringify(mapData, null, 4));
  });
};

fixMaps();