import Glyph from './glyph';
import Colors from './colors';

class Tile extends Glyph {
  constructor({
    isWalkable = false,
    blocksLight = false,
    bitMaskMap = null,
    name = ''
  }) {
    super(...arguments);
    this.isWalkable = isWalkable;
    this.blocksLight = blocksLight;
    this.name = name;
  }
}

const floorTileTemplate = {
  name: 'floorTile',
  id: 861,
  tileset: 'tileset',
  fg: Colors.darkGray,
  isWalkable: true
};

const wallTileTemplate = {
  name: 'wallTile',
  id: 7877,
  tileset: 'tileset',
  fg: Colors.lightGray,
  blocksLight: true,
  bitMask: 0,
  bitMaskMap: {
    0: 1040,
    1: 1040,
    2: 1040,
    3: 1040,
    4: 1040,
    5: 1040,
    6: 1040,
    7: 1040,
    8: 1040,
    9: 1040,
    10: 1040,
    11: 1040,
    12: 1040,
    13: 1040,
    14: 1040,
    15: 1040
  }
};

export {Tile, floorTileTemplate, wallTileTemplate};
