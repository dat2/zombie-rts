const STATE_MOVING = 1;
const STATE_IDLE = 2;
const STATE_COLLIDING = 3;

const MAX_COLLISIONS = 50;
const RANGE = 10;
const DIST_TO_TARGET = 10;

// Returns a random number between min (inclusive) and max (exclusive)
// taken from MDN
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

export default class MovementAI {

  constructor({ entity, renderPath }) {
    this.entity = entity;
    this.game = entity.game;

    this.state = STATE_IDLE;
    this.renderPath = renderPath;

    this.pathQueue = [];
    this.target = {};
    this.collisionCounter = 0;
  }

  findPathTo(map, worldPos, appendToQueue = false) {
    this.state = STATE_MOVING;

    // calculate the start position
    let { x, y } = this.entity.sprite;
    let startPos = { x, y };

    // appendToQueue lets you add to the end of the queue if you want to patrol
    if(appendToQueue && this.pathQueue.length > 0) {
      startPos = this.pathQueue[this.pathQueue.length - 1];
    } else {
      // else, clear the queue before creating a new path
      this.clearQueue();
    }

    this.findPath(map, startPos, worldPos);
    this.state = STATE_MOVING;
  }

  clearQueue() {
    while(this.pathQueue.length > 0) {
      let element = this.pathQueue.shift();
      if(element.shape !== undefined) {
        element.shape.destroy();
      }
    }
  }

  findPath(map, startPos, worldPos) {
    map.findPath(startPos, worldPos, (path) => {
      // if no path was found, return
      if(path === null) {
        return;
      }

      // the first element in path returned contains our position
      path.shift();

      // convert the tileCoordinate path to worldCoordinate path
      path = this.convertPathToWoorldCoords(path, map);

      if(this.renderPath) {
        this.visualizePath(path);
      }

      this.addToPathQueue(path);
    });
  }

  convertPathToWoorldCoords(path, map) {
    return path.map( (element) => {
      return map.tileCoordsToWorldCoords(element);
    });
  }

  visualizePath(path) {
    path.forEach( (element) => {
      element.shape = this.game.add.graphics(element.x, element.y);  //init rect
      element.shape.lineStyle(2, 0x00FF00, 0.5); // width, color, alpha (0 -> 1) // required settings
      element.shape.beginFill(0x00FF00, 0.2); // color, alpha (0 -> 1) // required settings
      element.shape.drawRect(-5, -5, 10, 10); // (x, y, w, h)
    });
  }

  // elements should be an array
  addToPathQueue(elements) {
    this.pathQueue.push(...elements);
  }

  iterateOverPath() {
    var point = this.pathQueue.shift();
    if(point === undefined) {
      this.state = STATE_IDLE;
      return;
    } else {
      this.state = STATE_MOVING;
    }
    this.target = point;
  }

  update () {
    //while the sprite is not at the world position, keep moving
    if(this.state == STATE_MOVING || this.state == STATE_COLLIDING) {
      this.checkCollision();

      // move the actual entity
      if(this.isNotCloseToTarget()) {
        this.moveToTarget();
      } else {
        //else stop moving
        this.state = STATE_IDLE;

        if(this.target.shape !== undefined) {
          this.target.shape.destroy();
        }
        this.iterateOverPath();
      }
    }
  }

  checkCollision() {
    // if the entity is colliding
    let touching = this.entity.sprite.body.touching;

    let blocked = this.entity.sprite.body.blocked;
    let colliding =
      touching.up || touching.down || touching.left || touching.right ||
      blocked.up || blocked.down || blocked.left || blocked.right;
    if(colliding) {
      this.collisionCounter++;
    }

    if(this.collisionCounter > MAX_COLLISIONS) {
      this.state = STATE_COLLIDING;

      //randomly move in a direction
      //generally gets it right
      this.target.x += getRandomArbitrary(-RANGE, RANGE);
      this.target.y += getRandomArbitrary(-RANGE, RANGE);
      this.collisionCounter = 0;
    }
  }

  isNotCloseToTarget() {
    return this.game.physics.arcade.distanceToXY(this.entity.sprite, this.target.x, this.target.y) > DIST_TO_TARGET;
  }

  moveToTarget() {
    this.state = STATE_MOVING;
    this.game.physics.arcade.moveToObject(this.entity.sprite, this.target, this.entity.speed);
    this.entity.position.x = this.entity.sprite.x;
    this.entity.position.y = this.entity.sprite.y;
  }
}