var easystar = require('easystar');

export default function start() {
  var Phaser = window.Phaser;

  var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
    preload,
    create,
    update,
    render
  });
  var sprite,
    moveToPosition,
    grid;

  var numTilesHorizontal = 5;
  var numTilesVertical = 5;

  //automatically set some (visual) tiles
  var { width, height } = game;
  var tileWidth = width / numTilesHorizontal;
  var tileHeight = height / numTilesVertical;

  var curPos = {
    x: 1,
    y: 1
  };

  var setPosOnce = false;

  var pathQueue = [];

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

    //create data for the tile
    var tileArray = [
      [0,1,0,0,1],
      [0,0,0,0,1],
      [1,1,0,0,0],
      [1,1,0,1,1],
      [0,1,0,0,0]
    ];

    for(let row = 0; row < numTilesVertical; row++) {
      for(let col = 0; col < numTilesHorizontal; col++) {
        game.add.sprite(tileWidth * col, tileHeight * row, 'grass' + (tileArray[row][col] === 1 ? '2' : ''));
      }
    }

    //create a grid
    grid = new easystar.js();
    grid.setGrid(tileArray);
    grid.setAcceptableTiles([0]);
    // grid.enableDiagonals();

    //player
    var { x: startX, y: startY } = tilesToPixels(curPos);
    sprite = game.add.sprite(startX, startY, 'star');
    sprite.anchor.set(0.5);

    game.physics.arcade.enable(sprite);

    sprite.inputEnabled = true;

    var { x, y } = sprite;
    moveToPosition = { x, y };
  }

  function setCurPos() {
    var { x: spriteX, y: spriteY } = sprite;
    curPos.x = Math.floor(spriteX / tileWidth);
    curPos.y = Math.floor(spriteY / tileHeight);
    console.log(curPos);

    setPosOnce = true;
  }

  function update() {
    if(game.input.activePointer.isDown) {
      var { x, y } = game.input.activePointer;

      var tile = {
        x: Math.floor(x / tileWidth),
        y: Math.floor(y / tileHeight)
      };

      if(pathQueue.length === 0) {
        grid.findPath(curPos.x, curPos.y, tile.x, tile.y, function(path) {
          path.shift();
          pathQueue = pathQueue.concat(path);
          console.log(pathQueue);
        });
        grid.calculate();
      }
    }

    if(game.physics.arcade.distanceToXY(sprite, moveToPosition.x, moveToPosition.y) > 6) {
      game.physics.arcade.moveToObject(sprite, moveToPosition, 300);
      setPosOnce = false;
    } else {
      sprite.body.velocity.set(0);
      if(!setPosOnce) {
        setCurPos();
      }

    if(pathQueue.length > 0) {
      var move = pathQueue.shift();
      if(move !== undefined) {
        moveToPosition = tilesToPixels(move);
      }
    }

    }
  }

  function render() {
    game.debug.inputInfo(32, 32);
  }
}
