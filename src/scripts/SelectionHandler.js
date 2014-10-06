var Phaser = window.Phaser;

export class SelectionHandler {
  constructor({game, entityManager, map}) {
    this.game = game;
    this.entityManager = entityManager;
    this.map = map;

    this.selectionRect = new Phaser.Rectangle(0, 0, 0, 0);
    this.selectedEntities = [];
    this.dragging = false;
  }

  handle() {
    // on move, update the selection rectangle
    this.game.input.addMoveCallback((pointer, x, y) => {
      if(!this.dragging) {
        return;
      }

      // set the width accordingly
      this.selectionRect.width = x - this.selectionRect.x;
      this.selectionRect.height = y - this.selectionRect.y;

      // set each entity inside the rectangle's selected property to true
      let entities = this.entityManager.filterEntities( (entity) => {
        return Phaser.Rectangle.containsPoint(this.selectionRect, entity.sprite);
      });
      entities.forEach( (entity) => {
        entity.selected = true;
      });
    });


    // start dragging on click
    this.game.input.onDown.add( (pointer, mouse) => {
      // left click, start dragging selection box
      if(this.game.input.mouse.button === Phaser.Mouse.LEFT_BUTTON) {

        // remove selected
        this.selectedEntities.forEach( (entity) => {
          entity.selected = false;
        });

        // start dragging
        this.dragging = true;
        let { x, y } = pointer;
        this.selectionRect.x = x;
        this.selectionRect.y = y;

      } else if(this.game.input.mouse.button === Phaser.Mouse.RIGHT_BUTTON) {
        // right click, move units to the point

        this.selectedEntities.forEach( (entity) => {
          entity.clearQueue();
          entity.findPath(this.map, pointer);
        });
      }
    });


    // stop dragging, and set width and height to 0
    this.game.input.onUp.add( () => {
      if(this.dragging) {
        this.dragging = false;
        this.selectionRect.width = 0;
        this.selectionRect.height = 0;

        this.selectedEntities = this.entityManager.filterEntities( (entity) => entity.selected );
      }
    });
  }
}