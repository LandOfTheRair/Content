
const fs = require('fs');
const { startCase } = require('lodash');

const romans = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V' };

const traitScrollItems = (itemData, allTraitTrees) => {

  const scrollToClass = {};
  const allRuneScrolls = new Set();

  Object.keys(allTraitTrees).forEach(classTree => {
    if(classTree === 'Ancient') return;

    Object.keys(allTraitTrees[classTree].trees).forEach(treeName => {
      if(treeName === 'Ancient') return;

      const tree = allTraitTrees[classTree].trees[treeName].tree;

      tree.forEach(({ traits }) => {
        traits.forEach(({ name, maxLevel }) => {
          if(!name || maxLevel <= 1) return;

          scrollToClass[name] = scrollToClass[name] || [];

          allRuneScrolls.add(name);

          if(classTree !== 'Core' && treeName !== 'Core') {
            scrollToClass[name].push(classTree);
          }
        })
      });
    });
  });

  Array.from(allRuneScrolls).forEach(scrollName => {
    for(let i = 1; i <= 5; i++) {

      const scrollSpaced = startCase(scrollName);
      const itemName = `Rune Scroll - ${scrollSpaced} ${romans[i]}`;
  
      itemData.push({
        name: itemName,
        sprite: 681,
        animation: 10,
        desc: `a runic scroll imbued with the empowerment "${scrollSpaced} ${romans[i]}"`,
        trait: {
          name: scrollName,
          level: i,
          restrict: scrollToClass[scrollName]
        },
        requirements: {
          level: 5 + ((i - 1) * 10)
        },
        value: 1,
        itemClass: "Scroll",
        type: "martial",
        stats: {},
        isSackable: true
      });
    }
  });

  /*
  allGemScrollDescs.forEach(gemScrollDesc => {

    const itemName = `Rune Scroll - Wand Specialty I`;

    itemData.push({
      sprite: 681,
      animation: 10,
      desc: "a runic scroll imbued with the empowerment \"Wand Specialty I\"",
      trait: {
          name: "WandSpecialty",
          level: 1,
          restrict: [
              "Mage"
          ]
      },
      value: 1,
      itemClass: "Scroll",
      type: "martial",
      stats: {},
      isSackable: true
    });
  });
  */

};

const merge = async () => {
  try {
    const allItemData = JSON.parse(fs.readFileSync('_output/items.json'));
    const allTraitTrees = JSON.parse(fs.readFileSync('_output/trait-trees.json'));

    traitScrollItems(allItemData, allTraitTrees);

    console.log(`Loading trait scrolls: ${allItemData.length} trait scrolls...`)

    fs.writeFileSync('_output/items.json', JSON.stringify(allItemData, null, 4));

  } catch(e) {
    console.error(e);
    process.exit(-1);
  }
};

merge();