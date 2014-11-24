import MovementAI from 'AI/MovementAI';

export class UnitMovementAI extends MovementAI {
  constructor({ unit }) {
    super({ entity: unit, renderPath: true, renderColour: 0x00FF00 });
  }
}