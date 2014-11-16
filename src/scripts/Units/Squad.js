import Unit from './Unit';
import { SquadMovementAI } from 'AI/SquadAI';

export default class Squad {

  constructor(maxUnits = 10, units = []) {
    this.maxUnits = maxUnits;
    this.units = units;

    this.MoveAI = new SquadMovementAI(this);
  }

  addUnit(unit) {
    this.units.push(unit);
  }

  addUnits(units) {
    this.units.push(...units);
  }

}