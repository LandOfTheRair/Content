
const spawners = require('../_output/spawners.json');

const validate = () => {
  console.log('Validating Spawners...');
  
  const spawnerTags = {};
  
  spawners.forEach(spawner => {
    if(spawnerTags[spawner.tag]) throw new Error(`Spawner ${spawner.tag} has a duplicate!`);
  
    spawnerTags[spawner.tag] = true;
  });

};

validate();