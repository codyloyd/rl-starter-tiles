import ROT from 'rot-js';
import startScreen from './startScreen';

class gameOverScreen {
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
      this.game.switchScreen(startScreen);
    }
  }
  render(Game) {
    let text = new PIXI.Text('GAME OVER LOSER (press enter to try again)', {
      fontFamily: 'Courier',
      fontSize: 24,
      fill: 0xffffff,
      align: 'center'
    });
    this.container.addChild(text);
    this.game.display.app.stage.addChild(this.container);
  }
}
export default gameOverScreen;
