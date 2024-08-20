const fs = require("fs-extra");

const OUTPUT_DIR = "_output";

function toHash(arr, indexProp) {
  return arr.reduce(
    (prev, cur) => ({
      ...prev,
      [cur[indexProp]]: cur,
    }),
    {}
  );
}

function handleCoreFiles(files) {
  files.forEach((file) => {
    const fData = file.json;

    Object.keys(fData).forEach((dataKey) => {
      if (!dataKey.startsWith("__")) return;
      delete fData[dataKey];
    });

    // special transforms for this file
    if (file.name === "rngdungeonconfig") {
      Object.keys(fData.decor).forEach(
        (decorKey) => (fData.decor[decorKey] = fData.decor[decorKey].flat())
      );

      Object.keys(fData.floors).forEach((floorKey) => {
        if (fData.floors[floorKey].allowFluids)
          fData.floors[floorKey].fluids = fData.floors[floorKey].fluids.flat();

        // don't flatten these, they're picked from intentionally
        // if(fData.floors[floorKey].allowTrees) fData.floors[floorKey].trees = fData.floors[floorKey].trees.flat();

        fData.floors[floorKey].decor =
          fData.floors[floorKey].decor.flat(Infinity);
      });

      fData.configs.roomDecor.forEach(({ decors }) => {
        decors.forEach((decorConfig) => {
          decorConfig.decor = decorConfig.decor.flat();
        });
      });
    }

    fs.writeJSONSync(`${OUTPUT_DIR}/${file.name}.json`, file.json);
  });
}

fs.ensureDirSync(OUTPUT_DIR);
fs.ensureDirSync(`${OUTPUT_DIR}/maps`);

fs.readdirSync("mods").forEach((mod) => {
  const modFile = fs.readJSONSync(`mods/${mod}`);

  fs.writeJSONSync(`${OUTPUT_DIR}/items.json`, modFile.items);
  fs.writeJSONSync(`${OUTPUT_DIR}/npcs.json`, modFile.npcs);
  fs.writeJSONSync(`${OUTPUT_DIR}/npc-scripts.json`, modFile.dialogs);
  fs.writeJSONSync(`${OUTPUT_DIR}/recipes.json`, modFile.recipes);
  fs.writeJSONSync(`${OUTPUT_DIR}/spawners.json`, modFile.spawners);

  fs.writeJSONSync(`${OUTPUT_DIR}/quests.json`, toHash(modFile.quests, "name"));

  const globalDroptable = modFile.drops.find((drop) => drop.isGlobal);
  const mapDrops = modFile.drops.filter((drop) => drop.mapName);
  const regionDrops = modFile.drops
    .filter((drop) => drop.regionName)
    .map((drop) => ({
      ...drop,
      drops: [...globalDroptable.drops, ...drop.drops],
    }));

  fs.writeJSONSync(`${OUTPUT_DIR}/droptable-maps.json`, mapDrops);
  fs.writeJSONSync(`${OUTPUT_DIR}/droptable-regions.json`, regionDrops);

  handleCoreFiles(modFile.cores);

  modFile.maps.forEach((mapData) => {
    const { name, map } = mapData;
    fs.writeJSONSync(`${OUTPUT_DIR}/maps/${name}.json`, map);
  });
});
