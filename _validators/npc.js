
const npcs = require('../_output/npcs.json');

const validate = () => {
  console.log('Validating NPCs...');
  
  const npcIds = {};
  
  npcs.forEach(npc => {
    if(npcIds[npc.npcId]) throw new Error(`NPC ${npc.npcId} has a duplicate!`);
  
    npcIds[npc.npcId] = true;
  });

};

validate();