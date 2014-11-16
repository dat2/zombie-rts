import Entity from 'Entities/Entity';
import { ZombieMovementAI, ZombieAttackAI } from 'AI/ZombieAI';

export default class Zombie extends Entity {
  constructor({ x, y, game, spriteKey, speed }) {
    super({ x, y, game, spriteKey, speed });

    this.game = game;
    this.MoveAI = new ZombieMovementAI({ zombie: this });
  }

  update() {
    this.MoveAI.update();
  }
}