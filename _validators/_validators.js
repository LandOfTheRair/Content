
const { isNumber } = require('lodash');

module.exports.isInteger = (num) => {
  return isNumber(num) && Math.floor(num) === num;
};

module.exports.isCosmetic = (cos) => {
  return cos.name;
};

module.exports.isRequirement = (req) => {
  return req.level || req.baseClass || req.alignment || req.quest;
};

module.exports.isSuccor = (suc) => {
  return suc.map && module.exports.isInteger(suc.x) && module.exports.isInteger(suc.y);
};

module.exports.isRollable = (rol) => {
  return rol.length > 0 && rol[0].chance && rol[0].result;
};

module.exports.isTrait = (trait) => {
  return trait.name && trait.level;
};

module.exports.isIntegerBetween = (min, max) => {
  return (num) => num >= min && num <= max && module.exports.isInteger(num);
};

module.exports.isEffect = (eff) => {
  return eff.name && isNumber(eff.potency);
};

module.exports.isEncrust = (enc) => {
  return enc.stats || enc.equipEffect || enc.strikeEffect;
};

module.exports.isDropPool = (pool) => {
  return module.exports.isInteger(pool.choose.min) && module.exports.isInteger(pool.choose.max) && module.exports.isRollable(pool.items);
};

module.exports.isRandomNumber = (num) => {
  return module.exports.isInteger(num.min) && module.exports.isInteger(num.max);
};