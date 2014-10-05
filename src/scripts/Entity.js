export class Entity {

  // x, y are tile coordinates, not pixel coordinates
  constructor({x, y, game, state}) {
    this.position = {x, y};
    this.game = game;
    this.state = state;

    // other attributes
    // constant acceleration
    this.speed = 300;
  }

  moveTo({x, y}) {
    this.position = {x, y};
  }

  updateWorldPosition() {

  }
}