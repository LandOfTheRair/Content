
const { isNumber } = require('lodash');

module.exports.isCosmetic = (cos) => {
  return cos.name;
};

module.exports.isRequirement = (req) => {
  return req.level || req.baseClass || req.alignment || req.quest;
};

module.exports.isSuccor = (suc) => {
  return suc.map && suc.x && suc.y;
};

module.exports.isRollable = (rol) => {
  return rol.length > 0 && rol[0].chance && rol[0].result;
};

module.exports.isTrait = (trait) => {
  return trait.name && trait.level;
};

module.exports.isInteger = (num) => {
  return isNumber(num) && Math.floor(num) === num;
}

module.exports.isIntegerBetween = (min, max) => {
  return (num) => isNumber(num) && num >= min && num <= max && Math.floor(num) === num;
};

module.exports.isEffect = (eff) => {
  return eff.name && isNumber(eff.potency);
}

module.exports.isEncrust = (enc) => {
  return enc.stats || enc.effect;
}