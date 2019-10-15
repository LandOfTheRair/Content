
const spawners = require('../_output/spawners.json');
const npcs = require('../_output/npcs.json');

const npcHash = npcs.reduce((prev, cur) => {
  prev[cur.npcId] = cur;
  return prev;
}, {});

const validate = () => {
  console.log('Validating Spawners...');
  
  const spawnerTags = {};
  
  spawners.forEach(spawner => {
    if(spawnerTags[spawner.tag]) throw new Error(`Spawner ${spawner.tag} has a duplicate!`);
  
    spawnerTags[spawner.tag] = true;

    spawner.npcIds.forEach(({ result }) => {
      if(npcHash[result]) return;

      throw new Error(`Spawner ${spawner.tag} has an invalid NPC ${result}.`);
    });
  });

};

validate();