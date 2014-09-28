var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
  preload: preload,
  create: create,
  update: update
});

function preload() {
  game.load.image('star', 'assets/star.png');
}

function create() {

  var matrix = [
    [0, 0, 0, 1, 0],
    [1, 0, 0, 0, 1],
    [0, 0, 1, 0, 0],
  ];
  var grid = new PF.Grid(5, 3, matrix);

  game.add.sprite(50, 10, 'star');
}

function update() {}