import MovementAI from './MovementAI';

export class UnitMovementAI extends MovementAI {
  constructor({ unit }) {
    super({ entity: unit });
  }
}