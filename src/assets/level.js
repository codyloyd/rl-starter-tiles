import DungeonMap from './dungeonMap';
import * as PIXI from 'pixi.js';
import Entity from './entity/entity';
import {WeaponRepository, ItemRepository} from './item/items';
import {MonsterTemplate, RatTemplate, GoblinTemplate, PlayerTemplate} from './entity/entities';
import {floorTile, wallTile} from './tile';

class Level {
  constructor(Game) {
    this.game = Game;
    this.width = this.game.getScreenWidth() ;
    this.height = this.game.getScreenHeight() * 2;
    this.entities = {};
    this.map = new DungeonMap({
      width: this.width,
      height: this.height,
      game: this.game
    });
    this.exploredTiles = {};
    this.items = {};

    // add Entities to Map
    for (let i = 0; i < 10; i++) {
      const entity = Math.random() > 0.5
        ? new Entity(Object.assign(MonsterTemplate, {level: this}))
        : new Entity(Object.assign(GoblinTemplate, {level: this}));
      this.addEntityAtRandomPosition(entity);
    }

    for (let i = 0; i < 16; i++) {
      this.addItemAtRandomPosition(ItemRepository.createRandom());
    }
    // this.addItemAtRandomPosition(WeaponRepository.createRandom());
    // this.addItemAtRandomPosition(ItemRepository.create("Space Ship"));
  }

  getItems() {
    return this.items;
  }

  getEntities() {
    return this.entities;
  }

  getRandomFloorPosition() {
    const x = Math.floor(Math.random() * this.width);
    const y = Math.floor(Math.random() * this.height);
    if (
      this.map.getTile(x, y).name === 'floorTile' && !this.getEntityAt(x, y)
    ) {
      return {x, y};
    } else {
      return this.getRandomFloorPosition();
    }
  }

  addItemAtRandomPosition(item) {
    const coords = this.getRandomFloorPosition();
    this.addItem(item, coords.x, coords.y);
  }

  addItem(item, x, y) {
    this.items[x + ',' + y] = item;
  }

  removeItem(item) {
    const itemKey = Object.keys(this.items).find(
      itemKey => this.items[itemKey] == item
    );
    delete this.items[itemKey];
  }

  addEntityAtRandomPosition(entity) {
    const coords = this.getRandomFloorPosition();
    entity.setPosition(coords.x, coords.y);
    this.addEntity(entity);
  }

  getEntityAt(x, y) {
    return this.entities[x + ',' + y];
  }
  getItemAt(x, y) {
    return this.items[x + ',' + y];
  }
  
  updateEntityPosition(oldX, oldY, newX, newY) {
    this.entities[newX + ',' + newY] = this.entities[oldX + ',' + oldY];
    delete this.entities[oldX + ',' + oldY];
  }

  addEntity(entity) {
    this.entities[entity.getX() + ',' + entity.getY()] = entity;
    if (entity.hasMixin('Actor')) {
      this.game.getScheduler().add(entity, true);
    }
  }

  getMap() {
    return this.map;
  }
}

export default Level;
