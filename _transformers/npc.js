
const YAML = require('js-yaml');
const recurse = require('recursive-readdir');
const fs = require('fs');

const { fillInProperties } = require('./props/npc');

const validateNPC = (npc) => {
  // TODO: https://github.com/LandOfTheRair/landoftherair/blob/master/src/server/tasks/npcs.ts
  return true;
};

const merge = async () => {
  try {
    const files = await recurse(`npcsStats`);

    const filePromises = files.map(file => {

      try {
        const npcs = YAML.load(fs.readFileSync(file));
  
        return npcs.map(npcData => {
          fillInProperties(npcData);
          if(!validateNPC(npcData)) throw new Error(`${npcData.npcId} failed validation.`);
          
          return npcData;
        }).flat();
      } catch(e) {
        console.error(file, e);
        throw e;
      }
    }).flat();

    const allNPCData = await Promise.all(filePromises);

    console.log(`Loading ${allNPCData.length} NPCs...`);

    if(!fs.existsSync('_output')) fs.mkdirSync('_output');
    fs.writeFileSync('_output/npcs.json', JSON.stringify(allNPCData, null, 4));

  } catch(e) {
    console.error(e);
    process.exit(-1);
  }

};

merge();