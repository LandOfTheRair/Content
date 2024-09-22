const fs = require("fs-extra");

const { handleRNGDungeonConfig } = require("./helpers/rngdungeon");
const { handleDoors } = require("./helpers/doors");
const { handleSTEMs } = require("./helpers/stems");
const { handleTraitTrees } = require("./helpers/traittrees");

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

    let saveData = fData;

    Object.keys(saveData).forEach((dataKey) => {
      if (!dataKey.startsWith("__")) return;
      delete saveData[dataKey];
    });

    // special transforms for this file
    if (file.name === "rngdungeonconfig") {
      saveData = handleRNGDungeonConfig(fData);
    }

    if (file.name === "doors") {
      file.name = "sprite-data";
      saveData = handleDoors(fData);
    }

    fs.writeJSONSync(`${OUTPUT_DIR}/${file.name}.json`, saveData);
  });
}

fs.ensureDirSync(OUTPUT_DIR);
fs.ensureDirSync(`${OUTPUT_DIR}/maps`);
fs.ensureDirSync(`${OUTPUT_DIR}/simplemods`);

fs.readdirSync("mods").forEach((mod) => {
  const modFile = fs.readJSONSync(`mods/${mod}`);

  fs.writeJSONSync(`${OUTPUT_DIR}/items.json`, modFile.items);
  fs.writeJSONSync(`${OUTPUT_DIR}/npcs.json`, modFile.npcs);
  fs.writeJSONSync(`${OUTPUT_DIR}/npc-scripts.json`, modFile.dialogs);
  fs.writeJSONSync(`${OUTPUT_DIR}/recipes.json`, modFile.recipes);
  fs.writeJSONSync(`${OUTPUT_DIR}/spawners.json`, modFile.spawners);
  fs.writeJSONSync(
    `${OUTPUT_DIR}/achievements.json`,
    toHash(modFile.achievements, "name")
  );

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
  handleSTEMs(modFile.stems);
  handleTraitTrees(modFile.traitTrees);

  modFile.maps.forEach((mapData) => {
    const { name, map } = mapData;
    fs.writeJSONSync(`${OUTPUT_DIR}/maps/${name}.json`, map);
  });

  const strippedMod = structuredClone(modFile);
  delete strippedMod.meta._backup;
  strippedMod.maps = [];
  fs.writeJSONSync(`${OUTPUT_DIR}/simplemods/${mod}.json`, strippedMod);
});
