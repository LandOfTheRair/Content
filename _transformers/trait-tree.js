
const YAML = require('js-yaml');
const fs = require('fs');

const merge = async () => {
  try {

    const files = fs.readdirSync('./traitTrees').map(f => YAML.load(fs.readFileSync(`./traitTrees/${f}`)));
    const file = Object.assign({}, ...files);

    const coreTree = file.Core;
    coreTree.trees.Core.tree[0].traits.forEach(t => t.treeName = 'Core');

    const ancientTree = file.Ancient;
    ancientTree.trees.Ancient.tree[0].traits.forEach(t => t.treeName = 'Ancient');

    Object.keys(file).forEach(treeName => {
      if(treeName === 'Core' || treeName === 'Ancient') return;

      file[treeName].trees.Core = JSON.parse(JSON.stringify(coreTree.trees.Core));
      file[treeName].trees.Ancient = JSON.parse(JSON.stringify(ancientTree.trees.Ancient));
      file[treeName].treeOrder.unshift('Core');
      file[treeName].treeOrder.push('Ancient');

      Object.keys(file[treeName].trees).forEach(subtreeName => {
        const treeData = file[treeName].trees[subtreeName];
        treeData.name = subtreeName;

        treeData.tree.forEach((treeLevel, i) => {
          treeLevel.requiredLevel = i * 10;
        });
      });

      file[treeName].allTreeTraits = {};
      Object.values(file[treeName].trees).forEach(treeData => {
        treeData.tree.forEach((treeLevel) => {
          treeLevel.traits.forEach(trait => {
            if(!trait.name) return;
            trait.treeName = treeData.name;
            trait.maxLevel = trait.maxLevel || 1;
            file[treeName].allTreeTraits[trait.name] = Object.assign({}, trait, { requiredLevel: treeLevel.requiredLevel });
          });
        });
      });
    });

    if(!fs.existsSync('_output')) fs.mkdirSync('_output');
    fs.writeFileSync('_output/trait-trees.json', JSON.stringify(file, null, 4));

    console.log(`Loading ${Object.values(file).length} trait trees...`);

  } catch(e) {
    console.error(e);
    process.exit(-1);
  }

};

merge();