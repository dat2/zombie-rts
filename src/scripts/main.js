import { Unit } from 'Unit';
import { GameState } from 'GameState';

export default function start() {
  var Phaser = window.Phaser;

  var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
    preload,
    create,
    update,
    render
  });
  var sprite;

  var unit;
  var state;

  var setPosOnce = false;

  function preload() {
    game.load.tilemap('map', 'assets/map.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('character', 'assets/images/character.png');
    game.load.image('tileset', 'assets/images/tile_sheet.png');
  }

  function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    state = new GameState(game);

    state.map.addTilesetImage('main', 'tileset', 10, 10);
    state.layer = state.map.createLayer('Tile Layer 1');
    state.layer.resizeWorld();

    //player
    unit = new Unit({x: 36, y: 30});
    var { x: startX, y: startY } = state.tileCoordsToWorldCoords(unit.position);

    sprite = game.add.sprite(startX, startY, 'character');
    sprite.anchor.set(0.5);

    game.physics.arcade.enable(sprite);
  }

  function updateUnitPosition(worldPos) {
    var tilePos = state.worldCoordsToTileCoords(worldPos);
    unit.moveTo(tilePos);

    setPosOnce = true;
  }

  function update() {
    if(game.input.activePointer.isDown) {
      //find the tile that the mouse clicked on
      var tilePos = state.worldCoordsToTileCoords(game.input.activePointer);
      console.log(tilePos);

      //find a path to this tile (findPath adds to the pathQueue)
      unit.findPath(state.grid, tilePos);
    }

    //while the sprite is not at the pixel position, keep moving
    var pixelPosition = state.tileCoordsToWorldCoords(unit.position);
    if(game.physics.arcade.distanceToXY(sprite, pixelPosition.x, pixelPosition.y) > 6) {
      game.physics.arcade.moveToObject(sprite, pixelPosition, 300);
      setPosOnce = false;
    } else {

      //else stop moving, and update the units position to the new tile
      sprite.body.velocity.set(0);
      if(!setPosOnce) {
        updateUnitPosition(sprite);
      }

      // if the unit has more points in the pathQueue, set the next move position
      // to the next point in the queue
      if(unit.pathQueue.length > 0) {
        if(unit.iterateOverPath()) {
          pixelPosition = state.tileCoordsToWorldCoords(unit.position);
        }
      }
    }
  }

  function render() {
    game.debug.inputInfo(32, 32);
  }
}
