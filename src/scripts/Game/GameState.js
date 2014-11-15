export default class GameState {
  constructor(game) {
    this.setScreenDimensions(game);
  }

  setScreenDimensions({ width, height }) {
    this.screenWidth = width;
    this.screenHeight = height;
  }
}