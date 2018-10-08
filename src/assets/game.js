import ROT from 'rot-js';
import startScreen from './screens/startScreen';
import MessageDisplay from './messageDisplay';
import PlayerStatusDisplay from './playerStatusDisplay';
import Display from './display';

class Game {
  constructor() {
    console.log('game');
    this.screenWidth = 60;
    this.screenHeight = 26;
    this.scheduler = new ROT.Scheduler.Speed();
    this.engine = new ROT.Engine(this.scheduler);
    this.display = new Display(this.screenWidth, this.screenHeight);
    this.currentScreen;
    this.messageDisplay = new MessageDisplay();
    this.playerStatusDisplay = new PlayerStatusDisplay();

    window.addEventListener('keydown', e => {
      if (this.currentScreen) {
        this.currentScreen.handleInput(e);
      }
    });
  }
  getTilesetCoords(id, tileset) {
    let tileWidth = tileset.tilewidth;
    let tileHeight = tileset.tileheight;
    let cols = tileset.columns;
    let rowNumber = Math.floor(id / cols) * tileHeight;
    let colNumber = id % cols * tileWidth;
    return [colNumber, rowNumber];
  }
  getScheduler() {
    return this.scheduler;
  }
  getEngine() {
    return this.engine;
  }
  getDisplay() {
    return this.app;
  }
  getScreenWidth() {
    return this.screenWidth;
  }
  getScreenHeight() {
    return this.screenHeight;
  }
  switchScreen(screen, options = {}) {
    if (this.currentScreen) {
      this.currentScreen.exit();
    }
    this.currentScreen = new screen(this, options);
    this.refresh();
  }
  refresh() {
    this.currentScreen.render(this);
  }
}

export default Game;

window.onload = function() {
  if (!ROT.isSupported()) {
    alert("The rot.js library isn't supported by your browser.");
  } else {
    const game = new Game();
    document.body.appendChild(game.playerStatusDisplay.getDisplay());
    document.body.appendChild(game.display.app.view);
    document.body.appendChild(game.messageDisplay.getDisplay());
    game.switchScreen(startScreen);
  }
};
