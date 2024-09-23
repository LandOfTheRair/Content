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

const joinedMod = {};

fs.readdirSync("mods").forEach((mod) => {
  const modFile = fs.readJSONSync(`mods/${mod}`);
  if (mod.includes("BaseGameContent")) {
    joinedMod.meta = modFile.meta;
  }

  Object.keys(modFile).forEach((key) => {
    if (key === "meta") return;
    joinedMod[key] ??= [];
    joinedMod[key].push(...modFile[key]);
  });

  const strippedMod = structuredClone(modFile);
  delete strippedMod.meta._backup;
  strippedMod.maps = [];

  fs.writeJSONSync(`${OUTPUT_DIR}/simplemods/${mod}.json`, strippedMod);
});

fs.writeJSONSync(`${OUTPUT_DIR}/items.json`, joinedMod.items);
fs.writeJSONSync(`${OUTPUT_DIR}/npcs.json`, joinedMod.npcs);
fs.writeJSONSync(`${OUTPUT_DIR}/npc-scripts.json`, joinedMod.dialogs);
fs.writeJSONSync(`${OUTPUT_DIR}/recipes.json`, joinedMod.recipes);
fs.writeJSONSync(`${OUTPUT_DIR}/spawners.json`, joinedMod.spawners);
fs.writeJSONSync(
  `${OUTPUT_DIR}/achievements.json`,
  toHash(joinedMod.achievements, "name")
);

fs.writeJSONSync(`${OUTPUT_DIR}/quests.json`, toHash(joinedMod.quests, "name"));

const globalDroptable = joinedMod.drops.find((drop) => drop.isGlobal);
const mapDrops = joinedMod.drops.filter((drop) => drop.mapName);
const regionDrops = joinedMod.drops
  .filter((drop) => drop.regionName)
  .map((drop) => ({
    ...drop,
    drops: [...globalDroptable.drops, ...drop.drops],
  }));

fs.writeJSONSync(`${OUTPUT_DIR}/droptable-maps.json`, mapDrops);
fs.writeJSONSync(`${OUTPUT_DIR}/droptable-regions.json`, regionDrops);

handleCoreFiles(joinedMod.cores);
handleSTEMs(joinedMod.stems);
handleTraitTrees(joinedMod.traitTrees);

joinedMod.maps.forEach((mapData) => {
  const { name, map } = mapData;
  fs.writeJSONSync(`${OUTPUT_DIR}/maps/${name}.json`, map);
});
