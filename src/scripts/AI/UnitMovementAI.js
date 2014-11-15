import Unit from 'Units/Unit';

export default class UnitMovementAI {

  constructor({ unit }) {
    this.unit = unit;
    this.game = unit.game;

    this.pathQueue = [];
    this.target = {};
  }

  moveTo(map, worldPos, appendToQueue = false) {
    let { x, y } = this.unit.sprite;
    let startPos = { x, y };
    // appendToQueue lets you add to the end for easy patrolling
    if(appendToQueue) {
      startPos = this.pathQueue[this.pathQueue.length - 1];
      if(startPos === undefined) {
        startPos = { x, y };
      }
    } else {
      // else, clear the queue before creating a new path
      this.clearQueue();
    }

   this.findPath(map, startPos, worldPos);
  }

  // elements should be an array
  addToPathQueue(elements) {
    this.pathQueue.push(...elements);
  }

  // array = [] versus length = 0?
  clearQueue() {
    // delete visualization
    this.pathQueue.forEach( (element) => {
      element.shape.destroy();
    });
    // actually clear the queue
    while(this.pathQueue.length > 0) {
      this.pathQueue.shift();
    }
  }

  // get the next point on the path
  getNextPoint() {
    return this.pathQueue.shift();
  }

  // move to the next point in the path
  iterateOverPath() {
    var point = this.getNextPoint();
    if(point === undefined) {
      return false;
    }
    this.target = point;
    point.shape.destroy();
  }

  //find a path, and add it to the path queue
  findPath(map, startPos, worldPos) {
    map.findPath(startPos, worldPos, (path) => {
      // if no path was found, return
      if(path === null) {
        return;
      }

      // the first element in path returned contains our position
      path.shift();

      // convert the tileCoordinate path to worldCoordinate path
      path = path.map( (element) => {
        return map.tileCoordsToWorldCoords(element);
      });

      // visualization of the path
      path.forEach( (element) => {
        element.shape = this.game.add.graphics(element.x, element.y);  //init rect
        element.shape.lineStyle(2, 0x00FF00, 0.5); // width, color, alpha (0 -> 1) // required settings
        element.shape.beginFill(0x00FF00, 0.2); // color, alpha (0 -> 1) // required settings
        element.shape.drawRect(-5, -5, 10, 10); // (x, y, w, h)
      });

      // add it to the path queue
      this.addToPathQueue(path);
    });
  }

  postUpdate () {
    //while the sprite is not at the world position, keep moving
    if(this.game.physics.arcade.distanceToXY(this.unit.sprite, this.target.x, this.target.y) > 10) {
      this.game.physics.arcade.moveToObject(this.unit.sprite, this.target, this.speed);
    } else {
      //else stop moving, and update the units position to the new tile
      this.unit.sprite.body.velocity.set(0);

      // if the unit has more points in the pathQueue, set the next move position
      // to the next point in the queue
      this.iterateOverPath();
    }
  }
}