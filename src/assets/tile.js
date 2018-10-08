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
  id: 7857,
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
    0: 7877,
    1: 7878,
    2: 7877,
    3: 7999,
    4: 7997,
    5: 7997,
    6: 7758,
    7: 7758,
    8: 7877,
    9: 7877,
    10: 7759,
    11: 7877,
    12: 7757,
    13: 7877,
    14: 7758,
    15: 7758
  }
};

export {Tile, floorTileTemplate, wallTileTemplate};
