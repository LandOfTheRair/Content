
const YAML = require('js-yaml');
const recurse = require('recursive-readdir');
const fs = require('fs');

const allTradeskills = ['alchemy', 'metalworking', 'spellforging'];

const addRecipeData = (recipe) => {
  if(!recipe.requiredSkill) recipe.requiredSkill = 0;
}

const validateRecipe = (recipe, allItems) => {
  if(!recipe.name) return false;
  if(!recipe.category) return false;
  if(!recipe.item) return false;
  // TODO: https://github.com/LandOfTheRair/landoftherair/blob/master/src/server/tasks/recipes.ts
  return true;
};

const merge = async () => {

  try {
    const allFiles = allTradeskills.map(async tradeskill => {
      const allTradeskillRecipes = await recurse(`recipes/${tradeskill}`);

      return allTradeskillRecipes.map(file => {
        const itemsOfType = YAML.load(fs.readFileSync(file));
  
        return itemsOfType.map(itemData => {
          addRecipeData(itemData);
          if(!validateRecipe(itemData)) throw new Error(`${itemData.name} failed validation.`);

          return {
            recipeType: tradeskill,
            ...itemData
          };
        }).flat();
      }).flat();
    }).flat();
  
    const allRecipeData = (await Promise.all(allFiles)).flat();

    const names = {};
    allRecipeData.forEach(recipe => {
      if(names[recipe.name]) throw new Error(`Recipe ${recipe.name} already exists!`);
      
      names[recipe.name] = true;
    });
  
    console.log(`Loading ${allRecipeData.length} recipes...`);

    if(!fs.existsSync('_output')) fs.mkdirSync('_output');
    fs.writeFileSync('_output/recipes.json', JSON.stringify(allRecipeData, null, 4));

  } catch(e) {
    console.error(e);
    process.exit(-1);
  }
};

merge();
