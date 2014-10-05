import { Entity } from 'Entity';

export class Unit extends Entity {
  constructor({x, y, game, spriteKey, state}) {
    super({x, y, game, state});

    // visual stuff
    this.sprite = this.game.add.sprite(x, y, spriteKey);
    this.sprite.anchor.set(0.5);

    this.pathQueue = [];
  }

  addToPathQueue(elements) {
    this.pathQueue.push(...elements);
  }

  getNextPoint() {
    return this.pathQueue.shift();
  }

  iterateOverPath() {
    var point = this.getNextPoint();
    if(point === undefined) {
      return false;
    }
    this.moveTo(this.state.tileCoordsToWorldCoords(point));
    return true;
  }

  //find a path, and add it to the path queue
  findPath(grid, {x, y}) {
    var tilePos = this.state.worldCoordsToTileCoords(this.position);
    if(this.pathQueue.length === 0) {
      grid.findPath(tilePos.x, tilePos.y, x, y, path => {
        if(path === null) {
          return;
        }
        path.shift();
        this.addToPathQueue(path);
      });
      grid.calculate();
    }
  }
}