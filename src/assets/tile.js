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
  id: 8,
  tileset: 'terrainObjects',
  fg: Colors.darkGray,
  isWalkable: true
};

const wallTileTemplate = {
  name: 'wallTile',
  id: 13,
  tileset: 'terrain',
  fg: Colors.lightGray,
  blocksLight: true,
  bitMask: 0,
  bitMaskMap: {
    0: 120,
    1: [120,120,120,120,121,121,122],
    2: [120,120,120,120,121,121,122],
    3: [120,120,120,120,121,121,122],
    4: [120,120,120,120,121,121,122],
    5: [120,120,120,120,121,121,122],
    6: [120,120,120,120,121,121,122],
    7: [120,120,120,120,121,121,122],
    8: [104,104,104,104,104,104,104,104,104,105,107],
    9: [104,104,104,104,104,104,104,104,104,105,107],
    10: [104,104,104,104,104,104,104,104,104,105,107],
    11: [104,104,104,104,104,104,104,104,104,105,107],
    12: [104,104,104,104,104,104,104,104,104,105,107],
    13: [104,104,104,104,104,104,104,104,104,105,107],
    14: [104,104,104,104,104,104,104,104,104,105,107],
    15: [104,104,104,104,104,104,104,104,104,105,107]
  }
};

export {Tile, floorTileTemplate, wallTileTemplate};
