import Entity from 'Entities/Entity';
import { ZombieMovementAI, ZombieAttackAI } from 'AI/ZombieAI';

const BODY_DRAG = 30;
export default class Zombie extends Entity {
  constructor({ x, y, spriteKey, speed, maxHealth }) {
    super({ x, y, spriteKey, speed, maxHealth });

    this.sprite.body.drag.x = BODY_DRAG;
    this.sprite.body.drag.y = BODY_DRAG;

    this.addAI(new ZombieAttackAI({ zombie: this }));
    this.addAI(new ZombieMovementAI({ zombie: this }));
  }

  update() {
    super();
  }
}