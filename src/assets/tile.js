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

//trees
const wallTileTemplate = {
  name: 'wallTile',
  id: 13,
  tileset: 'terrainObjects',
  fg: Colors.lightGray,
  blocksLight: true,
  bitMask: 0,
  bitMaskMap: {
    0: [125,125,125,124,126],
    1: [125,125,125,124,126],
    2: [125,125,125,124,126],
    3:[125,125,125,124,126], 
    4:[125,125,125,124,126], 
    5:[125,125,125,124,126], 
    6:[125,125,125,124,126], 
    7:[125,125,125,124,126], 
    8:[125,125,125,124,126], 
    9:[125,125,125,124,126], 
    10:[125,125,125,124,126], 
    11:[125,125,125,124,126],
    12: [125,125,125,124,126],
    13:[125,125,125,124,126], 
    14:[125,125,125,124,126], 
    15:[125,125,125,124,126] 
  }
};

//dirt
// const wallTileTemplate = {
//   name: 'wallTile',
//   id: 13,
//   tileset: 'terrain',
//   fg: Colors.lightGray,
//   blocksLight: true,
//   bitMask: 0,
//   bitMaskMap: {
//     0: 120,
//     1: [120,120,120,120,121,121,122],
//     2: [120,120,120,120,121,121,122],
//     3: [120,120,120,120,121,121,122],
//     4: [120,120,120,120,121,121,122],
//     5: [120,120,120,120,121,121,122],
//     6: [120,120,120,120,121,121,122],
//     7: [120,120,120,120,121,121,122],
//     8: [104,104,104,104,104,104,104,104,104,105,107],
//     9: [104,104,104,104,104,104,104,104,104,105,107],
//     10: [104,104,104,104,104,104,104,104,104,105,107],
//     11: [104,104,104,104,104,104,104,104,104,105,107],
//     12: [104,104,104,104,104,104,104,104,104,105,107],
//     13: [104,104,104,104,104,104,104,104,104,105,107],
//     14: [104,104,104,104,104,104,104,104,104,105,107],
//     15: [104,104,104,104,104,104,104,104,104,105,107]
//   }
// };

export {Tile, floorTileTemplate, wallTileTemplate};
