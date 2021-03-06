
const YAML = require('js-yaml');
const recurse = require('recursive-readdir');
const fs = require('fs');

const conditionallyAddInformation = (script) => {
};

const validateScript = (script) => {
  let hasBad = false;

  if(!script.tag) {
    console.error(`NPC Script ${JSON.stringify(spawner)} has no tag!`);
    hasBad = true;
  }

  if(hasBad) {
    throw new Error(`NPC Script ${JSON.stringify(spawner)} has failed validation!`);
  }
  
  return true;
};

const merge = async () => {
  try {
    const files = await recurse(`npcScripts`);

    const scriptsData = files.map(file => {
      const scriptData = YAML.load(fs.readFileSync(file));

      conditionallyAddInformation(scriptData);
      if(!validateScript(scriptData)) throw new Error(`${scriptData.tag} failed validation.`);

      return scriptData;
    }).flat();

    console.log(`Loading ${scriptsData.length} NPC Scripts...`);

    if(!fs.existsSync('_output')) fs.mkdirSync('_output');
    fs.writeFileSync('_output/npc-scripts.json', JSON.stringify(scriptsData, null, 4));

  } catch(e) {
    console.error(e);
    process.exit(-1);
  }

};

merge();