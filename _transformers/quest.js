
const YAML = require('yamljs');
const recurse = require('recursive-readdir');
const fs = require('fs');

const merge = async () => {
  try {
    const files = await recurse(`quests`);

    const questHash = {};

    files.forEach(file => {
      const quest = YAML.load(file);
      questHash[quest.name] = quest;
    });

    console.log(`Loading ${files.length} quests...`);

    if(!fs.existsSync('_output')) fs.mkdirSync('_output');
    fs.writeFileSync('_output/quests.json', JSON.stringify(questHash, null, 4));

  } catch(e) {
    console.error(e);
    process.exit(-1);
  }

};

merge();
