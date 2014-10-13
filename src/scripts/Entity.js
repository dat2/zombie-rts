var Phaser = window.Phaser;
export class Entity {

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

    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.sprite.body.collideWorldBounds = true;

  }

  moveTo({ x, y }) {
    this.position = { x, y };
  }
}