import { Entity } from 'Entity';
var Phaser = window.Phaser;

export class Unit extends Entity {
  constructor({ x, y, game, spriteKey, speed }) {
    super({ x, y, game, speed });

    // visual stuff
    this.sprite = this.game.add.sprite(x, y, spriteKey);
    this.sprite.anchor.set(0.5);

    game.physics.arcade.enable(this.sprite);

    this.pathQueue = [];

    this.selectedRect = new Phaser.Rectangle(this.sprite.x, this.sprite.y, 14, 14);
  }

  // elements should be an array
  addToPathQueue(elements) {
    this.pathQueue.push(...elements);
  }

  // array = [] versus length = 0?
  //
  clearQueue() {
    this.pathQueue.length = 0;
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

        // the path returned by easy star contains our position
        path.shift();

        // convert the tileCoordinate path to worldCoordinate path
        path = path.map( (element) => {
          return map.tileCoordsToWorldCoords(element);
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
      this.moveTo(this.sprite);

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