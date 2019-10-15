
const items = require('../_output/items.json');

const validate = () => {
  console.log('Validating Items...');
  
  const itemNames = {};
  
  items.forEach(item => {
    if(itemNames[item.name]) throw new Error(`Item ${item.name} has a duplicate!`);
  
    itemNames[item.name] = true;
  });

};

validate();