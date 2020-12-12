
const YAML = require('yamljs');
const fs = require('fs');

const merge = async () => {
  try {

    const files = fs.readdirSync('./spells').map(f => YAML.load(`./spells/${f}`));
    const file = Object.assign({}, ...files);

    Object.values(file).forEach(spell => {
      spell.meta = spell.meta || {};
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