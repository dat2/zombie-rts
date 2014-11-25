// WebKit context
import Unit from 'Units/Unit';
import Squad from 'Units/Squad';
import { ifExpression } from 'util';

// node.js context
var _ = require('lodash');

var selectUnits = (unit) => unit.selected = true;
var isSelected = (unit) => unit.selected;

var deselectUnits = (unit) => unit.selected = false;

var unitInRect = _.curry((rect, unit) => Phaser.Rectangle.intersects(rect, unit.rect));

var isLeftButton = (pointer) => pointer.button === Phaser.Mouse.LEFT_BUTTON;
var isRightButton = (pointer) => pointer.button === Phaser.Mouse.RIGHT_BUTTON;

var worldXYtoXY = ({ worldX, worldY }) => { return { x: worldX, y: worldY }; };

export default class SelectionHandler {
  constructor({entityManager, map}) {
    this.entityManager = entityManager;
    this.map = map;

    // instance variables
    this.dragging = false;
    this.dragStartPos = { x: 0, y: 0 };

    this.selectedUnits = [];

    // keys
    this.shiftKey = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);

    // visuals
    this.selectionRect = new Phaser.Rectangle(0, 0, 0, 0);
    this.selectionRectGraphics = game.add.graphics(0, 0);
  }

  handle() {
    this.registerMovementCallback();
    this.registerMouseDownCallback();
    this.registerMouseUpCallback();
  }

  registerMovementCallback() {
    // on move, update the selection rectangle
    game.input.addMoveCallback((pointer) => {
      if(!this.dragging) {
        return;
      }
      this.setSelectionRectDimensions(worldXYtoXY(pointer), this.dragStartPos);
      this.selectEntitiesInSelectionRect();
      this.deselectEntitiesOutsideSelectionRect();
      this.drawSelectionRect();
    });
  }

  setSelectionRectDimensions(mouse, start) {
    // set the width accordingly
    let xs = [ mouse.x, start.x ];
    let ys = [ mouse.y, start.y ];

    let minX = _.min(xs);
    let minY = _.min(ys);
    [ this.selectionRect.x,
      this.selectionRect.y ] = [ minX, minY ];

    let maxX = _.max(xs);
    let maxY = _.max(ys);

    [ this.selectionRect.width,
      this.selectionRect.height ] = [ maxX - minX, maxY - minY ];
  }

  selectEntitiesInSelectionRect() {
    // set each unit inside the rectangle's selected property to true
    _.filter(this.entityManager.units, unitInRect(this.selectionRect) )
      .forEach( selectUnits );
  }

  deselectEntitiesOutsideSelectionRect() {
    //deselect entities that do not intersect the rectangle
    _.reject(this.entityManager.units, unitInRect(this.selectionRect))
      .forEach( deselectUnits );
  }

  drawSelectionRect() {
    // always destroy before we start to replace it, otherwise phaser doesn't destroy
    // it
    this.selectionRectGraphics.destroy();

    this.selectionRectGraphics = game.add.graphics(this.selectionRect.x, this.selectionRect.y);
    this.selectionRectGraphics.lineStyle(2, 0x00FF00, 1); // width, color, alpha [0,1] required settings
    this.selectionRectGraphics.beginFill(0x00FF00, 0.5); // color, alpha [0,1] required settings
    this.selectionRectGraphics.drawRect(0, 0, this.selectionRect.width, this.selectionRect.height);
  }

  registerMouseDownCallback() {
    game.input.onDown.add(
      ifExpression(this,
        isLeftButton,
        this.handleLeftMouseButtonDown,
        ifExpression(this,
          isRightButton,
          this.handleRightMouseButtonDown
        )
    ));
  }

  handleLeftMouseButtonDown(pointer, mouse) {
    // remove selected
    this.selectedUnits.forEach(deselectUnits);

    // start dragging
    this.dragging = true;

    let pnt = worldXYtoXY(pointer);
    let { x, y } = pnt;
    [ this.selectionRect.x, this.selectionRect.y ] = [ x, y ];

    this.dragStartPos = pnt;
  }

  handleRightMouseButtonDown(pointer, mouse) {
    // right click, move units to the point
    let worldPos = worldXYtoXY(pointer);

    // TODO move this later
    let squad = new Squad(this.selectedUnits.length, this.selectedUnits);
    squad.MoveAI.findPathsTo(this.map, worldPos, this.shiftKey.isDown);
  }

  registerMouseUpCallback() {
    // stop dragging, and set width and height to 0
    game.input.onUp.add( () => {
      if(this.dragging) {
        this.dragging = false;
        this.selectionRect.width = 0;
        this.selectionRect.height = 0;

        this.selectedUnits = _.filter(this.entityManager.units, isSelected );
      }
      this.selectionRectGraphics.destroy();
    });
  }
}