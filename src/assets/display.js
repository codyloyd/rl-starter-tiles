import * as PIXI from 'pixi.js';
import terrain from './tileset/Terrain.png';
import terrainJson from './tileset/Terrain.json';
import monsters from './tileset/Monsters.png';
import monstersJson from './tileset/Monsters.json';
import terrainObjects from './tileset/Terrain_Objects.png';
import terrainObjectsJson from './tileset/Terrain_Objects.json';
import avatar from './tileset/Avatar.png';
import avatarJson from './tileset/Avatar.json';
import items from './tileset/Items.png';
import itemsJson from './tileset/Items.json';
import projectiles from './tileset/FX_Projectiles.png';
import projectilesJson from './tileset/FX_Projectiles.json';
import ui from './tileset/Interface.png';
import uiJson from './tileset/Interface.json';

export default class Display {
  constructor(screenWidth, screenHeight) {
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;
    this.tilesetMapping = {};
    this.loaded = false;
    this.movingSprites = [];
    this.projectileSprites = [];
    this.tileSize = {x: 16, y: 24};

    this.app = new PIXI.Application({
      //extra width for the minimap
      width: this.screenWidth * this.tileSize.x + this.screenWidth * 4,
      height: this.screenHeight * this.tileSize.y,
      resolution: 2,
      roundPixels: false
    });
    this.app.renderer.backgroundColor = 0x140c1c;
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

    PIXI.loader
      .add(terrain)
      .add(avatar)
      .add(terrainObjects)
      .add(monsters)
      .add(items)
      .add(projectiles)
      .add(ui)
      .load(() => {
        this.loaded = true;
        this.loadTileset(terrain, terrainJson, 'terrain');
        this.loadTileset(terrainObjects, terrainObjectsJson, 'terrainObjects');
        this.loadTileset(monsters, monstersJson, 'monsters');
        this.loadTileset(avatar, avatarJson, 'avatar');
        this.loadTileset(items, itemsJson, 'items');
        this.loadTileset(projectiles, projectilesJson, 'projectiles');
        this.loadTileset(ui, uiJson, 'ui');
        this.app.ticker.add(delta => this.animationLoop(delta));
        this.app.ticker.add(delta => this.projectileLoop(delta));
      });
  }

  addProjectile(sprite, x, y, onDestination) {
    const sX = x - sprite.x;
    const sY = y - sprite.y;
    const theta = Math.atan2(sY, sX);
    sprite.anchor.set(0.5, 0.5);
    sprite.rotation = theta;
    // Because the anchor offsets the positioning..
    // we need to move the sprite down
    sprite.x += sprite.width / 2;
    sprite.y += sprite.height / 2;
    x += sprite.width / 2;
    y += sprite.height / 2;

    this.projectileSprites.push({
      sprite,
      destination: [x, y],
      onDestination
    });
  }

  projectileLoop(delta) {
    this.projectileSprites.forEach((movingSprite, i) => {
      const x = movingSprite.destination[0];
      const y = movingSprite.destination[1];
      const sprite = movingSprite.sprite;
      const vel = 6;
      const sX = x - sprite.x;
      const sY = y - sprite.y;
      const theta = Math.atan2(sY, sX);
      let dx = 0;
      let dy = 0;
      if (x !== sprite.x) {
        dx = vel * Math.cos(theta) * delta;
      }
      if (y !== sprite.y) {
        dy = vel * Math.sin(theta) * delta;
      }
      if (Math.abs(sprite.x - x) <= vel) {
        dx = 0;
        sprite.x = x;
      }
      if (Math.abs(sprite.y - y) <= vel * 1.5) {
        dy = 0;
        sprite.y = y;
      }
      if (sprite.x == x && sprite.y == y) {
        if (movingSprite.onDestination) {
          movingSprite.onDestination();
        }
        this.projectileSprites.splice(i, 1);
      }
      sprite.x += dx;
      sprite.y += dy;
    });
  }

  moveSprite(sprite, x, y, onDestination) {
    // no animation
    // sprite.x = x;
    // sprite.y = y;

    // animation
    const existing = this.movingSprites.find(obj => obj.sprite == sprite);
    if (existing) {
      sprite.position.set(existing.destination[0], existing.destination[1])
      this.movingSprites.splice(this.movingSprites.indexOf(existing), 1);
    }
    this.movingSprites.push({
      sprite,
      destination: [x, y],
      onDestination
    });
  }

  animationLoop(delta) {
    this.movingSprites.forEach((movingSprite, i) => {
      const x = movingSprite.destination[0];
      const y = movingSprite.destination[1];
      const sprite = movingSprite.sprite;
      const vel = 5;
      let dx = 0;
      let dy = 0;
      if (x > sprite.x) {
        dx = vel;
      }
      if (x < sprite.x) {
        dx = -vel;
      }
      if (y > sprite.y) {
        dy = vel * 1.5;
      }
      if (y < sprite.y) {
        dy = -vel * 1.5;
      }
      if (Math.abs(sprite.x - x) <= vel) {
        dx = 0;
        sprite.x = x;
      }
      if (Math.abs(sprite.y - y) <= vel * 1.5) {
        dy = 0;
        sprite.y = y;
      }
      if (sprite.x == x && sprite.y == y) {
        if (movingSprite.onDestination) {
          movingSprite.onDestination();
        }
        this.movingSprites.splice(i, 1);
      }
      sprite.x += dx;
      sprite.y += dy;
    });
  }

  loadTileset(imgFile, jsonFile, tilesetName) {
    let tileset = PIXI.loader.resources[imgFile].texture;
    this.tilesetMapping[tilesetName] = {};
    for (let id = 0; id < jsonFile.tilecount; id++) {
      let coords = this.getTilesetCoords(id, jsonFile);
      let frame = new PIXI.Rectangle(
        coords[0],
        coords[1],
        jsonFile.tilewidth,
        jsonFile.tileheight
      );
      let texture = new PIXI.Texture(tileset, frame);
      this.tilesetMapping[tilesetName][id] = texture;
    }
  }

  getTilesetCoords(id, tileset) {
    let tileWidth = tileset.tilewidth;
    let tileHeight = tileset.tileheight;
    let cols = tileset.columns;
    let rowNumber = Math.floor(id / cols) * tileHeight;
    let colNumber = id % cols * tileWidth;
    return [colNumber, rowNumber];
  }
}
