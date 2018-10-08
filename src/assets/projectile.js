import Glyph from './glyph';
import Colors from './colors';

class Projectile extends Glyph {
  constructor({x, y, game}) {
    super(...arguments);
    this.game = game;
    this.x = x;
    this.y = y;
    this.sprite = new PIXI.Sprite(
      this.game.display.tilesetMapping[this.tileset][this.id]
    );
    this.sprite.tint = `0x${this.fg.substring(1)}`;
    this.sprite.x = this.x * 16;
    this.sprite.y = this.y * 24;
  }
  onDestination() {
    console.log('BANG');
    this.sprite.parent.removeChild(this.sprite);
  }
}

const bulletTemplate = {
  id: 6,
  tileset: 'projectiles',
  fg: Colors.yellow
};

export {Projectile, bulletTemplate};
