import MovementAI from './MovementAI';
import Zombie from 'Zombies/Zombie';
import Unit from 'Units/Unit';

export class ZombieMovementAI extends MovementAI {
  constructor({ zombie }) {
    super({ entity: zombie });
  }
}

// TODO figure out how to store map?
export class ZombieAttackAI {
  constructor({ zombie }) {
    this.zombie = zombie;

    this.target = null;
  }

  update() {
    this.updateTarget();
    this.moveTowardsTarget();
    this.attackTarget();
  }

  // update target based on death, other zombies, etc.
  updateTarget() {

  }

  moveTowardsTarget() {
    // move to the target
    if(this.target) {
      let { x, y } = target.sprite;
      this.zombie.MoveAI.setTarget(target);
    }
  }

  // if we are at the target, attack them somehow
  attackTarget() {

  }
}