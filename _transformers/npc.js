
const YAML = require('yamljs');
const recurse = require('recursive-readdir');
const fs = require('fs');

const { isString, isArray, isNumber } = require('lodash');

const allSkills = [  
  'mace',
  'axe',
  'dagger',
  'onehanded',
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
  move: 3,
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
  physicalDamageBoost: 0,
  magicalDamageBoost: 0,
  healingBoost: 0,
  physicalDamageReflect: 0,
  magicalDamageReflect: 0,
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
  if(!npc.allegiance) npc.allegiance = 'Enemy';

  if(!npc.skillOnKill) npc.skillOnKill = 1;

  if(!npc.repMod) npc.repMod = [];

  if(npc.allegiance !== 'None') {
    npc.repMod.push({ delta: -1, allegiance: npc.allegiance });
  }

  if(!npc.level) npc.level = 1;

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

  if(npc.leftHand) npc.leftHand = reworkRollable(npc.leftHand);
  if(npc.rightHand) npc.rightHand = reworkRollable(npc.rightHand);
  if(npc.sack) npc.sack = reworkRollable(npc.sack);

  if(npc.gear) {
    Object.keys(npc.gear).forEach(gearSlot => {
      npc.gear[gearSlot] = reworkRollable(npc.gear[gearSlot]);
    });
  }
};

const validateNPC = (npc) => {
  // TODO: https://github.com/LandOfTheRair/landoftherair/blob/master/src/server/tasks/npcs.ts
  return true;
};

const merge = async () => {
  try {
    const files = await recurse(`npcsStats`);

    const filePromises = files.map(file => {
      const npcs = YAML.load(file);

      return npcs.map(npcData => {
        conditionallyAddInformation(npcData);
        assignReputations(npcData);
        if(!validateNPC(npcData)) throw new Error(`${npcData.npcId} failed validation.`);
        
        return npcData;
      }).flat();
    }).flat();

    const allNPCData = await Promise.all(filePromises);

    console.log(`Loading ${allNPCData.length} NPCs...`);

    if(!fs.existsSync('_output')) fs.mkdirSync('_output');
    fs.writeFileSync('_output/npcs.json', JSON.stringify(allNPCData, null, 4));

  } catch(e) {
    console.error(e);
    process.exit(-1);
  }

};

merge();