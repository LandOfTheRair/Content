const fs = require("fs");

function handleSpells(spells) {
  const spellData = spells.reduce((prev, s) => {
    const baseSpell = s.spell;

    baseSpell.spellName ??= s._gameId;
    baseSpell.spellMeta ||= {};
    baseSpell.spellMeta.spellRef ||= s._gameId;

    baseSpell.mpCost ||= 0;
    baseSpell.maxSkillForGain ||= 1;

    prev[s.name] = baseSpell;
    return prev;
  }, {});

  fs.writeFileSync("_output/spells.json", JSON.stringify(spellData, null, 4));
}

function handleTraits(traits) {
  const traitData = traits.reduce((prev, s) => {
    const baseTrait = s.trait;

    baseTrait.name ||= s.name;
    baseTrait.desc ||= s.all.desc;
    baseTrait.icon ||= s.all.icon;
    baseTrait.iconBgColor ||= s.all.bgColor;

    if (s._hasSpell || s._hasMacro) {
      baseTrait.spellGiven ||= s._gameId;
    }

    if (baseTrait.isAncient) {
      baseTrait.iconBgColor = "#aa5c39";
    }

    if (!baseTrait.desc) delete baseTrait.desc;
    if (!baseTrait.isAncient) delete baseTrait.isAncient;
    if (!baseTrait.iconColor) delete baseTrait.iconColor;
    if (!baseTrait.iconBgColor) delete baseTrait.iconBgColor;
    if (!baseTrait.borderColor) delete baseTrait.borderColor;
    if (!baseTrait.valuePerTier) delete baseTrait.valuePerTier;
    if (!baseTrait.spellGiven) delete baseTrait.spellGiven;
    if (Object.keys(baseTrait.statsGiven || {}).length === 0)
      delete baseTrait.statsGiven;

    prev[s._gameId] = baseTrait;
    return prev;
  }, {});

  fs.writeFileSync("_output/traits.json", JSON.stringify(traitData, null, 4));
}

function handleEffects(effects) {
  const effectData = effects.reduce((prev, s) => {
    const baseEffect = s.effect;

    baseEffect.tooltip ||= {};
    baseEffect.tooltip.desc ||= s.all.desc;
    baseEffect.tooltip.icon ||= s.all.icon;
    baseEffect.tooltip.color ||= s.all.color;
    baseEffect.tooltip.bgColor ||= s.all.bgColor;

    baseEffect.effectMeta ||= {};
    baseEffect.effect.duration ||= 0;
    baseEffect.effect.extra ||= {};
    baseEffect.effect.extra.potency ||= 0;

    prev[s.name] = baseEffect;
    return prev;
  }, {});

  fs.writeFileSync(
    "_output/effect-data.json",
    JSON.stringify(effectData, null, 4)
  );
}

function handleMacros(macros) {
  const macroData = macros.reduce((prev, s) => {
    const baseMacro = s.macro;

    baseMacro.name ||= s.name;
    baseMacro.macro ||= `cast ${s._gameId.toLowerCase()}`;
    baseMacro.icon ||= s.all.icon;
    baseMacro.color ||= s.all.color;
    baseMacro.bgColor ||= s.all.bgColor;
    baseMacro.tooltipDesc ||= s.all.desc;

    if (s.trait?.spellGiven) {
      baseMacro.for ||= s._gameId;
    }

    if (!baseMacro.key) delete baseMacro.key;
    if (!baseMacro.bgColor) delete baseMacro.bgColor;
    if (!baseMacro.isDefault) delete baseMacro.isDefault;

    prev[baseMacro.name] = baseMacro;
    return prev;
  }, {});

  fs.writeFileSync("_output/macros.json", JSON.stringify(macroData, null, 4));
}

module.exports.handleSTEMs = function handleSTEMs(fData) {
  handleSpells(fData.filter((f) => !f._isNPCOnly && f._hasSpell));
  handleTraits(fData.filter((f) => f._hasTrait));
  handleEffects(fData.filter((f) => f._hasEffect));
  handleMacros(fData.filter((f) => f._hasMacro));
};
