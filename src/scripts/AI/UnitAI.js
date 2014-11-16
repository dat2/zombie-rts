import Unit from 'Units/Unit';

const STATE_MOVING = 1;
const STATE_IDLE = 2;
const STATE_COLLIDING = 3;

const MAX_COLLISIONS = 50;
const RANGE = 10;

// Returns a random number between min (inclusive) and max (exclusive)
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

export class UnitMovementAI {

  constructor({ unit }) {
    this.unit = unit;
    this.game = unit.game;

    this.state = STATE_IDLE;

    this.pathQueue = [];
    this.target = {};
    this.collisionCounter = 0;
  }

  clearQueue() {
    while(this.pathQueue.length > 0) {
      let element = this.pathQueue.shift();
      element.shape.destroy();
    }
  }

  moveTo(map, worldPos, appendToQueue = false) {
    this.state = STATE_MOVING;

    // calculate the start position
    let { x, y } = this.unit.sprite;
    let startPos = { x, y };

    // appendToQueue lets you add to the end of the queue if you want to patrol
    if(appendToQueue && this.pathQueue.length > 0) {
      startPos = this.pathQueue[this.pathQueue.length - 1];
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

  iterateOverPath() {
    var point = this.pathQueue.shift();
    if(point === undefined) {
      this.state = STATE_IDLE;
      return;
    }
    this.state = STATE_MOVING;
    this.target = point;
  }

  update () {
    //while the sprite is not at the world position, keep moving
    if(this.state == STATE_MOVING || this.state == STATE_COLLIDING) {

      // if the unit is colliding
      let touching = this.unit.sprite.body.touching;

      let blocked = this.unit.sprite.body.blocked;
      let colliding =
        touching.up || touching.down || touching.left || touching.right ||
        blocked.up || blocked.down || blocked.left || blocked.right;
      if(colliding) {
        this.collisionCounter++;
      }

      if(this.collisionCounter > MAX_COLLISIONS) {
        this.state = STATE_COLLIDING;
        this.target.x += getRandomArbitrary(-RANGE, RANGE);
        this.target.y += getRandomArbitrary(-RANGE, RANGE);
        this.collisionCounter = 0;
      }

      if(this.game.physics.arcade.distanceToXY(this.unit.sprite, this.target.x, this.target.y) > 10) {
        this.game.physics.arcade.moveToObject(this.unit.sprite, this.target, this.speed);
      } else {
        //else stop moving
        this.state = STATE_IDLE;

        if(this.target.shape) {
          this.target.shape.destroy();
        }
        this.iterateOverPath();
      }
    } else {
    }
  }
}