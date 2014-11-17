import Unit from './Unit';
import { SquadMovementAI } from 'AI/SquadAI';

const MAX_UNITS = 10;
export default class Squad {

  constructor(maxUnits = MAX_UNITS, units = []) {
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