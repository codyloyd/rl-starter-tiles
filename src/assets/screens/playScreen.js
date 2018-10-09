import ROT from 'rot-js';
import * as PIXI from 'pixi.js';
import Entity from '../entity/entity';
import gameOverScreen from './gameOverScreen';
import Colors from '../colors';
import ItemListDialog from './itemListDialog';
import Confirmation from './confirmation';
import HelpScreen from './helpScreen';
import {PlayerTemplate} from '../entity/entities';
import Level from '../level';
import {Projectile, bulletTemplate} from '../projectile';
import TargetingScreen from './targetingScreen';

class playScreen {
  constructor(Game) {
    this.game = Game;
    this.level = new Level(this.game);
    this.map = this.level.getMap();
    this.levelSprites = new PIXI.Container();
    this.mapSprites = new PIXI.Container();
    this.itemSprites = new PIXI.Container();
    this.entitySprites = new PIXI.Container();
    this.subscreen = null;

    this.player = new Entity(
      Object.assign(PlayerTemplate, {map: this.map, Game: this.game})
    );
    const position = this.level.getRandomFloorPosition();
    this.player.setPosition(position.x, position.y);

    this.levelSetup();
    this.game.getScheduler().add(this.player, true);
    this.game.getEngine().start();
    console.log('enter play screen');
  }

  // this function takes all the level data and
  // creates all the sprites we need to display it.
  levelSetup() {
    //mapSprites
    this.mapSprites.removeChildren();
    function maybeRandom(val) {
      if (Array.isArray(val)) {
        return val[Math.floor(Math.random() * val.length)];
      }
      return val;
    }
    for (var x = 0; x < this.level.width; x++) {
      for (var y = 0; y < this.level.height; y++) {
        const tile = this.map.getTile(x, y);
        let sprite;
        if (!tile.bitMaskMap) {
          sprite = new PIXI.Sprite(
            this.game.display.tilesetMapping[tile.tileset][maybeRandom(tile.id)]
          );
        } else {
          sprite = new PIXI.Sprite(
            this.game.display.tilesetMapping[tile.tileset][
              maybeRandom(tile.bitMaskMap[tile.bitMask])
            ]
          );
        }
        sprite.x = x * this.game.display.tileSize.x;
        sprite.y = y * this.game.display.tileSize.y;
        sprite.tint = `0x${tile.fg.substring(1)}`;
        sprite.alpha = 0;
        this.mapSprites.addChild(sprite);
      }
    }
    this.levelSprites.addChild(this.mapSprites);
    // set map position
    const screenWidth = this.game.getScreenWidth();
    const screenHeight = this.game.getScreenHeight();
    let topLeftX = Math.max(0, this.player.getX() - screenWidth / 2);
    topLeftX = Math.min(topLeftX, this.level.width - screenWidth);

    let topLeftY = Math.max(0, this.player.getY() - screenHeight / 2);
    topLeftY = Math.min(topLeftY, this.level.height - screenHeight);

    this.levelSprites.position.set(
      -topLeftX * this.game.display.tileSize.x,
      -topLeftY * this.game.display.tileSize.y
    );

    //entitySprites
    this.entitySprites.removeChildren();
    const entities = this.level.getEntities();
    Object.values(entities).forEach(entity => {
      const sprite = new PIXI.Sprite(
        this.game.display.tilesetMapping[entity.tileset][entity.id]
      );
      sprite.index = entity.index;
      sprite.alpha = 1;
      sprite.tint = `0x${entity.fg.substring(1)}`;
      sprite.position.set(
        entity.getX() * this.game.display.tileSize.x,
        entity.getY() * this.game.display.tileSize.y
      );
      this.entitySprites.addChild(sprite);
    });
    this.levelSprites.addChild(this.entitySprites);
    //itemSprites
    this.itemSprites.removeChildren();
    const items = this.level.getItems();
    Object.keys(items).forEach(itemKey => {
      const [x, y] = itemKey.split(',');
      const item = items[itemKey];
      let sprite = new PIXI.Sprite(
        this.game.display.tilesetMapping[item.tileset][item.id]
      );
      sprite.index = item.index;
      sprite.alpha = 1;
      sprite.tint = Colors.getHex(item.fg);
      sprite.position.set(
        x * this.game.display.tileSize.x,
        y * this.game.display.tileSize.y
      );
      this.itemSprites.addChild(sprite);
    });
    this.levelSprites.addChild(this.itemSprites);
    //playerSprite
    this.playerSprite = new PIXI.Sprite(
      this.game.display.tilesetMapping[this.player.tileset][this.player.id]
    );
    this.playerSprite.position.set(
      (this.player.getX() - topLeftX) * this.game.display.tileSize.x,
      (this.player.getY() - topLeftY) * this.game.display.tileSize.y
    );
    this.game.display.app.stage.addChild(this.playerSprite);
    this.game.display.app.stage.addChild(this.levelSprites);
    //minimap
    this.minimap = new PIXI.Container();
    // this.minimap.x = this.screenWidth * this.game.display.tileSize.x
    this.minimap.x = this.game.screenWidth * this.game.display.tileSize.x;
    for (let x = 0; x < this.level.map.width; x++) {
      for (let y = 0; y < this.level.map.height; y++) {
        let tile = this.level.map.getTile(x, y);
        let pixel = new PIXI.Graphics();
        pixel.beginFill(Colors.getHex(tile.fg));
        pixel.drawRect(0, 0, 4, 4);
        pixel.x = x * 4;
        pixel.y = y * 4;
        pixel.endFill();
        pixel.alpha = 0;
        this.minimap.addChild(pixel);
      }
    }
    this.playerPixel = new PIXI.Graphics();
    this.playerPixel.beginFill(Colors.getHex('#ffffff'));
    this.playerPixel.drawRect(0, 0, 4, 4);
    this.playerPixel.x = this.player.x * 4;
    this.playerPixel.y = this.player.y * 4;
    this.playerPixel.endFill();
    this.playerPixel.alpha = 1;
    this.minimap.addChild(this.playerPixel);
    this.game.display.app.stage.addChild(this.minimap);
  }

  exit() {
    this.game.display.app.stage.removeChildren();
    console.log('exit play screen');
  }

  handleInput(inputData) {
    if (this.subscreen) {
      this.subscreen.handleInput(inputData);
      return;
    }
    if (inputData.keyCode === ROT.VK_ESCAPE) {
      const exitFunction = () => {
        console.log(this);
        this.game.switchScreen(gameOverScreen);
      };
      this.enterSubscreen(
        new Confirmation(
          'Are you SURE you want to INSTA-LOSE?',
          exitFunction,
          this
        )
      );
    }
    //movement
    const move = function(dX, dY) {
      this.player.tryMove(
        this.player.getX() + dX,
        this.player.getY() + dY,
        this.level
      );
      this.game.getEngine().unlock();
    }.bind(this);
    if (
      inputData.keyCode === ROT.VK_H ||
      inputData.keyCode == ROT.VK_4 ||
      inputData.keyCode == ROT.VK_LEFT
    ) {
      move(-1, 0);
    } else if (
      inputData.keyCode === ROT.VK_L ||
      inputData.keyCode == ROT.VK_6 ||
      inputData.keyCode == ROT.VK_RIGHT
    ) {
      move(1, 0);
    } else if (
      inputData.keyCode === ROT.VK_K ||
      inputData.keyCode == ROT.VK_8 ||
      inputData.keyCode == ROT.VK_UP
    ) {
      move(0, -1);
    } else if (
      inputData.keyCode === ROT.VK_J ||
      inputData.keyCode == ROT.VK_2 ||
      inputData.keyCode == ROT.VK_DOWN
    ) {
      move(0, 1);
    } else if (
      inputData.keyCode === ROT.VK_Y || inputData.keyCode == ROT.VK_7
    ) {
      move(-1, -1);
    } else if (
      inputData.keyCode === ROT.VK_U || inputData.keyCode == ROT.VK_9
    ) {
      move(1, -1);
    } else if (
      inputData.keyCode === ROT.VK_B || inputData.keyCode == ROT.VK_1
    ) {
      move(-1, 1);
    } else if (
      inputData.keyCode === ROT.VK_N || inputData.keyCode == ROT.VK_3
    ) {
      move(1, 1);
    } else if (inputData.keyCode === ROT.VK_F) {
      // fire projectile
      // bad code needs refactor
      this.enterSubscreen(
        new TargetingScreen((x, y) => {
          const bullet = new Projectile(
            Object.assign(
              {
                x: this.player.x,
                y: this.player.y,
                game: this.game
              },
              bulletTemplate
            )
          );
          this.levelSprites.addChild(bullet.sprite);
          const destx = x * this.game.display.tileSize.x;
          const desty = y * this.game.display.tileSize.y;
          this.game.display.addProjectile(
            bullet.sprite,
            destx,
            desty,
            () => {
              this.game.getEngine().unlock();
              bullet.onDestination();
            },
            true
          );
        }, this)
      );
    }
    // subscreens
    if (inputData.keyCode == ROT.VK_I) {
      this.enterSubscreen(new ItemListDialog(this.player.inventory, this));
    }
    if (inputData.keyCode == ROT.VK_SLASH) {
      this.enterSubscreen(new HelpScreen(this));
    }
    if (inputData.keyCode == ROT.VK_X) {
      this.enterSubscreen(
        new TargetingScreen((x, y) => {
          const entity = this.level.getEntityAt(x, y);
          const item = this.level.getItemAt(x, y);
          if (entity) {
            this.game.messageDisplay.add('this is ' + entity.describeA());
          }
          if (item) {
            this.game.messageDisplay.add('this is ' + item.describeA());
          }
          if (!item && !entity) {
            this.game.messageDisplay.add('you see nothing here');
          }
        }, this)
      );
    }
  }

  enterSubscreen(subscreen) {
    this.subscreen = subscreen;
    this.game.refresh();
  }

  exitSubscreen() {
    this.subscreen = null;
    this.game.refresh();
  }

  render(Game) {
    const moveSprite = this.game.display.moveSprite.bind(this.game.display);
    // player status display
    const playerStatusDisplay = Game.playerStatusDisplay;
    playerStatusDisplay.render({name: this.player.name, hp: 40, maxHp: 40});

    // autopickupitems
    // THIS LOGIC SHOULD PROBABLY NOT LIVE IN THE PLAYSCREEN AS IT IS GAME LOGIC
    // AND NOT PURELY DISPLAY RELATED
    // IT SHOULD ALMOST CERTAINLY BE IN THE "TRY MOVE" and INVENTORY HOLDER mixins
    // MIGHT NEED A NEW MIXIN FOR 'CAN PICK UP ITEMS'
    const items = this.level.getItems();
    if (items[this.player.getX() + ',' + this.player.getY()]) {
      const item = items[this.player.getX() + ',' + this.player.getY()];
      if (item.canPickUp && this.player.addItem(item)) {
        this.level.removeItem(item);
        this.game.messageDisplay.add('you pick up ' + item.describeA());
        console.log('you pick up ' + item.describeA());
      } else {
        this.game.messageDisplay.add('you see ' + item.describeA());
        console.log('you see ' + item.describeA());
      }
    }

    // map
    const map = this.level.getMap();
    //calculate FOV
    const fov = new ROT.FOV.PreciseShadowcasting((x, y) => {
      if (map.getTile(x, y)) {
        return !map.getTile(x, y).blocksLight;
      }
      return false;
    });

    const visibleTiles = {};
    const exploredTiles = this.level.exploredTiles;
    fov.compute(this.player.getX(), this.player.getY(), 10, function(
      x,
      y,
      r,
      visibility
    ) {
      visibleTiles[x + ',' + y] = true;
      exploredTiles[x + ',' + y] = true;
    });

    // camera stuff here.....
    const screenWidth = Game.getScreenWidth();
    const screenHeight = Game.getScreenHeight();
    let topLeftX = Math.max(0, this.player.getX() - screenWidth / 2);
    topLeftX = Math.min(topLeftX, this.level.width - screenWidth);

    let topLeftY = Math.max(0, this.player.getY() - screenHeight / 2);
    topLeftY = Math.min(topLeftY, this.level.height - screenHeight);

    // this moves the map around the canvas
    moveSprite(
      this.levelSprites,
      -topLeftX * this.game.display.tileSize.x,
      -topLeftY * this.game.display.tileSize.y
    );

    // draw map
    for (var x = topLeftX; x < topLeftX + screenWidth; x++) {
      for (var y = topLeftY; y < topLeftY + screenHeight; y++) {
        const sprite = this.mapSprites.children.find(sprite => {
          return (
            sprite.x / this.game.display.tileSize.x == x &&
            sprite.y / this.game.display.tileSize.y == y
          );
        });
        const minimapCell = this.minimap.children.find(
          cell => cell.x / 4 == x && cell.y / 4 == y
        );
        if (visibleTiles[x + ',' + y]) {
          sprite.alpha = 1;
          minimapCell.alpha = 1;
        } else if (this.level.exploredTiles[x + ',' + y]) {
          sprite.alpha = 0.3;
          minimapCell.alpha = 0.4;
        }
        if (items[`${x},${y}`]) {
          sprite.alpha = 0;
        }
      }
    }

    this.playerPixel.alpha = 1;
    this.playerPixel.x = this.player.x * 4;
    this.playerPixel.y = this.player.y * 4;

    // update items
    this.itemSprites.children.forEach(itemSprite => {
      const items = this.level.getItems();
      const item = Object.values(items).find(item => {
        return item.index === itemSprite.index;
      });
      // remove sprites for items that have been removed
      if (!item) {
        console.log(this.itemSprites.children.length);
        this.itemSprites.removeChild(itemSprite);
      }

      const x = itemSprite.x / this.game.display.tileSize.x;
      const y = itemSprite.y / this.game.display.tileSize.y;

      if (visibleTiles[x + ',' + y]) {
        itemSprite.alpha = 1;
      } else {
        itemSprite.alpha = 0;
      }
    });

    // update monsters
    const entities = this.level.getEntities();
    Object.values(entities).forEach(entity => {
      const sprite = this.entitySprites.children.find(sprite => {
        return sprite.index === entity.index;
      });
      if (visibleTiles[entity.x + ',' + entity.y]) {
        sprite.alpha = 1;
        // sprite.position.set(entity.x * this.game.display.tileSize.x, entity.y * this.game.display.tileSize.y);
        moveSprite(
          sprite,
          entity.x * this.game.display.tileSize.x,
          entity.y * this.game.display.tileSize.y
        );
      } else {
        sprite.position.set(
          entity.x * this.game.display.tileSize.x,
          entity.y * this.game.display.tileSize.y
        );
        sprite.alpha = 0;
      }
    });

    // draw player
    // this.playerSprite.position.set(
    //   this.player.getX() * this.game.display.tileSize.x,
    //   this.player.getY() * this.game.display.tileSize.y
    // )
    moveSprite(
      this.playerSprite,
      (this.player.getX() - topLeftX) * this.game.display.tileSize.x,
      (this.player.getY() - topLeftY) * this.game.display.tileSize.y
    );

    // put player on top layer
    this.playerSprite.parent.addChild(this.playerSprite);

    if (this.subscreen) {
      this.subscreen.render(Game);
      return;
    }
  }
}

export default playScreen;
