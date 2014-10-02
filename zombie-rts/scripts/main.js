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
  var state = new GameState(game);

  var setPosOnce = false;

  function preload() {
    game.load.image('star', 'assets/images/star.png');
    game.load.image('grass', 'assets/images/grass.jpg');
    game.load.image('grass2', 'assets/images/grass2.jpg');
  }

  function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    var { width: tileWidth, height: tileHeight } = state.getPixelDimensionsPerTile();
    for(let row = 0; row < state.tiles.vertical; row++) {
      for(let col = 0; col < state.tiles.horizontal; col++) {
        game.add.sprite(tileWidth * col, tileHeight * row, 'grass' + (state.tileArray[row][col] === 1 ? '2' : ''));
      }
    }

    //player
    unit = new Unit({x: 1, y: 1});
    var { x: startX, y: startY } = state.tileCoordsToPixelCoords(unit.position);
    sprite = game.add.sprite(startX, startY, 'star');
    sprite.anchor.set(0.5);

    game.physics.arcade.enable(sprite);

    sprite.inputEnabled = true;
  }

  function updateUnitPosition(pixelPos) {
    var tilePos = state.pixelCoordsToTileCoords(pixelPos);
    unit.moveTo(tilePos);

    setPosOnce = true;
  }

  function update() {
    if(game.input.activePointer.isDown) {
      //find the tile that the mouse clicked on
      var tilePos = state.pixelCoordsToTileCoords(game.input.activePointer);

      //find a path to this tile (findPath adds to the pathQueue)
      unit.findPath(state.grid, tilePos);
    }

    //while the sprite is not at the pixel position, keep moving
    var pixelPosition = state.tileCoordsToPixelCoords(unit.position);
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
          pixelPosition = state.tileCoordsToPixelCoords(unit.position);
        }
      }
    }
  }

  function render() {
    game.debug.inputInfo(32, 32);
  }
}
