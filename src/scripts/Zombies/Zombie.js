import Entity from 'Entities/Entity';
import { ZombieMovementAI, ZombieAttackAI } from 'AI/ZombieAI';

const BODY_DRAG = 30;
export default class Zombie extends Entity {
  constructor({ x, y, game, spriteKey, speed, maxHealth }) {
    super({ x, y, game, spriteKey, speed, maxHealth });

    this.game = game;
    this.AttackAI = new ZombieAttackAI({ zombie: this, game });
    this.MoveAI = new ZombieMovementAI({ zombie: this });

    this.sprite.body.drag.x = BODY_DRAG;
    this.sprite.body.drag.y = BODY_DRAG;
  }

  update() {
    this.AttackAI.update(); // uses move AI
    this.MoveAI.update();
  }
}