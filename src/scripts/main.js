import { Unit } from 'Unit';
import { GameState } from 'GameState';
import { GameMap } from 'GameMap';

export default function start() {
  var Phaser = window.Phaser;

  var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
    preload,
    create,
    update,
    render
  });

  var unit;
  var unit2;
  var state;
  var map;

  var setPosOnce = false;

  function preload() {
    game.load.tilemap('map', 'assets/map.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('character', 'assets/images/character.png');
    game.load.image('tileset', 'assets/images/tile_sheet.png');
  }

  function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    state = new GameState(game);
    map = new GameMap({
      game,
      mapName: 'map',
      dimensions: { width: 80, height: 60 },
      tileDimensions: { width: 10, height: 10 },
      walkableTiles: [5,6,8]
    });

    // render the map
    map.render({
      tileset: 'main',
      tilesetImageKey: 'tileset',
      layer: 'Tile Layer 1'
    });


    // player

    // render the player on screen
    {
      let { x, y } = map.tileCoordsToWorldCoords({x: 36, y: 30});
      unit = new Unit({x, y, game, spriteKey: 'character', speed: 100});
    }

    {
      let { x, y } = map.tileCoordsToWorldCoords({x: 30, y: 30});
      unit2 = new Unit({x, y, game, spriteKey: 'character', speed: 100});
    }
  }

  // move the unit's tile position
  function updateUnitPosition(worldPos) {
    unit.moveTo(worldPos);

    setPosOnce = true;
  }

  function update() {
    // if the mouse is pressed, find a path to the mouse's position
    if(game.input.activePointer.isDown) {
      unit.findPath(map, game.input.activePointer);
      unit2.findPath(map, game.input.activePointer);
    }

    unit.update();
    unit2.update();
  }

  function render() {
    game.debug.inputInfo(32, 32);
  }
}
