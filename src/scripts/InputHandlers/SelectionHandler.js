import Unit from 'Units/Unit';
import Squad from 'Units/Squad';
var Phaser = window.Phaser;

export default class SelectionHandler {
  constructor({game, entityManager, map}) {
    this.game = game;
    this.entityManager = entityManager;
    this.map = map;

    this.selectionRect = new Phaser.Rectangle(0, 0, 0, 0);
    this.selectionRectGraphics = this.game.add.graphics(0, 0);

    this.selectedUnits = [];
    this.dragging = false;
    this.dragStartPos = { x: 0, y: 0 };

    this.shiftKey = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
  }

  drawSelectionRect() {
    this.selectionRectGraphics.destroy();

    this.selectionRectGraphics = this.game.add.graphics(this.selectionRect.x, this.selectionRect.y);
    this.selectionRectGraphics.lineStyle(2, 0x00FF00, 1); // width, color, alpha (0 -> 1) // required settings
    this.selectionRectGraphics.beginFill(0x00FF00, 0.5); // color, alpha (0 -> 1) // required settings
    this.selectionRectGraphics.drawRect(0, 0, this.selectionRect.width, this.selectionRect.height);
  }

  handle() {
    this.registerMovementCallback();
    this.registerMouseDownCallback();
    this.registerMouseUpCallback();
  }

  registerMovementCallback() {
    // on move, update the selection rectangle
    this.game.input.addMoveCallback((pointer) => {
      if(!this.dragging) {
        return;
      }

      let { x: sx, y: sy } = this.dragStartPos;
      let { worldX: mx, worldY: my } = pointer;

      this.setSelectionRectDimensions({ mx, my }, { sx, sy });

      this.selectEntitiesInSelectionRect();
      this.deselectEntitiesOutsideSelectionRect();

      this.drawSelectionRect();
    });
  }

  setSelectionRectDimensions({ mx, my }, { sx, sy }) {
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
  }

  selectEntitiesInSelectionRect() {
    // set each unit inside the rectangle's selected property to true
    let units = this.entityManager.filterEntities( (entity) => {
      //prevent the camera from being detected
      return entity.sprite.visible &&
        Phaser.Rectangle.intersects(this.selectionRect, entity.rect);
    });
    units.forEach( (entity) => {
      entity.select();
    });
  }

  deselectEntitiesOutsideSelectionRect() {
    //deselect entities that do not intersect the rectangle
    let units = this.entityManager.filterEntities( (entity) => {
      return entity instanceof Unit &&
        !Phaser.Rectangle.intersects(this.selectionRect, entity.rect);
    });
    units.forEach( (entity) => {
      entity.deselect();
    });
  }

  registerMouseDownCallback() {
    // start dragging on click
    this.game.input.onDown.add( (pointer, mouse) => {
      // left click, start dragging selection box
      if(this.game.input.mouse.button === Phaser.Mouse.LEFT_BUTTON) {
        this.handleLeftMouseButtonDown(pointer, mouse);
      } else if(this.game.input.mouse.button === Phaser.Mouse.RIGHT_BUTTON) {
        this.handleRightMouseButtonDown(pointer, mouse);
      }
    });
  }

  handleLeftMouseButtonDown(pointer, mouse) {
    // remove selected
    this.selectedUnits.forEach( (entity) => {
      entity.deselect();
    });

    // start dragging
    this.dragging = true;
    let { worldX: x, worldY: y } = pointer;
    this.selectionRect.x = x;
    this.selectionRect.y = y;

    this.dragStartPos = { x, y };
  }

  handleRightMouseButtonDown(pointer, mouse) {
    // right click, move units to the point
    let { worldX: x, worldY: y } = pointer;
    let worldPos = { x, y };

    // TODO move this later
    let squad = new Squad(this.selectedUnits.length, this.selectedUnits);
    squad.MoveAI.moveTo(this.map, worldPos, this.shiftKey.isDown);
  }

  registerMouseUpCallback() {
    // stop dragging, and set width and height to 0
    this.game.input.onUp.add( () => {
      if(this.dragging) {
        this.dragging = false;
        this.selectionRect.width = 0;
        this.selectionRect.height = 0;

        this.selectedUnits =
          this.entityManager.filterEntities( (entity) => entity.selected );
      }
      this.selectionRectGraphics.destroy();
    });
  }
}