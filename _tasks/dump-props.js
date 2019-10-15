
const items = require('../_output/items.json');
const npcs = require('../_output/npcs.json');

const { flatten } = require('./_flatten');

let itemProps = [];
items.forEach(item => {
  const curItemProps = Object.keys(flatten(item));
  itemProps.push(...curItemProps);
  itemProps = [...new Set(itemProps)];
});

console.log('Item props', require('util').inspect(itemProps.sort(), { maxArrayLength: null }))

let npcProps = [];
npcs.forEach(npc => {
  const curNPCProps = Object.keys(flatten(npc));
  npcProps.push(...curNPCProps);
  npcProps = [...new Set(npcProps)];
});

console.log('NPC props', require('util').inspect(npcProps.sort(), { maxArrayLength: null }))