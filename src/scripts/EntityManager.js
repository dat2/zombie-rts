import { Unit } from 'Unit';
import { Camera } from 'Camera';
var _ = require('lodash');

export class EntityManager {
  constructor({game}) {
    this.game = game;

    this._entities = {};
  }

  // getters / setter for EntityManager.entities
  get entities() {
    let array = _.keys(this._entities).map( (key) => this._entities[key] );
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

  createCamera(cameraProperties) {
    this._entities['camera'] = new Camera(cameraProperties);
    this.game.camera.follow(this._entities['camera'].sprite);
    return this._entities['camera'];
  }

  getUnit(unitId) {
    return this._entities[unitId];
  }

  generateUIDForUnit() {
    return _.uniqueId('unit_');
  }

  update() {
    this.entities.forEach( (entity) => {
      entity.update();
      this.entities.forEach( (entity2) => {
        this.game.physics.arcade.collide(entity.sprite, entity2.sprite);
      });
    });
  }

  render() {
    this.entities.forEach( (entity) => entity.render() );
  }

  filterEntities(predicate) {
    return this.entities.filter( predicate );
  }
}