export class Entity {

  // x, y are tile coordinates, not pixel coordinates
  constructor({ x, y, game , speed}) {
    this.position = {x, y};
    this.game = game;

    // other attributes
    // constant acceleration
    this.speed = speed;
  }

  moveTo({ x, y }) {
    this.position = { x, y };
  }
}