import MovementAI from './MovementAI';
import Zombie from '../Zombies/Zombie';
import Unit from '../Units/Unit';

export class ZombieMovementAI extends MovementAI {
  constructor({ zombie }) {
    super({ entity: zombie });
  }
}

// TODO figure out how to store map?
export class ZombieAttackAI {
  constructor({ zombie }) {
    this.zombie = zombie;
    this.target = undefined;
  }

  update() {
    this.updateTarget();
    this.moveTowardsTarget();
    this.attackTarget();
  }

  // update target based on death, other zombies, etc.
  updateTarget() {
    // if we have no target, find the closes
    if(this.target === undefined ||
      // if the target is dead, find another
      (this.target !== undefined && this.target.health === 0)) {

      let entities = game.entityManager.filterEntities( (entity) => entity instanceof Unit);
      if(entities.length === 0) {
        return;
      }

      let target = entities[0];
      let dist = game.physics.arcade.distanceToXY;
      let targetDist = dist(this.zombie.sprite, target.x, target.y);
      entities.forEach( (entity) => {
        let entityDist = dist(this.zombie.sprite, entity.sprite.x, entity.sprite.y);
        if(entityDist < targetDist) {
          targetDist = entityDist;
          target = entity;
        }
      });
      this.target = target;
    }
  }

  moveTowardsTarget() {
    // move to the target
    if(this.target !== undefined) {
      this.zombie.MoveAI.findPathTo(game.map, this.target.position, false);
    }
  }

  // if we are at the target, attack them somehow
  attackTarget() {

  }
}