import Unit from 'Units/Unit';
import Zombie from 'Zombies/Zombie';
import Camera from 'Camera/Camera';
var _ = require('lodash');

var getValueFromKey = (obj, key) => obj[key];
var objectToArray = (obj) => _.keys(obj).map(getValueFromKey.bind(null, obj));

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
    array.push(this._entities.camera);
    array.push(...this.units);
    array.push(...this.zombies);
    return array;
  }

  // not allowed to set it
  set entities(value) {
    return;
  }

  get units() {
    return objectToArray(this._entities.units);
  }

  set units() {
    return;
  }

  get zombies() {
    return objectToArray(this._entities.zombies);
  }

  set zombies() {
    return;
  }

  createUnit(unitProperties, unitId = this.generateUID('unit_')) {
    this._entities.units[unitId] = new Unit(unitProperties);
    return unitId;
  }

  createZombie(zombieProperties, zombieId = this.generateUID('zombie_')) {
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

  generateUID(prefix) {
    return _.uniqueId(prefix);
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