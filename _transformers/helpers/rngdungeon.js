module.exports.handleRNGDungeonConfig = function handleRNGDungeonConfig(fData) {
  Object.keys(fData.decor).forEach(
    (decorKey) => (fData.decor[decorKey] = fData.decor[decorKey].flat())
  );

  Object.keys(fData.floors).forEach((floorKey) => {
    if (fData.floors[floorKey].allowFluids)
      fData.floors[floorKey].fluids = fData.floors[floorKey].fluids.flat();

    // don't flatten these, they're picked from intentionally
    // if(fData.floors[floorKey].allowTrees) fData.floors[floorKey].trees = fData.floors[floorKey].trees.flat();

    fData.floors[floorKey].decor = fData.floors[floorKey].decor.flat(Infinity);
  });

  fData.configs.roomDecor.forEach(({ decors }) => {
    decors.forEach((decorConfig) => {
      decorConfig.decor = decorConfig.decor.flat();
    });
  });

  return fData;
};
