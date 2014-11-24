import StateMachine from 'AI/StateMachine';

const STATE_MOVING = 1;
const STATE_IDLE = 2;
const STATE_COLLIDING = 3;

class MovementAIStateMachine extends StateMachine {
  constructor() {
    super(STATE_IDLE, [STATE_MOVING, STATE_IDLE, STATE_COLLIDING]);

    // MOVING -> IDLE States
    this.addTransition(STATE_MOVING, STATE_IDLE, (ai) => ai.isCloseToTarget());
    this.addTransition(STATE_MOVING, STATE_IDLE, (ai) => ai.target === undefined);

    // IDLE -> MOVING states
    this.addTransition(STATE_IDLE, STATE_MOVING, (ai) => ai.target !== undefined);

    // MOVING -> COLLIDING states
    this.addTransition(STATE_MOVING, STATE_COLLIDING, (ai) => ai.isCollidingALot() );

    // COLLIDING -> MOVING states
    this.addTransition(STATE_COLLIDING, STATE_MOVING, (ai) => ai.isCollisionResolved() );
  }

  isMoving() {
    return this.currentState === STATE_MOVING || this.currentState === STATE_COLLIDING;
  }
}

const MAX_COLLISIONS = 50;
const RANGE = 10;
const MAX_DIST_TO_TARGET = 10;

// Returns a random number between min (inclusive) and max (exclusive)
// taken from MDN
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
var getRandomArbitrary = (min, max) => Math.random() * (max - min) + min;

export default class MovementAI {

  constructor({ entity, renderPath, renderColour }) {
    this.entity = entity;
    this.stateMachine = new MovementAIStateMachine();

    this.renderPath = renderPath;
    this.renderColour = renderColour;

    this.pathQueue = [];
    this.target = undefined;
    this.collisionCounter = 0;
  }

  calculateStartPos(appendToQueue = false) {
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

    return startPos;
  }

  clearQueue() {
    while(this.pathQueue.length > 0) {
      let element = this.pathQueue.shift();
      if(element.shape !== undefined) {
        element.shape.destroy();
      }
    }
  }

  findPath(map, worldPos, appendToQueue = false) {
    let startPos = this.calculateStartPos(appendToQueue);

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
      element.shape = game.add.graphics(element.x, element.y);  //init rect
      element.shape.lineStyle(2, this.renderColour, 0.5); // width, color, alpha (0 -> 1) // required settings
      element.shape.beginFill(this.renderColour, 0.2); // color, alpha (0 -> 1) // required settings
      element.shape.drawRect(-5, -5, 10, 10); // (x, y, w, h)
    });
  }

  // elements should be an array
  addToPathQueue(elements) {
    this.pathQueue.push(...elements);
  }

  iterateOverPath() {
    this.target = this.pathQueue.shift();
  }

  update () {
    this.stateMachine.transition(this);

    //while the sprite is not at the world position, keep moving
    if(this.stateMachine.isMoving()) {
      this.checkCollision();
      this.moveToTarget();
    } else {
      if(this.target !== undefined && this.target.shape !== undefined) {
        this.target.shape.destroy();
      }
      this.iterateOverPath();
    }

    this.updatePosition();
  }

  moveToTarget() {
    game.physics.arcade.moveToObject(this.entity.sprite, this.target, this.entity.speed);
  }

  updatePosition() {
    let { x, y } = this.entity.sprite;
    this.entity.position = { x, y };
  }

  updateCollisionCounter() {
    // if the entity is colliding
    let touching = this.entity.sprite.body.touching;

    let blocked = this.entity.sprite.body.blocked;
    let colliding =
      touching.up || touching.down || touching.left || touching.right ||
      blocked.up || blocked.down || blocked.left || blocked.right;
    if(colliding) {
      this.collisionCounter++;
    }
  }

  checkCollision() {
    this.updateCollisionCounter();

    if(this.isCollidingALot()) {
      //randomly move in a direction
      //generally gets it right
      this.target.x += getRandomArbitrary(-RANGE, RANGE);
      this.target.y += getRandomArbitrary(-RANGE, RANGE);
      this.collisionCounter = 0;
    }
  }

  isCollidingALot() {
    return this.collisionCounter > MAX_COLLISIONS;
  }

  isCollisionResolved() {
    return false;
  }

  isCloseToTarget() {
    return game.physics.arcade.distanceToXY(this.entity.sprite, this.target.x, this.target.y) <= MAX_DIST_TO_TARGET;
  }
}