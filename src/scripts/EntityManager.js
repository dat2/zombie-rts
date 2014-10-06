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

  addUnit(unitProperties, unitId = this.generateUIDForUnit()) {
    this._entities[unitId] = new Unit(unitProperties);
    return unitId;
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

  setCameraToFollowEntity(entityId) {
    this.game.camera.follow(this._entities[entityId].sprite);
  }
}