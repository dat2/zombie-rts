var easystar = require('easystar');

export class GameMap {
  constructor({ game, mapName, dimensions, tileDimensions, walkableTiles, diagonals=true }) {
    this._map = game.add.tilemap(mapName);

    // set dimensions
    this.dimensions = dimensions;
    this.tileDimensions = tileDimensions;

    // set grid stuff
    var _grid = new easystar.js();
    _grid.setGrid(this.createGridFromMap());
    _grid.setAcceptableTiles(walkableTiles);
    if(diagonals) {
      _grid.enableDiagonals();
    }

    this.grid = _grid;
  }

  render ({ tileset, tilesetImageKey, layer }) {
    // show it visually on screen
    this._map.addTilesetImage(tileset, tilesetImageKey, this.dimensions.width, this.dimensions.height);
    this.layer = this._map.createLayer(layer);
    this.layer.resizeWorld();
  }

  // create the easystarjs grid from the tilemap
  createGridFromMap() {
    var rtn = [];
    for(let row = 0; row < this.dimensions.height; row++) {
      rtn.push(new Array(this.dimensions.width));
      for(let col = 0; col < this.dimensions.width; col++) {
        rtn[row][col] = this._map.getTile(col, row).index;
      }
    }
    return rtn;
  }

  // convert coordinates on the grid to world (pixel) coordinates
  tileCoordsToWorldCoords({ x, y }) {
    var { width, height } = this.tileDimensions;
    return {
      x: (x + 1) * (width)  - (width / 2),
      y: (y + 1) * (height) - (height / 2)
    };
  }

  // convert world coordinates (pixel) to the grid coordinates
  worldCoordsToTileCoords({ x, y }) {
    var { width, height } = this.tileDimensions;
    return {
      x: Math.floor(x / width),
      y: Math.floor(y / height)
    };
  }

  //find a path from the first position to the second one
  findPath(pos1, pos2, callback) {
    var tilePos1 = this.worldCoordsToTileCoords(pos1);
    var tilePos2 = this.worldCoordsToTileCoords(pos2);
    this.grid.findPath(tilePos1.x, tilePos1.y, tilePos2.x, tilePos2.y, callback);
    this.grid.calculate();
  }
}