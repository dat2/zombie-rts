export default function start() {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update
  });

  function preload() {
    game.load.image('star', 'assets/images/star.png');
  }

  function create() {
    game.add.sprite(50, 10, 'star');
  }

  function update() {}
}
