import { Component } from '@angular/core';

import * as _ from 'lodash';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public itemName = '';
  public itemType = '';

  public itemTypes: string[] = [];

  public readonly stats: string[] = [
    'hp', 'mp',
    'attack', 'defense',
    'magic', 'magicdefense',
  ];

  public readonly statIncrements: Record<string, number> = {
    hp: 5,
    mp: 5,
    attack: 1,
    defense: 1,
    magic: 1,
    magicdefense: 1,
  }

  public readonly elements: string[] = [
    'fire', 'ice', 'earth', 'thunder', 'dark', 'light'
  ];

  public readonly rarityStats = [
    {
      name: 'Common',
      color: '#000',
      maxElements: 0,
      maxStats: 1,
      maxStatValue: 3
    },
    {
      name: 'Uncommon',
      color: '#050',
      maxElements: 0,
      maxStats: 2,
      maxStatValue: 7
    },
    {
      name: 'Unusual',
      color: '#550',
      maxElements: 1,
      maxStats: 2,
      maxStatValue: 13
    },
    {
      name: 'Rare',
      color: '#00b',
      maxElements: 1,
      maxStats: 2,
      maxStatValue: 23
    },
    {
      name: 'Masterful',
      color: '#077',
      maxElements: 1,
      maxStats: 3,
      maxStatValue: 31
    },
    {
      name: 'Arcane',
      color: '#505',
      maxElements: 3,
      maxStats: 4,
      maxStatValue: 25
    },
    {
      name: 'Epic',
      color: '#b0b',
      maxElements: 2,
      maxStats: 2,
      maxStatValue: 35
    },
    {
      name: 'Unique', // player cosmetic
      color: '#444',
      maxElements: 1,
      maxStats: 1,
      maxStatValue: 50
    },
    {
      name: 'Divine',
      color: '#66a',
      maxElements: 3,
      maxStats: 3,
      maxStatValue: 50
    }
  ];

  public items: any[] = [
    {}, {}, {}, {}, {}, {}, {}, {}, {}
  ]

  constructor() {}

  async ngOnInit() {
    const res = await fetch('https://assets.ateoat.com/manifest.json');
    const json = await res.json();

    const categories = json.assets.spritesheetPQ.filter((x: any) => !['monsters', 'portraits', 'usables', 'containers', 'gems', 'food', 'resources', 'loot'].includes(x.name));

    this.itemTypes = categories.map((x: any) => x.name);

    this.items.forEach((item, i) => this.generateItem(i));
  }

  generateItem(slot: number) {
    this.generateStats(slot);
    this.generateElements(slot);
  }

  generateStats(slot: number) {
    const item = this.items[slot];
    const { maxStats, maxStatValue } = this.rarityStats[slot];

    item.stats = {};

    const chosenStatCount = _.random(1, maxStats);
    const chosenStats = _.sampleSize(this.stats, chosenStatCount);
    const chosenStatMax = _.random(maxStatValue / 2, maxStatValue);

    chosenStats.forEach(stat => {
      item.stats[stat] = 0;
    });

    for(let i = 0; i < chosenStatMax; i++) {
      const chosenStat = _.sample(chosenStats);
      item.stats[chosenStat as string] += this.statIncrements[chosenStat as string];
    }
  }

  generateElements(slot: number) {
    const item = this.items[slot];
    const { maxElements } = this.rarityStats[slot];

    const chosenElementCount = _.random(0, maxElements);
    const chosenElements = _.sampleSize(this.elements, chosenElementCount);

    item.elements = chosenElements;
  }

  getTextForItem(slot: number) {
    return this.itemName;
  }
}
