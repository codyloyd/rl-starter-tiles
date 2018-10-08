import * as PIXI from 'pixi.js';
import tileset from './tileset/compiled_tileset_32x32.png'
import tilesetJson from './tileset/compiled_tileset_32x32.json'
// import terrain from './tileset/Terrain.png';
// import terrainJson from './tileset/Terrain.json';
// import monsters from './tileset/Monsters.png';
// import monstersJson from './tileset/Monsters.json';
// import terrainObjects from './tileset/Terrain_Objects.png';
// import terrainObjectsJson from './tileset/Terrain_Objects.json';
// import avatar from './tileset/Avatar.png';
// import avatarJson from './tileset/Avatar.json';
// import items from './tileset/Items.png';
// import itemsJson from './tileset/Items.json';
// import projectiles from './tileset/FX_Projectiles.png';
// import projectilesJson from './tileset/FX_Projectiles.json';
// import ui from './tileset/Interface.png';
// import uiJson from './tileset/Interface.json';

export default class Display {
  constructor(screenWidth, screenHeight) {
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;
    this.tilesetMapping = {};
    this.loaded = false;
    this.movingSprites = [];
    this.projectileSprites = [];
    this.tileSize = {x: 32, y: 32};

    this.app = new PIXI.Application({
      width: this.screenWidth * this.tileSize.x,
      height: this.screenHeight * this.tileSize.y,
      resolution: 1,
      roundPixels: false
    });
    this.app.renderer.backgroundColor = 0x140c1c;
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

    PIXI.loader
      .add(tileset)
      .load(() => {
        this.loaded = true;
        this.loadTileset(tileset, tilesetJson, 'tileset');
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
    // if (rotate) {
    //   const sX = x - sprite.x;
    //   const sY = y - sprite.y;
    //   const theta = Math.atan2(sY, sX);
    //   sprite.anchor.set(0.5, 0.5);
    //   sprite.rotation = theta;
    //   // Because the anchor offsets the positioning..
    //   // we need to move the sprite down
    //   sprite.x += sprite.width / 2;
    //   sprite.y += sprite.height / 2;
    //   x += sprite.width / 2;
    //   y += sprite.height / 2;
    //   sprite.velocity = 6;
    // }
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
      const vel = 4;
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
