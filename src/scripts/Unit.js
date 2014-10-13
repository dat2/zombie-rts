import { Entity } from 'Entity';
var Phaser = window.Phaser;

export class Unit extends Entity {
  constructor({ x, y, game, spriteKey, speed }) {
    super({ x, y, game, speed , spriteKey});

    this.pathQueue = [];

    this.selectedRect = new Phaser.Rectangle(this.sprite.x, this.sprite.y, 14, 14);
    this.selectedGraphics = this.game.add.graphics(0, 0);  //init rect
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

  getNextPoint() {
    return this.pathQueue.shift();
  }

  select() {
    this.selected = true;
    this.renderSelected();
  }

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
  findPath(map, worldPos, endOfQueue=false) {
    let pos = this.position;
    if(endOfQueue) {
      pos = this.pathQueue[this.pathQueue.length - 1];
      if(pos === undefined) {
        pos = this.position;
      }
    } else {
      this.clearQueue();
    }

    map.findPath(pos, worldPos, (path) => {
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

  update () {
    //while the sprite is not at the world position, keep moving
    if(this.game.physics.arcade.distanceToXY(this.sprite, this.position.x, this.position.y) > 6) {
      this.game.physics.arcade.moveToObject(this.sprite, this.position, this.speed);
    } else {
      //else stop moving, and update the units position to the new tile
      this.sprite.body.velocity.set(0);

      // if the unit has more points in the pathQueue, set the next move position
      // to the next point in the queue
      this.iterateOverPath();
    }
  }

  renderSelected() {
    if(this.selected) {
      this.selectedGraphics.destroy();

      this.selectedGraphics = this.game.add.graphics(this.selectedRect.x, this.selectedRect.y);
      this.selectedGraphics.lineStyle(2, 0x0000FF, 1); // width, color (0x0000FF), alpha (0 -> 1) // required settings
      this.selectedGraphics.beginFill(0x0000FF, 0.2); // color (0xFFFF0B), alpha (0 -> 1) // required settings
      this.selectedGraphics.drawRect(0, 0, this.selectedRect.width, this.selectedRect.height); // (x, y, w, h)
    }
  }

  render() {
    this.selectedRect.centerX = this.sprite.x;
    this.selectedRect.centerY = this.sprite.y;

    this.renderSelected();
    this.game.world.bringToTop(this.sprite);
  }
}