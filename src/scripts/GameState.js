export class GameState {
  constructor(game) {
    this.map = game.add.tilemap('map');

    var { width, height } = this.map.layer;
    this.mapDimensions = { width, height };

    var { tileWidth, tileHeight } = this.map;
    this.tileDimensions = { width: tileWidth, height: tileHeight };

    var easystar = require('easystar');
    var _grid = new easystar.js();
    _grid.setGrid(this.createGridFromMap());
    _grid.setAcceptableTiles([5,6,8]);
    _grid.enableDiagonals();

    this.grid = _grid;

    this.setScreenDimensions(game);
  }

  setScreenDimensions({ width, height }) {
    this.screenWidth = width;
    this.screenHeight = height;
  }

  // create the easystarjs grid from the tilemap
  createGridFromMap() {
    var rtn = [];
    for(let row = 0; row < this.mapDimensions.height; row++) {
      rtn.push(new Array(this.mapDimensions.width));
      for(let col = 0; col < this.mapDimensions.width; col++) {
        rtn[row][col] = this.map.getTile(col, row).index;
      }
    }
    return rtn;
  }

  getTileDimensions() {
    return this.tileDimensions;
  }

  tileCoordsToWorldCoords({ x, y }) {
    var { width, height } = this.tileDimensions;
    return {
      x: (x + 1) * (width)  - (width / 2),
      y: (y + 1) * (height) - (height / 2)
    };
  }

  worldCoordsToTileCoords({ x, y }) {
    var {width, height} = this.tileDimensions;
    return {
      x: Math.floor(x / width),
      y: Math.floor(y / height)
    };
  }
}