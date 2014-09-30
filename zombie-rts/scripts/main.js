export default function start() {
  var Phaser = window.Phaser;

  var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
    preload,
    create,
    update,
    render
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

    var { x, y } = sprite;
    moveToPosition = { x, y };
  }

  function listener() {
    console.log(arguments);
  }

  function update() {
    if(game.input.activePointer.isDown) {
      var { x, y } = game.input.activePointer;
      moveToPosition = { x, y };
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
