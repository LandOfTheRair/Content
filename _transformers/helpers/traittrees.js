const fs = require("fs");

module.exports.handleTraitTrees = function handleTraitTrees(traitTrees) {
  const coreTree = traitTrees.find((t) => t.name === "Core");
  const ancientTree = traitTrees.find((t) => t.name === "Ancient");

  const newCore = () => structuredClone(coreTree.data);
  const newAncient = () => structuredClone(ancientTree.data);

  // set treeName and requiredLevel for each trait entry
  traitTrees.forEach((tree) => {
    tree.data.treeOrder.forEach((treeName) => {
      tree.data.trees[treeName].tree
        .map((t) => t.traits)
        .flat()
        .forEach((t) => {
          t.name ??= "";

          if (!t.name) {
            delete t.maxLevel;
            delete t.requires;
            delete t.isAncient;
            return;
          }

          t.treeName = treeName;
        });

      tree.data.trees[treeName].name = treeName;
      tree.data.trees[treeName].tree.forEach((row, rowIndex) => {
        row.requiredLevel = rowIndex * 10;
      });
    });
  });

  const allTraitTrees = {
    Ancient: newAncient(),
    Core: newCore(),
  };

  traitTrees.forEach((tree) => {
    allTraitTrees[tree.name] = tree.data;
  });

  // merge everything
  traitTrees.forEach((tree) => {
    if (tree.name === "Core" || tree.name === "Ancient") return;

    tree.data.treeOrder = ["Core", ...tree.data.treeOrder, "Ancient"];
    tree.data.trees.Ancient = newAncient().trees.Ancient;
    tree.data.trees.Core = newCore().trees.Core;

    tree.data.allTreeTraits = {};
    tree.data.treeOrder.forEach((treeName) => {
      tree.data.trees[treeName].tree.forEach((row) => {
        row.traits.forEach((t) => {
          if (!t.name) return;

          if (!t.isAncient) delete t.isAncient;
          if (!t.requires) delete t.requires;
          if (!t.maxLevel) t.maxLevel = 1;

          tree.data.allTreeTraits[t.name] = {
            ...t,
            requiredLevel: row.requiredLevel,
          };
        });
      });
    });
  });

  fs.writeFileSync(
    "_output/trait-trees.json",
    JSON.stringify(allTraitTrees, null, 4)
  );
};
