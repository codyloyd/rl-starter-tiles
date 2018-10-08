// DAWNBRINGER 16 PALETTE
// https://lospec.com/palette-list/dawnbringer-16
export default {
  black: '#140c1c',
  darkPurple: '#442434',
  darkBlue: '#30346d',
  darkGreen: '#346524',
  brown: '#854c30',
  darkGray: '#4e4a4e',
  lightGray: '#8595a1',
  white: '#deeed6',
  red: '#d04648',
  orange: '#d27d2c',
  yellow: '#dad45e',
  green: '#6daa2c',
  blue: '#597dce',
  indigo: '#6dc2ca',
  grayBrown: '#757161',
  peach: '#d2aa99',
  getHex: function(colorString) {
    return `0x${colorString.substring(1)}`;
  }
};
