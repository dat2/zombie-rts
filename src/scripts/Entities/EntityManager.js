import Unit from 'Units/Unit';
import Camera from 'Camera/Camera';
var _ = require('lodash');

export default class EntityManager {
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

  getEntity(entityId) {
    return this._entities[entityId];
  }

  generateUIDForUnit() {
    return _.uniqueId('unit_');
  }

  update(map) {
    this.entities.forEach( (entity) => {
      // pre update
      entity.preUpdate();

      // collide with the map
      this.game.physics.arcade.collide(entity.sprite, map.layer);

      // collide with all other entities (look into a quad tree implementation?)
      this.entities.forEach( (entity2) => {
        this.game.physics.arcade.collide(entity.sprite, entity2.sprite);
      });

      // update
      entity.update();

      // post update if required
      entity.postUpdate();
    });
  }

  // render all entities
  render() {
    this.entities.forEach( (entity) => entity.render() );
  }

  filterEntities(predicate) {
    return this.entities.filter( predicate );
  }
}