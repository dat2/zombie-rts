import { Entity } from 'Entity';

export class Unit extends Entity {
  constructor({x, y}) {
    super({x, y});
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
    this.moveTo(point);
    return true;
  }

  //find a path, and add it to the path queue
  findPath(grid, {x, y}) {
    if(this.pathQueue.length === 0) {
      grid.findPath(this.position.x, this.position.y, x, y, path => {
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