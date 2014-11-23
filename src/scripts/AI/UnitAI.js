import MovementAI from 'AI/MovementAI';

export class UnitMovementAI extends MovementAI {
  constructor({ unit }) {
    super({ entity: unit });
  }
}