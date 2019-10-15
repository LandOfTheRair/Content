
const YAML = require('yamljs');
const recurse = require('recursive-readdir');
const fs = require('fs');

const conditionallyAddInformation = (spawner) => {
};

const validateSpawner = (spawner) => {
  let hasBad = false;

  if(!spawner.tag) {
    console.error(`Spawner ${JSON.stringify(spawner)} has no tag!`);
    hasBad = true;
  }

  if(hasBad) {
    throw new Error(`Spawner ${JSON.stringify(spawner)} has failed validation!`);
  }
  
  return true;
};

const merge = async () => {
  try {
    const files = await recurse(`spawners`);

    const spawnerDatas = files.map(file => {
      const spawnerData = YAML.load(file);

      conditionallyAddInformation(spawnerData);
      if(!validateSpawner(spawnerData)) throw new Error(`${spawnerData.tag} failed validation.`);

      return spawnerData;
    }).flat();

    console.log(`Loading ${spawnerDatas.length} Spawners...`);

    if(!fs.existsSync('_output')) fs.mkdirSync('_output');
    fs.writeFileSync('_output/spawners.json', JSON.stringify(spawnerDatas, null, 4));

  } catch(e) {
    console.error(e);
    process.exit(-1);
  }

};

merge();