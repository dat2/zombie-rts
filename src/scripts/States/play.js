import Unit from 'Units/Unit';
import GameMap from 'Game/GameMap';
import EntityManager from 'Entities/EntityManager';
import SelectionHandler from 'InputHandlers/SelectionHandler';
import CameraHandler from 'InputHandlers/CameraHandler';

const EDGE_PIXELS = 50;
export default class PlayState {
  constructor() {
    this.game = window.game;
  }

  preload() {
    // NOTE: this is highly dependent on the location of the index.html right now...
    this.game.load.tilemap('map', '../assets/maps/map2.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('character', '../assets/images/character.png');
    this.game.load.image('tileset', '../assets/images/tile_sheet.png');
    this.game.load.image('zombie', '../assets/images/zombie.png');
  }

  setupPhaser() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.canvas.oncontextmenu = (e) => e.preventDefault();
  }

  createMap() {
    this.map = new GameMap({
      mapName: 'map',
      dimensions: { width: 160, height: 120 },
      tileDimensions: { width: 10, height: 10 },
      walkableTiles: [3,5,6,8],
      collisionTiles: [1]
    });
    this.game.map = this.map;

    // render the map
    this.map.render({
      tileset: 'main',
      tilesetImageKey: 'tileset',
      layer: 'main'
    });
  }

  createEntityManager() {
    this.entityManager = new EntityManager({ game: this.game });
    this.game.entityManager = this.entityManager;
  }

  createSelectionHandler() {
    this.selectionHandler = new SelectionHandler({
      game: this.game,
      entityManager: this.entityManager,
      map: this.map
    });
    this.selectionHandler.handle();
  }

  createCameraHandler() {
    // add camera
    let { x, y } = this.map.tileCoordsToWorldCoords({ x: 34, y: 30 });
    let cameraProperties = { x, y, spriteKey: 'character', speed: 100 };

    let cursors = this.game.input.keyboard.createCursorKeys();
    this.cameraHandler = new CameraHandler({
      entityManager: this.entityManager,
      map: this.map,
      cursors,
      cameraProperties,
      edgePixels: EDGE_PIXELS
    });
    this.cameraHandler.handle();
  }

  addTestEntities() {
    // add random entities
    for(let xi = 30; xi <= 33; xi++)
    {
      for(let yi = 25; yi <= 26; yi++)
      {
        let pos = this.map.tileCoordsToWorldCoords({ x: xi, y: yi });
        this.entityManager.createUnit({
          x: pos.x,
          y: pos.y,
          spriteKey: 'character',
          speed: 100,
          maxHealth: 100
        });
      }
    }

    let { x, y } = this.map.tileCoordsToWorldCoords({ x:32, y:20 });
    this.entityManager.createZombie({ x, y, spriteKey: 'zombie', speed: 20, maxHealth: 50 });

    let { x, y } = this.map.tileCoordsToWorldCoords({ x:32, y:50 });
    this.entityManager.createZombie({ x, y, spriteKey: 'zombie', speed: 20, maxHealth: 50 });
  }

  setupDebugKeys() {
    let debugKey = this.game.input.keyboard.addKey(Phaser.Keyboard.P);
    debugKey.onDown.add(() => { debugger; });
  }

  create() {
    this.setupPhaser();
    this.setupDebugKeys();

    this.createMap();
    this.createEntityManager();
    this.createSelectionHandler();
    this.createCameraHandler();

    this.addTestEntities();
  }

  update() {
    this.entityManager.update(this.map);
  }

  render() {
    this.game.debug.inputInfo(32, 32);

    // this.game.debug.geom(this.cameraHandler.deadHorizontalRect, '#00ff00');
    // this.game.debug.geom(this.cameraHandler.deadVerticalRect, '#0000ff');
    this.entityManager.render();
  }
}