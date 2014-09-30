export default function start() {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update,
    render: render
  });
  var sprite,
    moveToPosition;

  function preload() {
    game.load.image('star', 'assets/images/star.png');
  }

  function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    sprite = game.add.sprite(game.world.centerX, game.world.centerY, 'star');
    sprite.anchor.set(0.5);

    game.physics.arcade.enable(sprite);

    sprite.inputEnabled = true;
    sprite.events.onInputDown.add(listener, this);

    moveToPosition = {
      x: sprite.x,
      y: sprite.y
    };
  }

  function listener() {
    console.log(arguments);
  }

  function update() {
    if(game.input.activePointer.isDown) {
      console.log(game.input.activePointer);
      moveToPosition = {
        x: game.input.activePointer.x,
        y: game.input.activePointer.y
      };
    }

    if(game.physics.arcade.distanceToXY(sprite, moveToPosition.x, moveToPosition.y) > 6) {
      game.physics.arcade.moveToObject(sprite, moveToPosition, 300);
    } else {
      sprite.body.velocity.set(0);
    }
  }

  function render() {
    game.debug.inputInfo(32, 32);
  }
}
