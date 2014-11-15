import Entity from 'Entity';
var Phaser = window.Phaser;

export default class Camera extends Entity {
  constructor({x, y, game, spriteKey, speed}) {
    super({x, y, game, spriteKey, speed});

    this.sprite.visible = false;
    this.sprite.body.immovable = true; // no other entity should move this
  }

  update() {
    // do nothing ?
  }

  render() {

  }
}