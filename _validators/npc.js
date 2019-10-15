
const npcs = require('../_output/npcs.json');

const { validateSchema } = require ('./_validateSchema');

const { isString, isArray, isBoolean, isObject } = require('lodash');
const { isRollable, isDropPool, isInteger, isRandomNumber } = require('./_validators');

const npcSchema = [
  ['npcId', true, isString],
  ['sprite', true, isArray],
  ['hp', true, isRandomNumber],
  ['mp', false, isRandomNumber],
  ['giveXp', true, isRandomNumber],
  ['gold', true, isRandomNumber],
  ['skillOnKill', true, isInteger],

  ['name', false, isString],
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
  ['gear', false, isObject],
  ['leftHand', false, isRollable],
  ['rightHand', false, isRollable],
  ['sack', false, isRollable],
  ['belt', false, isRollable],

  ['level', true, isInteger],

  ['monsterClass', false, isString],
  ['hostility', false, isString],
  ['noCorpseDrop', false, isBoolean],
  ['noItemDrop', false, isBoolean],
  ['repMod', false, isArray],

  ['stats', true, isObject],
  ['skills', true, isObject],

  ['tanSkillRequired', false, isInteger],
  ['tansFor', false, isString],
  ['traitLevels', false, isObject],
  ['triggers', false, isObject],

  ['usableSkills', false, isRollable]
];

const validate = () => {
  console.log('Validating NPCs...');
  
  const npcIds = {};
  
  npcs.forEach(npc => {
    if(npcIds[npc.npcId]) throw new Error(`NPC ${npc.npcId} has a duplicate!`);
  
    npcIds[npc.npcId] = true;

    validateSchema(npc.npcId, npc, npcSchema);
  });

};

validate();