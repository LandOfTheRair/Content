
const fs = require('fs');

const DROP_RATE_MAX = 10000;

const gemDescItems = (itemData, mapDropData, regionDropData) => {

  const allGems = itemData.filter(x => x.itemClass === 'Gem');
  const allGemScrollDescs = allGems.map(x => {
    const allKeys = Object.keys(x.stats).filter(z => z !== 'effect').map(z => z.toUpperCase());

    let effectText = `boost your ${allKeys.join(', ')}`;

    if(allKeys.length === 0) {
      if(x.effect) {
        effectText = `grant the spell ${x.effect.name.toUpperCase()} when used`;
      } else if(x.stats.effect) {
        effectText = `grant the spell ${x.stats.effect.name.toUpperCase()} when encrusted`;
      } else {
        effectText = `sell for a lot of gold`;
      }
    }

    const bonusText = x.encrustGive && x.encrustGive.maxEncrusts ? `- be careful, it can only be used ${x.encrustGive.maxEncrusts} times, though` : '';

    return {
      _itemName: x.name,
      scrollDesc: `If you find ${x.desc}, it will ${effectText} ${bonusText}`
    };

  });

  allGemScrollDescs.forEach(gemScrollDesc => {

    const itemName = `Lore Scroll - Gem - ${gemScrollDesc._itemName}`;

    itemData.push({
      name: itemName,
      sprite: 224,
      value: 1,
      desc: `Twean's Gem Codex: ${gemScrollDesc.scrollDesc}`,
      extendedDesc: gemScrollDesc.scrollDesc,
      itemClass: 'Scroll',
      isSackable: true,
      type: 'Martial'
    });

    mapDropData.forEach(({ drops }) => {
      drops.forEach(item => {
        if(item.result !== gemScrollDesc._itemName) return;

        drops.push({ result: itemName, chance: 1, maxChance: DROP_RATE_MAX });
      });
    });

    regionDropData.forEach(({ drops }) => {
      drops.forEach(item => {
        if(item.result !== gemScrollDesc._itemName) return;
        drops.push({ result: itemName, chance: 1, maxChance: DROP_RATE_MAX });
      });
    });
  });

};

const recipeScrollItems = (itemData, regionDropData, recipeData) => {

  /*
  const allIngScrollDescs = recipeData.map(x => {

    let leader = 'Someone\'s Book';

    switch(x.recipeType) {
      case 'alchemy': { leader = 'Selen\'s Alchemical Guide'; break; }
      case 'metalworking': { leader = 'Pandira\'s Hammer Teachings'; break; }
    }

    const itemDesc = itemData.find(y => y.name === x.item).desc;
    const ingredientDescs = x.ingredients.map(ing => itemData.find(x => x.name === ing)).map(i => i.desc);

    return {
      _itemName: x.item,
      _leader: leader,
      scrollDesc: `If you want to make ${itemDesc}, you must mix these ${ingredientDescs.length} items: ${ingredientDescs.join(', ')}.`
    };

  });

  const allItemNames = {};

  allIngScrollDescs.forEach(ingScrollDesc => {

    const checkItemName = ingScrollDesc._itemName;
    allItemNames[ingScrollDesc._itemName] = true;

    let idx = 0;

    do {
      idx++;
    } while(allItemNames[`${checkItemName} (${idx})`]);

    const realItemName = `${checkItemName} (${idx})`;
    allItemNames[realItemName] = true;

    const itemName = `Lore Scroll - Crafting - ${ingScrollDesc._leader} - ${realItemName}`;

    itemData.push({
      name: itemName,
      sprite: 224,
      value: 1,
      desc: `${ingScrollDesc._leader}: ${ingScrollDesc.scrollDesc}`,
      extendedDesc: ingScrollDesc.scrollDesc,
      itemClass: 'Scroll',
      isSackable: true,
      type: 'Martial'
    });

    regionDropData.forEach(({ drops }) => {
      drops.push({ result: itemName, chance: 1, maxChance: DROP_RATE_MAX });
    });
  });
  */
 
};

const merge = async () => {
  try {
    const allItemData = JSON.parse(fs.readFileSync('_output/items.json'));
    const allMapDropData = JSON.parse(fs.readFileSync('_output/droptable-maps.json'));
    const allRegionDropData = JSON.parse(fs.readFileSync('_output/droptable-regions.json'));
    const allRecipeData = JSON.parse(fs.readFileSync('_output/recipes.json'));

    gemDescItems(allItemData, allMapDropData, allRegionDropData);
    recipeScrollItems(allItemData, allRegionDropData, allRecipeData);

    console.log(`Loading lore: ${allItemData.length} items & droptables modified...`)

    fs.writeFileSync('_output/items.json', JSON.stringify(allItemData, null, 4));
    fs.writeFileSync('_output/droptable-maps.json', JSON.stringify(allMapDropData, null, 4));
    fs.writeFileSync('_output/droptable-regions.json', JSON.stringify(allRegionDropData, null, 4));

  } catch(e) {
    console.error(e);
    process.exit(-1);
  }
};

merge();