
const items = require('../_output/items.json');

const { isString, isObject, isArray, isBoolean } = require('lodash');
const { validateSchema } = require('./_validateSchema');
const { isRequirement, isCosmetic, isSuccor, isRollable, isTrait, isEffect, isEncrust, isIntegerBetween, isInteger } = require('./_validators');

const itemSchema = [
  ['name', true, isString],
  ['sprite', true, isInteger],
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

  ['cosmetic', false, isCosmetic],
  ['cosmetic.isPermanent', false, isBoolean],
  ['cosmetic.name', false, isString],

  ['requirements', false, isRequirement],
  ['requirements.alignment', false, isString],
  ['requirements.baseClass', false, isString],
  ['requirements.quest', false, isString],
  ['requirements.level', false, isInteger],

  ['effect', false, isEffect],
  ['effect.name', false, isString],
  ['effect.potency', false, isInteger],
  ['effect.autocast', false, isBoolean],
  ['effect.canApply', false, isBoolean],
  ['effect.chance', false, isIntegerBetween(0, 100)],
  ['effect.duration', false, isInteger],
  ['effect.uses', false, isInteger],
  ['effect.range', false, isIntegerBetween(0, 5)],

  ['effect.extra', false, isObject],

  ['encrustGive', false, isEncrust],

  ['enchantLevel', false, isInteger],
  ['maxEnchantLevel', false, isInteger],
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
  
  items.forEach(item => {
    if(itemNames[item.name]) throw new Error(`Item ${item.name} has a duplicate!`);
  
    itemNames[item.name] = true;

    validateSchema(item.name, item, itemSchema);
  });

};

validate();