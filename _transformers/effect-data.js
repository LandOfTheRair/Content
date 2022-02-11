
const YAML = require('js-yaml');
const fs = require('fs');

const merge = async () => {
  try {

    const files = fs.readdirSync('./effectData').map(f => YAML.load(fs.readFileSync(`./effectData/${f}`)));
    const file = Object.assign({}, ...files);

    const stems = fs.readdirSync('./stem').map(f => YAML.load(fs.readFileSync(`./stem/${f}`)));
    const allStem = Object.assign({}, ...stems);

    // these properties can be overridden, but default to the `all` value
    Object.keys(allStem).forEach(stemKey => {
      const stem = allStem[stemKey];
      if(!stem.effect || !stem.effect.effectMeta) return;

      stem.effect.tooltip = stem.effect.tooltip || {};
      stem.effect.tooltip.icon = stem.effect.tooltip.icon || stem.all.icon;
      stem.effect.tooltip.color = stem.effect.tooltip.color || stem.all.color;
      stem.effect.tooltip.bgColor = stem.effect.tooltip.bgColor || stem.all.bgColor;

      file[stemKey] = stem.effect;
    });

    Object.values(file).forEach(eff => {
      eff.effectMeta = eff.effectMeta || {};
      eff.tooltip = eff.tooltip || {};
      eff.effect.extra = eff.effect.extra || {};
      eff.effect.extra.potency = eff.effect.extra.potency || 0;

      eff.effect.duration = eff.effect.duration || 0;
    });

    console.log(`Loading ${Object.values(file).length} effects...`);

    if(!fs.existsSync('_output')) fs.mkdirSync('_output');
    fs.writeFileSync('_output/effect-data.json', JSON.stringify(file, null, 4));

  } catch(e) {
    console.error(e);
    process.exit(-1);
  }

};

merge();