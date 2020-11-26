
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
    });

    if(!fs.existsSync('_output')) fs.mkdirSync('_output');
    fs.writeFileSync('_output/trait-trees.json', JSON.stringify(file, null, 4));

  } catch(e) {
    console.error(e);
    process.exit(-1);
  }

};

merge();