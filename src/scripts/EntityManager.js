import { Unit } from 'Unit';
var _ = require('lodash');

export class EntityManager {
  constructor({game}) {
    this.game = game;

    this._entities = {};
  }

  // getters / setter for EntityManager.entities
  get entities() {
    let array = _.keys(this._entities).map( (key) => this._entities[key]);
    return array;
  }

  // not allowed to set it
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

  render() {
    this.entities.forEach( (entity) => entity.render() );
  }

  filterEntities(predicate) {
    return this.entities.filter( predicate );
  }
}