var Phaser = window.Phaser;
export default class Entity {

  // x, y are tile coordinates, not pixel coordinates
  constructor({ x, y, game , speed, spriteKey}) {
    this.position = {x, y};
    this.game = game;

    // other attributes
    // constant acceleration
    this.speed = speed;

    // visual stuff
    this.sprite = this.game.add.sprite(x, y, spriteKey);
    this.sprite.anchor.set(0.5);
    this.rect = new Phaser.Rectangle(x - this.sprite.width / 2,
      y - this.sprite.height / 2, this.sprite.width, this.sprite.height);

    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.sprite.body.collideWorldBounds = true;
    this.target = { x, y };
  }

  moveTo({ x, y }) {
    this.target = { x, y };
  }

  preUpdate() {

  }

  postUpdate() {
    // update rect for selection
    let { x, y } = this.sprite;
    this.rect = new Phaser.Rectangle(x - this.sprite.width / 2,
      y - this.sprite.height / 2, this.sprite.width, this.sprite.height);
  }
}