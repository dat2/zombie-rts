export class GameState {
  constructor(game) {
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

    this.setDimensions(game);
  }

  setDimensions({ width, height }) {
    this.screenWidth = width;
    this.screenHeight = height;

    var { width: tileWidth, height: tileHeight } = this.getPixelDimensionsPerTile();
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
  }

  getPixelDimensionsPerTile() {
    return {
      width: this.screenWidth / this.tiles.horizontal,
      height: this.screenHeight / this.tiles.vertical
    };
  }

  tileCoordsToPixelCoords({ x, y }) {
    return {
      x: (x + 1) * (this.tileWidth)  - (this.tileWidth / 2),
      y: (y + 1) * (this.tileHeight) - (this.tileHeight / 2)
    };
  }

  pixelCoordsToTileCoords({ x, y }) {
    return {
      x: Math.floor(x / this.tileWidth),
      y: Math.floor(y / this.tileHeight)
    };
  }
}