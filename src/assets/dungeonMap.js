import ROT from 'rot-js';
import {Tile, floorTileTemplate, wallTileTemplate} from './tile';

class DungeonMap {
  constructor({width = 40, height = 20, game = null}) {
    this.width = width;
    this.height = height;
    this.game = game;
    this.tiles = new Array(width);

    for (let w = 0; w < width; w++) {
      this.tiles[w] = new Array(height);
    }

    const generator = new ROT.Map.Digger(width, height, {
      roomWidth: [6, 12],
      roomHeight: [6, 12],
      dugPercentage: 0.3
    });

    generator.create(
      function(x, y, value) {
        this.tiles[x][y] = value == 1
          ? new Tile(wallTileTemplate)
          : new Tile(floorTileTemplate);
      }.bind(this)
    );
    // bitmasking
    this.tiles.forEach((col, x) => {
      col.forEach((tile, y) => {
        if (tile.name == 'floorTile') return;
        let bitMask = 0;
        //north
        if (
          this.getTile(x, y - 1) && this.getTile(x, y - 1).name == 'wallTile'
        ) {
          bitMask += 1;
        }
        //east
        if (
          this.getTile(x + 1, y) && this.getTile(x + 1, y).name == 'wallTile'
        ) {
          bitMask += 4;
        }
        //south
        if (
          this.getTile(x, y + 1) && this.getTile(x, y + 1).name == 'wallTile'
        ) {
          bitMask += 8;
        }
        //west
        if (
          this.getTile(x - 1, y) && this.getTile(x - 1, y).name == 'wallTile'
        ) {
          bitMask += 2;
        }
        this.tiles[x][y].bitMask = bitMask;
      });
    });
  }

  getTiles() {
    return this.tiles;
  }

  getTile(x, y) {
    try {
      return this.tiles[x][y];
    } catch (e) {}
  }
}

export default DungeonMap;
