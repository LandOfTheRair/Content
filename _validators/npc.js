
const npcs = require('../_output/npcs.json');
const items = require('../_output/items.json');

const itemHash = items.reduce((prev, cur) => {
  prev[cur.name] = cur;
  return prev;
}, {});

const { validateSchema } = require ('./_validateSchema');

const { isString, isArray, isBoolean, isObject, get } = require('lodash');
const { isRollable, isDropPool, isInteger, isRandomNumber } = require('./_validators');

const npcSchema = [
  ['npcId', true, isString],
  ['sprite', true, isArray],
  ['hp', true, isRandomNumber],
  ['mp', false, isRandomNumber],
  ['giveXp', true, isRandomNumber],
  ['gold', true, isRandomNumber],
  ['skillOnKill', true, isInteger],

  ['name', false, isArray],
  ['alignment', false, isString],
  ['affiliation', false, isString],
  ['allegiance', false, isString],
  ['allegianceReputation', false, isObject],
  ['aquaticOnly', false, isBoolean],
  ['baseClass', false, isString],
  ['baseEffects', false, isArray],
  ['copyDrops', false, isRollable],
  ['dropPool', false, isDropPool],
  ['drops', false, isRollable],
  ['items', false, isObject],
  ['items.equipment', false, isObject],
  ['items.sack', false, isRollable],

  ['level', true, isInteger],

  ['monsterClass', false, isString],
  ['monsterGroup', false, isString],
  ['hostility', false, isString],
  ['noCorpseDrop', false, isBoolean],
  ['noItemDrop', false, isBoolean],
  ['repMod', false, isArray],

  ['stats', true, isObject],
  ['skills', true, isObject],

  ['summonStatModifiers', false, isObject],
  ['summonSkillModifiers', false, isObject],

  ['tanSkillRequired', false, isInteger],
  ['tansFor', false, isString],
  ['traitLevels', false, isObject],
  ['triggers', false, isObject],

  ['usableSkills', false, isRollable]
];

const forbiddenKeys = [
  'gear',
  'rightHand',
  'leftHand'
];

const validate = () => {
  console.log('Validating NPCs...');
  
  const npcIds = {};
  
  npcs.forEach(npc => {
    if(npcIds[npc.npcId]) throw new Error(`NPC ${npc.npcId} has a duplicate!`);

    forbiddenKeys.forEach(key => {
      const val = get(npc, key);
      if(val) console.error(`${npc.npcId} is using forbidden key ${key}!`);
    });
  
    npcIds[npc.npcId] = true;

    validateSchema(npc.npcId, npc, npcSchema);

    const itemValidationKeys = ['dropPool.items', 'drops', ...Object.keys(get(npc, 'items.equipment', {})).map(x => `items.equipment.${x}`), 'items.sack'];

    itemValidationKeys.forEach(key => {
      const val = get(npc, key);
      if(!val) return;
      
      val.forEach(valOrObject => {

        const checkString = valOrObject.result || valOrObject;
        if(itemHash[checkString] || checkString === 'none') return;

        throw new Error(`Result '${result}' is not a valid item in '${npc.npcId}':'${key}'`);
      });
    });
  });

};

validate();