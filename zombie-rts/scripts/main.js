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

  var { width: tileWidth, height: tileHeight } = state.getPixelDimensionsPerTile();

  function tilesToPixels({ x, y }) {
    return {
      x: (x + 1) * (tileWidth)  - (tileWidth / 2),
      y: (y + 1) * (tileHeight) - (tileHeight / 2)
    };
  }

  function preload() {
    game.load.image('star', 'assets/images/star.png');
    game.load.image('grass', 'assets/images/grass.jpg');
    game.load.image('grass2', 'assets/images/grass2.jpg');
  }

  function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    console.log(state);
    for(let row = 0; row < state.tiles.vertical; row++) {
      for(let col = 0; col < state.tiles.horizontal; col++) {
        game.add.sprite(tileWidth * col, tileHeight * row, 'grass' + (state.tileArray[row][col] === 1 ? '2' : ''));
      }
    }

    //player
    unit = new Unit({x: 1, y: 1});
    var { x: startX, y: startY } = tilesToPixels(unit.position);
    sprite = game.add.sprite(startX, startY, 'star');
    sprite.anchor.set(0.5);

    game.physics.arcade.enable(sprite);

    sprite.inputEnabled = true;
  }

  function setPosition({x, y}) {
    var moveX = Math.floor(x / tileWidth);
    var moveY = Math.floor(y / tileHeight);
    unit.moveTo({x, y});

    setPosOnce = true;
  }

  function update() {

    //if they press the mouse, find a path to the nearest tile
    if(game.input.activePointer.isDown) {
      var { x, y } = game.input.activePointer;

      var tile = {
        x: Math.floor(x / tileWidth),
        y: Math.floor(y / tileHeight)
      };

      unit.findPath(state.grid, tile);
    }

    //pixel coords outside of unit
    //should i move inside unit?
    var moveToPosition = tilesToPixels(unit.position);

    if(game.physics.arcade.distanceToXY(sprite, moveToPosition.x, moveToPosition.y) > 6) {
      game.physics.arcade.moveToObject(sprite, moveToPosition, 300);
      setPosOnce = false;
    } else {

      sprite.body.velocity.set(0);
      if(!setPosOnce) {
        setPosition(sprite);
      }

      if(unit.pathQueue.length > 0) {
        if(unit.iterateOverPath()) {
          moveToPosition = tilesToPixels(unit.position);
        }
      }
    }
  }

  function render() {
    game.debug.inputInfo(32, 32);
  }
}
