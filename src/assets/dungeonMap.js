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

    // roomsncorridors:
    // const generator = new ROT.Map.Digger(width, height, {
    //   roomWidth: [6, 12],
    //   roomHeight: [6, 12],
    //   dugPercentage: 0.3
    // });

    // cellular generator:
    // const generator = new ROT.Map.Cellular(width, height, {
    //   connected: true
    // });
    //forest
    const generator = new ROT.Map.Cellular(width, height, {
      born: [6, 7, 8],
      survive: [2, 3, 4, 5],
      connected: true
    });
    generator.randomize(0.5);
    for (let i = 0; i < 9; i++) {
      generator.create();
    }

    //roomsncorridors
    // generator.create(
    //cellular
    generator.connect(
      function(x, y, value) {
        // change the value here to 0 for  cellular
        this.tiles[x][y] = value == 0
          ? new Tile(wallTileTemplate)
          : new Tile(floorTileTemplate);
      }.bind(this),
      1
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
