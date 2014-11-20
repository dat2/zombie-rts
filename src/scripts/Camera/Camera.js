import Entity from '../Entities/Entity';

export default class Camera extends Entity {
  constructor({x, y, spriteKey, speed}) {
    super({x, y, spriteKey, speed});

    this.sprite.visible = false;
    this.sprite.body.immovable = true; // no other entity should move this
  }
}