export class GameState {
  constructor({width, height}) {
    this.tiles = {
      horizontal: 5,
      vertical: 5
    };

    this.tileArray = [
      [0,1,0,0,1],
      [0,0,0,0,1],
      [1,1,0,0,0],
      [1,1,0,1,1],
      [0,1,0,0,0]
    ];

    var easystar = require('easystar');
    var _grid = new easystar.js();
    _grid.setGrid(this.tileArray);
    _grid.setAcceptableTiles([0]);

    this.grid = _grid;

    this.screenWidth = width;
    this.screenHeight = height;
  }

  getPixelDimensionsPerTile() {
    return {
      width: this.screenWidth / this.tiles.horizontal,
      height: this.screenHeight / this.tiles.vertical
    };
  }
}