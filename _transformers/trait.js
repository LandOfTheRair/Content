
const YAML = require('js-yaml');
const fs = require('fs');

const merge = async () => {
  const existingTraits = {};

  try {

    const files = fs.readdirSync('./traits').map(f => YAML.load(fs.readFileSync(`./traits/${f}`)));
    const file = Object.assign({}, ...files);

    files.forEach(file => {
      Object.keys(file).forEach(trait => {
        if(existingTraits[trait]) throw new Error(`Duplicate trait ${trait}`);
        existingTraits[trait] = true;
      });
    });

    const stems = fs.readdirSync('./stem').map(f => YAML.load(fs.readFileSync(`./stem/${f}`)));
    const allStem = Object.assign({}, ...stems);

    stems.forEach(stem => {
      Object.keys(stem).forEach(stemKey => { 

        const stem = allStem[stemKey];
        if(!stem.trait) return;

        const traitName = stem.trait.name || stemKey;

        if(existingTraits[traitName]) throw new Error(`Duplicate trait ${traitName}`);
        existingTraits[traitName] = true;
      });
    });

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