var Phaser = window.Phaser;

export class SelectionHandler {
  constructor({game, entityManager, map}) {
    this.game = game;
    this.entityManager = entityManager;
    this.map = map;

    this.selectionRect = new Phaser.Rectangle(0, 0, 0, 0);
    this.selectedEntities = [];
    this.dragging = false;
    this.dragStartPos = { x: 0, y: 0 };
  }

  handle() {
    // on move, update the selection rectangle
    this.game.input.addMoveCallback((pointer) => {
      if(!this.dragging) {
        return;
      }

      let { x: sx, y: sy } = this.dragStartPos;

      let { worldX: mx, worldY: my } = pointer;

      // set the width accordingly
      this.selectionRect.width = Math.abs(mx - this.selectionRect.x);
      this.selectionRect.height = Math.abs(my - this.selectionRect.y);

      // if we moved left of the original start position, we need to move the
      // rect left to ensure that width > 0
      if(mx < sx) {
        this.selectionRect.width = sx - mx;
        this.selectionRect.x = mx;
      }
      if(my < sy) {
        this.selectionRect.height = sy - my;
        this.selectionRect.y = my;
      }

      // set each entity inside the rectangle's selected property to true
      let entities = this.entityManager.filterEntities( (entity) => {
        //prevent the camera from being detected
        return entity.sprite.visible && Phaser.Rectangle.containsPoint(this.selectionRect, entity.sprite);
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
        let { worldX: x, worldY: y } = pointer;
        this.selectionRect.x = x;
        this.selectionRect.y = y;

        this.dragStartPos = { x, y };

      } else if(this.game.input.mouse.button === Phaser.Mouse.RIGHT_BUTTON) {
        // right click, move units to the point

        let { worldX: x, worldY: y } = pointer;
        let worldPos = { x, y };

        this.selectedEntities.forEach( (entity) => {
          entity.clearQueue();
          entity.findPath(this.map, worldPos);
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