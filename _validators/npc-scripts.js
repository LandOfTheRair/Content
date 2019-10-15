
const scripts = require('../_output/npc-scripts.json');

const validate = () => {
  console.log('Validating NPC Scripts...');
  
  const npcScriptTags = {};
  
  scripts.forEach(script => {
    if(npcScriptTags[script.tag]) throw new Error(`NPC Script ${script.tag} has a duplicate!`);
  
    npcScriptTags[script.tag] = true;
  });

};

validate();