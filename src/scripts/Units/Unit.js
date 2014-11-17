import Entity from 'Entities/Entity';
import { UnitMovementAI } from 'AI/UnitAI';
var Phaser = window.Phaser;

const BODY_DRAG = 175;
const SELECTED_RECT_SIZE = 14;

export default class Unit extends Entity {
  constructor({ x, y, game, spriteKey, speed, maxHealth }) {
    super({ x, y, game, speed , spriteKey, maxHealth});

    this.game = game;
    this.MoveAI = new UnitMovementAI({ unit: this });

    // graphics for selected units
    this.selectedRect = new Phaser.Rectangle(this.sprite.x, this.sprite.y, SELECTED_RECT_SIZE, SELECTED_RECT_SIZE);
    this.selectedGraphics = this.game.add.graphics(0, 0); // initialize here so we can destroy later

    this.sprite.body.drag.x = BODY_DRAG;
    this.sprite.body.drag.y = BODY_DRAG;

    this.rect = new Phaser.Rectangle(x - this.sprite.width / 2,
      y - this.sprite.height / 2, this.sprite.width, this.sprite.height);
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

  update() {
    super();
    this.MoveAI.update();
  }

  postUpdate() {
    super();
    // update rect for selection
    let { x, y } = this.sprite;
    this.rect = new Phaser.Rectangle(x - this.sprite.width / 2,
      y - this.sprite.height / 2, this.sprite.width, this.sprite.height);
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