
const items = require('../_output/items.json');
const npcs = require('../_output/npcs.json');
const mapTables = require('../_output/droptable-maps.json');
const regTables = require('../_output/droptable-regions.json');
const recipes = require('../_output/recipes.json');
const traits = require('../_output/traits.json');
const spells = require('../_output/spells.json');
const effects = require('../_output/effect-data.json');

const { isString, isObject, isArray, isBoolean, get } = require('lodash');
const { validateSchema } = require('./_validateSchema');
const { isRequirement, isCosmetic, isSuccor, isRollable, isTrait, isEffect, isEncrust, isIntegerBetween, isInteger } = require('./_validators');

const itemSchema = [
  ['name', true, isString],
  ['sprite', true, isInteger],
  ['animation', false, isInteger],
  ['value', true, isInteger],
  ['desc', true, isString],
  ['itemClass', true, isString],
  ['type', true, isString],

  ['binds', false, isBoolean],
  ['tellsBind', false, isBoolean],
  ['extendedDesc', false, isString],
  ['isBeltable', false, isBoolean],
  ['isSackable', false, isBoolean],
  ['isHeavy', false, isBoolean],
  ['secondaryType', false, isString],
  ['stats', false, isObject],
  ['maxUpgrades', false, isInteger],
  ['canUpgradeWith', false, isBoolean],

  ['cosmetic', false, isCosmetic],
  ['cosmetic.isPermanent', false, isBoolean],
  ['cosmetic.name', false, isString],

  ['requirements', false, isRequirement],
  ['requirements.alignment', false, isString],
  ['requirements.baseClass', false, isString],
  ['requirements.quest', false, isString],
  ['requirements.level', false, isInteger],

  ['equipEffect', false, isEffect],
  ['equipEffect.name', false, isString],
  ['equipEffect.potency', false, isInteger],
  ['equipEffect.duration', false, isInteger],
  ['equipEffect.range', false, isIntegerBetween(0, 5)],

  ['strikeEffect', false, isEffect],
  ['strikeEffect.name', false, isString],
  ['strikeEffect.potency', false, isInteger],
  ['strikeEffect.chance', false, isIntegerBetween(0, 100)],
  ['strikeEffect.duration', false, isInteger],
  ['strikeEffect.range', false, isIntegerBetween(0, 5)],

  ['useEffect', false, isEffect],
  ['useEffect.name', false, isString],
  ['useEffect.potency', false, isInteger],
  ['useEffect.canApply', false, isBoolean],
  ['useEffect.duration', false, isInteger],
  ['useEffect.uses', false, isInteger],
  ['useEffect.range', false, isIntegerBetween(0, 5)],

  ['trapEffect', false, isEffect],
  ['trapEffect.name', false, isString],
  ['trapEffect.potency', false, isInteger],
  ['trapEffect.duration', false, isInteger],
  ['trapEffect.uses', false, isInteger],
  ['trapEffect.range', false, isIntegerBetween(0, 5)],

  ['breakEffect', false, isEffect],
  ['breakEffect.name', false, isString],
  ['breakEffect.potency', false, isInteger],

  ['effect.extra', false, isObject],

  ['encrustGive', false, isEncrust],

  ['tier', false, isInteger],
  ['destroyOnDrop', false, isBoolean],
  ['twoHanded', false, isBoolean],
  ['canShoot', false, isBoolean],
  ['attackRange', false, isIntegerBetween(0, 5)],
  ['offhand', false, isBoolean],
  ['proneChance', false, isIntegerBetween(0, 100)],
  ['returnsOnThrow', false, isBoolean],

  ['shots', false, isInteger],
  ['damageClass', false, isString],

  ['trapUses', false, isInteger],

  ['containedItems', false, isRollable],

  ['succorInfo', false, isSuccor],
  ['succorInfo.map', false, isString],
  ['succorInfo.x', false, isInteger],
  ['succorInfo.y', false, isInteger],

  ['trait', false, isTrait],
  ['trait.name', false, isString],
  ['trait.level', false, isInteger],

  ['bookFindablePages', false, isInteger],
  ['bookItemFilter', false, isString],
  ['bookPage', false, isInteger],
  ['bookCurrentPage', false, isInteger],
  ['bookPages', false, isArray],

  ['ounces', false, isInteger],
  ['notUsableAfterHours', false, isInteger],

  ['quality', false, isInteger],
  ['sellValue', false, isInteger],

  ['randomStats', false, isObject],
  ['randomTrait', false, isObject]
];

const validate = () => {
  console.log('Validating Items...');
  
  const itemNames = {};
  const itemsUsed = {};
  
  items.forEach(item => {
    if(itemNames[item.name]) throw new Error(`Item ${item.name} has a duplicate!`);
  
    itemNames[item.name] = true;
    itemsUsed[item.name] = false;

    validateSchema(item.name, item, itemSchema);

    if(item.trait && !traits[item.trait.name]) {
      throw new Error(`Item ${item.name} has an invalid trait ${item.trait.name}!`);
    }

    if(item.effect && !effects[item.effect.name] && !spells[item.effect.name]) {
      throw new Error(`Item ${item.name} has an invalid effect ${item.effect.name}!`);
    }
    
    if(item.strikeEffect && !effects[item.strikeEffect.name] && !spells[item.strikeEffect.name]) {
      throw new Error(`Item ${item.name} has an invalid strikeEffect ${item.strikeEffect.name}!`);
    }

    if(item.useEffect && !effects[item.useEffect.name] && !spells[item.useEffect.name]) {
      throw new Error(`Item ${item.name} has an invalid useEffect ${item.useEffect.name}!`);
    }

    if(item.equipEffect && !effects[item.equipEffect.name] && !spells[item.equipEffect.name]) {
      throw new Error(`Item ${item.name} has an invalid equipEffect ${item.equipEffect.name}!`);
    }
  });

  npcs.forEach(npc => {

    const itemValidationKeysNPC = ['dropPool.items', 'drops', ...Object.keys(npc.gear || {}).map(x => `gear.${x}`), 'rightHand', 'leftHand', 'sack', 'belt'];

    itemValidationKeysNPC.forEach(key => {
      const value = get(npc, key);
      if(!value) return;

      value.forEach(({ result }) => {
        if(result === 'none') return;
        itemsUsed[result] = true;
      });
    });
  });

  mapTables.concat(regTables).forEach(({ drops }) => {
    drops.forEach(({ result }) => {
      itemsUsed[result] = true;
    });
  });

  recipes.forEach(({ item }) => {
    itemsUsed[item] = true;
  });

  const unusedItems = Object.keys(itemsUsed).filter(x => !itemsUsed[x]);
  if(unusedItems.length > 0) {
    console.warn(`Unused items in game:`);
    unusedItems.forEach(item => {
      console.warn(item);
    });
  }
};

validate();