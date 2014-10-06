import { Unit } from 'Unit';
import { GameState } from 'GameState';
import { GameMap } from 'GameMap';
import { EntityManager } from 'EntityManager';
import { SelectionHandler } from 'SelectionHandler';

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

  function preload() {
    game.load.tilemap('map', 'assets/map2.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('character', 'assets/images/character.png');
    game.load.image('tileset', 'assets/images/tile_sheet.png');
  }

  function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.canvas.oncontextmenu = (e) => e.preventDefault();

    state = new GameState(game);
    map = new GameMap({
      game,
      mapName: 'map',
      dimensions: { width: 160, height: 120 },
      tileDimensions: { width: 10, height: 10 },
      walkableTiles: [5,6,8]
    });

    // render the map
    map.render({
      tileset: 'main',
      tilesetImageKey: 'tileset',
      layer: 'main'
    });

    entityManager = new EntityManager({game});
    selectionHandler = new SelectionHandler({game, entityManager, map});
    selectionHandler.handle();

    // add random entities
    {
      let { x, y } = map.tileCoordsToWorldCoords({x: 34, y: 30});
      entityManager.addUnit({x, y, game, spriteKey: 'character', speed: 100}, 'follow');
      entityManager.setCameraToFollowEntity('follow');
    }

    {
      let { x, y } = map.tileCoordsToWorldCoords({x: 30, y: 30});
      entityManager.addUnit({x, y, game, spriteKey: 'character', speed: 100});
    }

    {
      let { x, y } = map.tileCoordsToWorldCoords({x: 42, y: 30});
      entityManager.addUnit({x, y, game, spriteKey: 'character', speed: 100});
    }
  }

  function update() {
    entityManager.update();
  }

  function render() {
    game.debug.inputInfo(32, 32);

    game.debug.geom(selectionHandler.selectionRect, '#0fffff');
    entityManager.render();
  }
}
