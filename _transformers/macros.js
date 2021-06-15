
const YAML = require('js-yaml');
const fs = require('fs');

const merge = async () => {
  try {

    const files = fs.readdirSync('./macros').map(f => YAML.load(fs.readFileSync(`./macros/${f}`)));
    const file = Object.assign({}, ...files);

    const stems = fs.readdirSync('./stem').map(f => YAML.load(fs.readFileSync(`./stem/${f}`)));
    const allStem = Object.assign({}, ...stems);

    // these properties can be overridden, but default to the `all` value
    Object.keys(allStem).forEach(stemKey => {
      const stem = allStem[stemKey];
      if(!stem.macro) return;
      
      stem.macro.name = stem.macro.name || stemKey;
      stem.macro.for = stem.macro.for || stemKey;
      stem.macro.macro = stem.macro.macro || `cast ${stemKey.toLowerCase()}`;
      stem.macro.icon = stem.macro.icon || stem.all.icon;
      stem.macro.color = stem.macro.color || stem.all.color;
      stem.macro.bgColor = stem.macro.bgColor || stem.all.bgColor;
      stem.macro.tooltipDesc = stem.macro.tooltipDesc || stem.all.desc;

      file[stem.macro.name] = stem.macro;
    });

    console.log(`Loading ${Object.values(file).length} macros...`);

    if(!fs.existsSync('_output')) fs.mkdirSync('_output');
    fs.writeFileSync('_output/macros.json', JSON.stringify(file, null, 4));

  } catch(e) {
    console.error(e);
    process.exit(-1);
  }

};

merge();