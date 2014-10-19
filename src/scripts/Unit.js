import { Entity } from 'Entity';
var Phaser = window.Phaser;

export class Unit extends Entity {
  constructor({ x, y, game, spriteKey, speed }) {
    super({ x, y, game, speed , spriteKey});

    this.pathQueue = [];

    // graphics for selected units
    this.selectedRect = new Phaser.Rectangle(this.sprite.x, this.sprite.y, 14, 14);
    this.selectedGraphics = this.game.add.graphics(0, 0); // initialize here so we can destroy later
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

  // select and render the selected rectangle
  select() {
    this.selected = true;
    this.renderSelected();
  }

  // deselect the unit, and destroy the selected rectangle
  deselect() {
    this.selected = false;
    this.selectedGraphics.destroy();
  }

  // move to the next point in the path
  iterateOverPath() {
    var point = this.getNextPoint();
    if(point === undefined) {
      return false;
    }
    this.moveTo(point);
    point.shape.destroy();
  }

  //find a path, and add it to the path queue
  findPath(map, worldPos, appendToQueue=false) {
    let { x, y } = this.sprite;
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
    super();
    //while the sprite is not at the world position, keep moving
    if(this.game.physics.arcade.distanceToXY(this.sprite, this.target.x, this.target.y) > 10) {
      this.game.physics.arcade.moveToObject(this.sprite, this.target, this.speed);
    } else {
      //else stop moving, and update the units position to the new tile
      this.sprite.body.velocity.set(0);

      // if the unit has more points in the pathQueue, set the next move position
      // to the next point in the queue
      this.iterateOverPath();
    }
  }

  // render a rectangle around the unit if they are selected
  renderSelected() {
    if(this.selected) {
      this.selectedGraphics.destroy();

      this.selectedGraphics = this.game.add.graphics(this.selectedRect.x, this.selectedRect.y);
      this.selectedGraphics.lineStyle(2, 0x0000FF, 1); // width, color (0x0000FF), alpha (0 -> 1) // required settings
      // this.selectedGraphics.beginFill(0x0000FF, 0.2); // color (0xFFFF0B), alpha (0 -> 1) // required settings
      this.selectedGraphics.drawRect(0, 0, this.selectedRect.width, this.selectedRect.height); // (x, y, w, h)
    }
  }

  render() {
    // move the selected rect
    this.selectedRect.centerX = this.sprite.x;
    this.selectedRect.centerY = this.sprite.y;

    this.renderSelected();
  }
}