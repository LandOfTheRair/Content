
const YAML = require('yamljs');
const fs = require('fs');

const merge = async () => {
  try {

    const files = fs.readdirSync('./traitTrees').map(f => YAML.load(`./traitTrees/${f}`));
    const file = Object.assign({}, ...files);

    const coreTree = file.Core;

    Object.keys(file).forEach(treeName => {
      if(treeName === 'Core') return;

      file[treeName].trees.Core = coreTree.trees.Core;
      file[treeName].treeOrder.unshift('Core');

      Object.values(file[treeName].trees).forEach(treeData => {
        treeData.tree.forEach((treeLevel, i) => {
          treeLevel.requiredLevel = i * 10;
        });
      });

      file[treeName].allTreeTraits = {};
      Object.values(file[treeName].trees).forEach(treeData => {
        treeData.tree.forEach((treeLevel) => {
          treeLevel.traits.forEach(trait => {
            if(!trait.name) return;
            trait.treeName = treeName;
            trait.maxLevel = trait.maxLevel || 1;
            file[treeName].allTreeTraits[trait.name] = Object.assign({}, trait, { requiredLevel: treeLevel.requiredLevel });
          });
        });
      });
    });

    if(!fs.existsSync('_output')) fs.mkdirSync('_output');
    fs.writeFileSync('_output/trait-trees.json', JSON.stringify(file, null, 4));

  } catch(e) {
    console.error(e);
    process.exit(-1);
  }

};

merge();