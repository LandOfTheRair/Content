

const isNumber = x => typeof x === 'number';
const isString = x => typeof x === 'string';
const isArray = x => Array.isArray(x);

const allSkills = [  
  'mace',
  'axe',
  'dagger',
  'sword',
  'twohanded',
  'shortsword',
  'polearm',
  'ranged',
  'martial',
  'staff',
  'throwing',
  'thievery',
  'wand',
  'conjuration',
  'restoration'
];

const coreStats = {
  str: 0,
  dex: 0,
  agi: 0,
  int: 0,
  wis: 0,
  wil: 0,
  luk: 0,
  cha: 0,
  con: 0
};

const otherStats = {
  move: 2,
  hpregen: 1,
  mpregen: 1,
  hp: 100,
  mp: 0,
  weaponDamageRolls: 0,
  weaponArmorClass: 0,
  armorClass: 0,
  accuracy: 0,
  offense: 0,
  defense: 0,
  stealth: 0,
  perception: 0,
  physicalDamageBoostPercent: 0,
  magicalDamageBoostPercent: 0,
  healingBoostPercent: 0,
  physicalDamageReflect: 0,
  magicalDamageReflect: 0,
  spellReflectChance: 0,
  necroticBoostPercent: 0,
  energyBoostPercent: 0,
  diseaseBoostPercent: 0,
  poisonBoostPercent: 0,
  waterBoostPercent: 0,
  iceBoostPercent: 0,
  fireBoostPercent: 0,
  mitigation: 0,
  magicalResist: 0,
  physicalResist: 0,
  necroticResist: 0,
  energyResist: 0,
  waterResist: 0,
  fireResist: 0,
  iceResist: 0,
  poisonResist: 0,
  diseaseResist: 0,

  actionSpeed: 1,
  damageFactor: 1
};

const skillXPFromLevel = (level) => {
  if(level === 0) return 100;
  if(level === 1) return 200;

  return Math.floor(Math.pow(1.55, level) * 100);
}

const assignReputations = (npc) => {
  npc.allegianceReputation = npc.allegianceReputation || {};

  if(Object.keys(npc.allegianceReputation).length > 0) return;

  const antiReps = {
    'None': ['Enemy'],
    'Royalty': ['Townsfolk', 'Enemy'],
    'Townsfolk': ['Pirates', 'Royalty', 'Enemy'],
    'Adventurers': ['Pirates', 'Enemy'],
    'Wilderness': ['Underground', 'Enemy'],
    'Underground': ['Wilderness', 'Enemy'],
    'Pirates': ['Adventurers', 'Townsfolk', 'Enemy'],
    'Enemy': ['Royalty', 'Townsfolk', 'Adventurers', 'Wilderness', 'Underground', 'Pirates', 'None'],
    'NaturalResource': ['Enemy']
  };

  antiReps[npc.allegiance].forEach(antiRep => npc.allegianceReputation[antiRep] = -101);
}

const conditionallyAddInformation = (npc) => {
  if(isString(npc.name)) npc.name = [npc.name];
  
  if(!npc.allegiance) npc.allegiance = 'Enemy';

  if(!npc.skillOnKill) npc.skillOnKill = 1;

  if(!npc.repMod) npc.repMod = [];

  if(npc.allegiance !== 'None') {
    npc.repMod.push({ delta: -1, allegiance: npc.allegiance });
  }

  if(!npc.level) npc.level = 1;

  if(!npc.hp) npc.hp = { min: -1, max: -1 };

  if(!npc.gold) npc.gold = { min: -1, max: -1 };

  if(!npc.giveXp) npc.giveXp = { min: -1, max: -1 };

  const skillLevels = npc.skillLevels || {};
  const skillSet = allSkills.reduce((prev, cur) => {
    prev[cur] = 0;
    return prev;
  }, {});

  if(isNumber(skillLevels)) {
    allSkills.forEach(skill => {
      skillSet[skill.toLowerCase()] = skillXPFromLevel(skillLevels);
    });
  } else {
    Object.keys(skillLevels).forEach(skill => {
      skillSet[skill.toLowerCase()] = skillXPFromLevel(skillLevels[skill]);
    });
  }

  npc.skills = skillSet;
  delete npc.skillLevels;

  if(isNumber(npc.stats)) {
    const statValue = npc.stats;

    npc.stats = Object.assign({}, coreStats, otherStats);
    ['str', 'agi', 'dex', 'int', 'wis', 'wil', 'con', 'luk', 'cha'].forEach(stat => {
      npc.stats[stat] = statValue;
    });
  }

  if(npc.otherStats) {
    Object.assign(npc.stats, npc.otherStats);
    delete npc.otherStats;
  }

  if(isNumber(npc.sprite)) npc.sprite = [npc.sprite];

  if(npc.usableSkills) npc.usableSkills = npc.usableSkills.map(x => {
    if(isString(x)) return { result: x, chance: 1 };
    return x;
  });

  const reworkRollable = (baseData) => {
    if(isString(baseData)) return [{ result: baseData, chance: 1 }];
    if(isArray(baseData)) return baseData.map(x => {
      if(isString(x)) return { result: x, chance: 1 };;
      return x;
    });
  };

  if(npc.items && npc.items.equipment && npc.items.equipment.leftHand) npc.items.equipment.leftHand = reworkRollable(npc.items.equipment.leftHand);
  if(npc.items && npc.items.equipment && npc.items.equipment.rightHand) npc.items.equipment.rightHand = reworkRollable(npc.items.equipment.rightHand);
  if(npc.items && npc.items.sack) npc.items.sack = reworkRollable(npc.items.sack);

  if(npc.items && npc.items.equipment) {
    Object.keys(npc.items.equipment).forEach(gearSlot => {
      npc.items.equipment[gearSlot] = reworkRollable(npc.items.equipment[gearSlot]);
    });
  }

  if(npc.dropPool && npc.dropPool.items) npc.dropPool.items = reworkRollable(npc.dropPool.items);
};

module.exports.fillInProperties = (npc) => {
  conditionallyAddInformation(npc);
  assignReputations(npc);
};