
const YAML = require('js-yaml');
const path = require('path');
const recurse = require('recursive-readdir');
const fs = require('fs');

const { fillInProperties } = require('./props/item');

const validateItem = (item) => {
  // TODO: validate item https://github.com/LandOfTheRair/landoftherair/blob/master/src/server/tasks/items.ts#L185
  return true;
};

const merge = async () => {
  let filePromises = [];

  try {
    const files = await recurse(`items`);

    filePromises = files.map(file => {
      const basePath = file.split('items' + path.sep)[1];
      const basePathLeftSide = basePath.split(path.sep)[0];
      const itemClassRoot = path.basename(basePathLeftSide, path.extname(basePathLeftSide));

      let itemsOfType = null;
      try {
        itemsOfType = YAML.load(fs.readFileSync(file));
      } catch(e) {
        console.error(`Failed to parse file: ${file}`);
        process.exit(-1);
      }

      const promises = itemsOfType.map(itemData => {
        itemData.itemClass = itemData.itemClass || itemClassRoot;

        if(itemData.name.startsWith('Generated')) {
          const generatedItems = [];

          ['Solokar', 'Orikurnis'].forEach(location => {
            ['Basic', 'Powerful', 'Legendary'].forEach(tier => {
              const item = JSON.parse(JSON.stringify(itemData));
              item.desc = item.desc.split('$location$').join(location);
  
              item.name = `${location} ${tier} ${itemData.itemClass}`;

              if(tier === 'Legendary') item.quality = 5;
              if(tier === 'Powerful') item.quality = 3;

              fillInProperties(item, itemClassRoot);
              if(!validateItem(item)) throw new Error(`${item.name} failed validation.`);

              generatedItems.push(item);
            });
          });

          return generatedItems;
        }

        fillInProperties(itemData, itemClassRoot);
        if(!validateItem(itemData)) throw new Error(`${itemData.name} failed validation.`);
        
        return itemData;
      });

      return promises.flat(Infinity);
    }).flat();

    const allItemData = await Promise.all(filePromises);

    console.log(`Loading ${allItemData.length} items...`);

    if(!fs.existsSync('_output')) fs.mkdirSync('_output');
    fs.writeFileSync('_output/items.json', JSON.stringify(allItemData, null, 4));

  } catch(e) {
    console.error(e);
    process.exit(-1);
  }

};

merge();
