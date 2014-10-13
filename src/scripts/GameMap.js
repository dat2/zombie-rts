var Phaser = window.Phaser;
var PF = require('PathFinding.js');

export class GameMap {
  constructor({ game, mapName, dimensions, tileDimensions, walkableTiles, diagonals=true }) {
    this._map = game.add.tilemap(mapName);

    // set dimensions
    this.dimensions = dimensions;
    this.tileDimensions = tileDimensions;

    // set grid stuff
    this.grid = new PF.Grid(this.dimensions.width, this.dimensions.height,
        this.createGrid(walkableTiles));
    this.finder = new PF.AStarFinder({
      allowDiagonal: true,
      dontCrossCorners: true
    });
  }

  render ({ tileset, tilesetImageKey, layer }) {
    // show it visually on screen
    this._map.addTilesetImage(tileset, tilesetImageKey, this.dimensions.width,
        this.dimensions.height);
    this.layer = this._map.createLayer(layer);
    this.layer.resizeWorld();
  }

  // create the easystarjs grid from the tilemap
  createGrid(walkableTiles) {
    var rtn = [];
    for(let row = 0; row < this.dimensions.height; row++) {
      rtn.push(new Array(this.dimensions.width));
      for(let col = 0; col < this.dimensions.width; col++) {
        rtn[row][col] = walkableTiles.indexOf(this._map.getTile(col, row).index) === -1 ? 1 : 0;
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
    var { x: x1, y: y1 } = this.worldCoordsToTileCoords(pos1);
    var { x: x2, y: y2 } = this.worldCoordsToTileCoords(pos2);

    var grid = this.grid.clone();
    var path = this.finder.findPath(x1, y1, x2, y2, grid);
    callback(path.map( element => { return { x: element[0], y: element[1]} }));
  }
}