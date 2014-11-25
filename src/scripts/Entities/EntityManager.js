// ES6 is WebKit context
import Unit from 'Units/Unit';
import Zombie from 'Zombies/Zombie';
import Camera from 'Camera/Camera';

// require is node.js context
var _ = require('lodash');

export default class EntityManager {
  constructor() {
    this._entities = {
      units: {},
      zombies: {},
      camera: null
    };
  }

  // getters / setter for EntityManager.entities
  get entities() {
    let array = [];
    array.push(...this.units);
    array.push(...this.zombies);
    return array;
  }

  // not allowed to set it
  set entities(value) {
    return;
  }

  get units() {
    return _.values(this._entities.units);
  }

  set units() {
    return;
  }

  get zombies() {
    return _.values(this._entities.zombies);
  }

  set zombies() {
    return;
  }

  createUnit(unitProperties, unitId = _.uniqueId('unit_')) {
    this._entities.units[unitId] = new Unit(unitProperties);
    return unitId;
  }

  createZombie(zombieProperties, zombieId = _.uniqueId('zombie_')) {
    this._entities.zombies[zombieId] = new Zombie(zombieProperties);
    return zombieId;
  }

  createCamera(cameraProperties) {
    this._entities.camera = new Camera(cameraProperties);
    game.camera.follow(this._entities.camera.sprite);
    return 'camera';
  }

  getUnit(unitId) {
    return this._entities.units[unitId];
  }

  getZombie(zombieId) {
    return this._entities.zombies[zombieId];
  }

  getEntity(entityId) {
    return this._entities[entityId];
  }

  update(map) {
    this.entities.forEach( (entity) => {
      // pre update
      entity.preUpdate();

      // collide with the map
      game.physics.arcade.collide(entity.sprite, map.layer);

      // collide with all other entities (look into a quad tree implementation?)
      this.entities.forEach( (entity2) => {
        game.physics.arcade.collide(entity.sprite, entity2.sprite);
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