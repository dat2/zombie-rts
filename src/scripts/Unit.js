import { Entity } from 'Entity';
var Phaser = window.Phaser;

export class Unit extends Entity {
  constructor({ x, y, game, spriteKey, speed }) {
    super({ x, y, game, speed , spriteKey});

    this.pathQueue = [];

    this.selectedRect = new Phaser.Rectangle(this.sprite.x, this.sprite.y, 14, 14);
  }

  // elements should be an array
  addToPathQueue(elements) {
    this.pathQueue.push(...elements);
  }

  // array = [] versus length = 0?
  clearQueue() {
    this.pathQueue.length = 0;
    // delete visualization
    this.pathQueue.forEach( (element) => {
      element.shape.destroy();
    });
  }

  getNextPoint() {
    return this.pathQueue.shift();
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
  findPath(map, worldPos) {
    // this if statement needs to change
    if(this.pathQueue.length === 0) {
      map.findPath(this.position, worldPos, (path) => {
        // if no path was found, return
        if(path === null) {
          return;
        }

        // the first element in path returned by easy star contains our position
        path.shift();

        // convert the tileCoordinate path to worldCoordinate path
        path = path.map( (element) => {
          return map.tileCoordsToWorldCoords(element);
        });

        // visualization of the path
        path.forEach( (element) => {
          element.shape = this.game.add.graphics(element.x, element.y);  //init rect
          element.shape.lineStyle(2, 0x0000FF, 1); // width, color (0x0000FF), alpha (0 -> 1) // required settings
          element.shape.beginFill(0xFFFF0B, 1); // color (0xFFFF0B), alpha (0 -> 1) // required settings
          element.shape.drawRect(0, 0, 10, 10); // (x, y, w, h)
        });

        // add it to the path queue
        this.addToPathQueue(path);
      });
    }
  }

  update () {
    //while the sprite is not at the world position, keep moving
    if(this.game.physics.arcade.distanceToXY(this.sprite, this.position.x, this.position.y) > 6) {
      this.game.physics.arcade.moveToObject(this.sprite, this.position, this.speed);
    } else {
      //else stop moving, and update the units position to the new tile
      this.sprite.body.velocity.set(0);

      // if the unit has more points in the pathQueue, set the next move position
      // to the next point in the queue
      if(this.pathQueue.length > 0) {
        this.iterateOverPath();
      }
    }
  }

  render() {
    this.selectedRect.centerX = this.sprite.x;
    this.selectedRect.centerY = this.sprite.y;
    if(this.selected) {
      this.game.debug.geom(this.selectedRect, '#0fffff');
      this.game.world.bringToTop(this.sprite);
    }
  }
}