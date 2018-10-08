import Colors from './colors';

// a Glyph is basically a collection of data from which objects can be turned into sprites
class Glyph {
  constructor({
    fg = Colors.white,
    bg = Colors.black,
    id = 0,
    tileset = null,
    bitMask = null,
    bitMaskMap = null
  }) {
    this.fg = fg;
    this.bg = bg;
    this.id = id;
    this.tileset = tileset;
    this.bitMask = bitMask;
    this.bitMaskMap = bitMaskMap;
    this.index = '_' + Math.random().toString(36).substr(2, 9);
  }
  getId() {
    return this.id;
  }
  getTileset() {
    return this.tileset;
  }
  getFg() {
    return this.fg;
  }
  getBg() {
    return this.bg;
  }
  getChar() {
    return this.char;
  }
}

export default Glyph;
