
const YAML = require('js-yaml');
const fs = require('fs');

const merge = async () => {
  try {

    const files = fs.readdirSync('./traits').map(f => YAML.load(fs.readFileSync(`./traits/${f}`)));
    const file = Object.assign({}, ...files);

    const stems = fs.readdirSync('./stem').map(f => YAML.load(fs.readFileSync(`./stem/${f}`)));
    const allStem = Object.assign({}, ...stems);

    // these properties can be overridden, but default to the `all` value
    Object.keys(allStem).forEach(stemKey => {
      const stem = allStem[stemKey];
      if(!stem.trait) return;
      
      stem.trait.name = stem.trait.name || stemKey;
      stem.trait.spellGiven = stem.trait.spellGiven || stemKey;
      stem.trait.desc = stem.trait.desc || stem.all.desc;
      stem.trait.icon = stem.trait.icon || stem.all.icon;
      stem.trait.iconBgColor = stem.trait.iconBgColor || stem.all.bgColor;

      file[stemKey] = stem.trait;
    });

    if(!fs.existsSync('_output')) fs.mkdirSync('_output');
    fs.writeFileSync('_output/traits.json', JSON.stringify(file, null, 4));

    console.log(`Loading ${Object.values(file).length} traits...`);

  } catch(e) {
    console.error(e);
    process.exit(-1);
  }

};

merge();