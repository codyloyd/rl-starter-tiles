import ROT from 'rot-js';
import * as PIXI from 'pixi.js';
import playScreen from './playScreen';

class startScreen {
  constructor(Game) {
    this.game = Game;
    this.container = new PIXI.Container();
  }
  exit() {
    this.container.visible = false;
    this.container.removeChildren();
  }
  handleInput(inputData) {
    if (inputData.keyCode == ROT.VK_RETURN) {
      this.game.switchScreen(playScreen);
    }
  }
  render(Game) {
    let text = new PIXI.Text('press enter', {
      fontFamily: 'Courier',
      fontSize: 24,
      fill: 0xffffff,
      align: 'center'
    });
    this.container.addChild(text);
    this.game.display.app.stage.addChild(this.container);
  }
}

export default startScreen;
