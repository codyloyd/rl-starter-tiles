import ROT from 'rot-js';
import Colors from '../colors';

class TargetingScreen {
  constructor(masterScreen) {
    this.masterScreen = masterScreen;
    this.x = this.masterScreen.player.x;
    this.y = this.masterScreen.player.y;

    this.targetSprite = new PIXI.Sprite(
      this.masterScreen.game.display.tilesetMapping['ui'][9]
    );
    this.targetSprite.tint = Colors.getHex(Colors.yellow);
    this.targetSprite.position.set(
      this.x * this.masterScreen.game.display.tileSize.x,
      this.y * this.masterScreen.game.display.tileSize.y
    );

    this.masterScreen.levelSprites.addChild(this.targetSprite);
  }
  render() {
    this.targetSprite.position.set(
      this.x * this.masterScreen.game.display.tileSize.x,
      this.y * this.masterScreen.game.display.tileSize.y
    );
  }
  handleInput(inputData) {
    if (inputData.keyCode === ROT.VK_ESCAPE) {
      this.targetSprite.parent.removeChild(this.targetSprite);
      this.targetSprite.destroy();
      this.masterScreen.exitSubscreen();
    }
    const move = function(dX, dY) {
      this.x += dX;
      this.y += dY;
      this.render()
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
    }
  }
}

export default TargetingScreen;
