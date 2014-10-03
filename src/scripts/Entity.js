export class Entity {

  // x, y are tile coordinates, not pixel coordinates
  constructor({x, y}) {
    this.position = {x, y};

    // other attributes
    // constant acceleration
    this.speed = 300;
  }

  moveTo({x, y}) {
    this.position = {x, y};
  }
}