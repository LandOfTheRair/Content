
const YAML = require('yamljs');
const fs = require('fs');

const merge = async () => {
  try {

    const file = {};

    const stems = fs.readdirSync('./stem').map(f => YAML.load(`./stem/${f}`));
    const allStem = Object.assign({}, ...stems);

    // these properties can be overridden, but default to the `all` value
    Object.keys(allStem).forEach(stemKey => {
      const stem = allStem[stemKey];
      if(!stem.spell) return;
      
      stem.spell.spellMeta = stem.spell.spellMeta || {};
      stem.spell.spellMeta.spellRef = stem.spell.spellMeta.spellRef || stemKey;

      file[stemKey] = stem.spell;
    });

    Object.values(file).forEach(spell => {
      spell.spellMeta = spell.spellMeta || {};
      spell.mpCost = spell.mpCost || 0;
      spell.maxSkillForGain = spell.maxSkillForGain || 1;
    });

    if(!fs.existsSync('_output')) fs.mkdirSync('_output');
    fs.writeFileSync('_output/spells.json', JSON.stringify(file, null, 4));

    console.log(`Loading ${Object.values(file).length} spells...`);

  } catch(e) {
    console.error(e);
    process.exit(-1);
  }

};

merge();