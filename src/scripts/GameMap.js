var Phaser = window.Phaser;
var easystar = require('easystar');

export class GameMap {
  constructor({ game, mapName, dimensions, tileDimensions, walkableTiles, diagonals=true }) {
    this._map = game.add.tilemap(mapName);

    // set dimensions
    this.dimensions = dimensions;
    this.tileDimensions = tileDimensions;

    // set grid stuff
    this.pathfinder = game.plugins.add(Phaser.Plugin.PathFinderPlugin);
    console.log(this.pathfinder);
    this.pathfinder.setGrid(this._map.layer.data, walkableTiles);
  }

  render ({ tileset, tilesetImageKey, layer }) {
    // show it visually on screen
    this._map.addTilesetImage(tileset, tilesetImageKey, this.dimensions.width, this.dimensions.height);
    this.layer = this._map.createLayer(layer);
    this.layer.resizeWorld();
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

    this.pathfinder.setCallbackFunction(callback);
    this.pathfinder.preparePathCalculation([x1, y1], [x2, y2]);
    this.pathfinder.calculatePath();
  }
}