import Unit from 'Units/Unit';
import GameState from 'Game/GameState';
import GameMap from 'Game/GameMap';
import EntityManager from 'Entities/EntityManager';
import SelectionHandler from 'InputHandlers/SelectionHandler';
import CameraHandler from 'InputHandlers/CameraHandler';

export default function start() {
  var Phaser = window.Phaser;

  var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
    preload,
    create,
    update,
    render
  });

  var entityManager;
  var state;
  var map;
  var selectionHandler;
  var cameraHandler;
  var debugKey;

  function preload() {
    game.load.tilemap('map', 'assets/map2.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('character', 'assets/images/character.png');
    game.load.image('tileset', 'assets/images/tile_sheet.png');
    game.load.image('zombie', 'assets/images/zombie.png');
  }

  function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.canvas.oncontextmenu = (e) => e.preventDefault();

    state = new GameState(game);
    game.gameState = state;
    map = new GameMap({
      game,
      mapName: 'map',
      dimensions: { width: 160, height: 120 },
      tileDimensions: { width: 10, height: 10 },
      walkableTiles: [3,5,6,8],
      collisionTiles: [1]
    });
    game.map = map;

    // render the map
    map.render({
      tileset: 'main',
      tilesetImageKey: 'tileset',
      layer: 'main'
    });

    debugKey = game.input.keyboard.addKey(Phaser.Keyboard.P);
    debugKey.onDown.add(() => { debugger; });

    entityManager = new EntityManager({game});
    game.entityManager = entityManager;

    selectionHandler = new SelectionHandler({game, entityManager, map});
    selectionHandler.handle();

    // add camera
    {
      let { x, y } = map.tileCoordsToWorldCoords({x: 34, y: 30});
      let cameraProperties = {x, y, game, spriteKey: 'character', speed: 100};

      let cursors = game.input.keyboard.createCursorKeys();
      cameraHandler = new CameraHandler({game, entityManager, map, cursors, cameraProperties, edgePixels: 50});
      cameraHandler.handle();
    }

    // add random entities
    for(let xi = 30; xi <= 33; xi++)
    {
      for(let yi = 25; yi <= 26; yi++)
      {
        let pos = map.tileCoordsToWorldCoords({x: xi, y: yi});
        entityManager.createUnit({x: pos.x, y: pos.y, game, spriteKey: 'character', speed: 100, maxHealth: 100});
      }
    }

    let { x, y } = map.tileCoordsToWorldCoords({ x:32, y:20 });
    entityManager.createZombie({ x, y, game, spriteKey: 'zombie', speed: 20, maxHealth: 50});

    let { x, y } = map.tileCoordsToWorldCoords({ x:32, y:50 });
    entityManager.createZombie({ x, y, game, spriteKey: 'zombie', speed: 20, maxHealth: 50});
  }

  function update() {
    entityManager.update(map);
  }

  function render() {
    game.debug.inputInfo(32, 32);

    // game.debug.geom(selectionHandler.selectionRect, '#0fffff');
    // game.debug.geom(cameraHandler.deadHorizontalRect, '#00ff00');
    // game.debug.geom(cameraHandler.deadVerticalRect, '#0000ff');
    entityManager.render();
  }
}
