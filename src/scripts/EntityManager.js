import { Unit } from 'Unit';
var _ = require('lodash');

export class EntityManager {
  constructor({game}) {
    this.game = game;

    this._entities = {};
  }

  get entities() {
    let array = _.keys(this._entities).map( (key) => this._entities[key]);
    return array;
  }

  set entities(value) {
    return;
  }

  addUnit(unitProperties) {
    var id = this.generateUIDForUnit();
    this._entities[id] = new Unit(unitProperties);
    return id;
  }

  generateUIDForUnit() {
    return _.uniqueId('unit_');
  }

  update() {
    this.entities.forEach( (entity) => entity.update() );
  }

  filterEntities(predicate) {
    return this.entities.filter( predicate );
  }
}