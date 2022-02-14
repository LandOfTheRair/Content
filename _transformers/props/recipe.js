

const conditionallyAddInformation = (recipe) => {
  if(!recipe.requiredSkill) recipe.requiredSkill = 0;
};

module.exports.fillInProperties = (recipe) => {
  conditionallyAddInformation(recipe);
};