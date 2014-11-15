import Entity from 'Entities/Entity';
import UnitMovementAI from 'AI/UnitMovementAI';
var Phaser = window.Phaser;

export default class Unit extends Entity {
  constructor({ x, y, game, spriteKey, speed }) {
    super({ x, y, game, speed , spriteKey});

    this.game = game;
    this.AI = new UnitMovementAI({ unit: this });

    // graphics for selected units
    this.selectedRect = new Phaser.Rectangle(this.sprite.x, this.sprite.y, 14, 14);
    this.selectedGraphics = this.game.add.graphics(0, 0); // initialize here so we can destroy later
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

  postUpdate() {
    this.AI.postUpdate();
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