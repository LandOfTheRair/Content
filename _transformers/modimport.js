const fs = require("fs-extra");

function toHash(arr, indexProp) {
  return arr.reduce(
    (prev, cur) => ({
      ...prev,
      [cur[indexProp]]: cur,
    }),
    {}
  );
}

const OUTPUT_DIR = "_output";

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

  modFile.maps.forEach((mapData) => {
    const { name, map } = mapData;
    fs.writeJSONSync(`${OUTPUT_DIR}/maps/${name}.json`, map);
  });
});
