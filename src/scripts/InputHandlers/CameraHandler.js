var Phaser = window.Phaser;

export default class CameraHandler {
  constructor({game, entityManager, map, cursors, cameraProperties, edgePixels}) {
    this.game = game;
    this.entityManager = entityManager;
    this.map = map;

    // create a camera unit
    this.camera = this.entityManager.createCamera(cameraProperties);
    this.cursors = cursors;

    // the zone that triggers horizontal movement
    this.deadHorizontalRect = new Phaser.Rectangle(0, 0, game.width - (edgePixels * 2), game.height);
    this.deadHorizontalRect.centerX = this.game.camera.view.centerX;
    this.deadHorizontalRect.centerY = this.game.camera.view.centerY;

    // the zone that triggers vertical movement
    this.deadVerticalRect = new Phaser.Rectangle(0, 0, game.width, game.height - (edgePixels * 2));
    this.deadVerticalRect.centerX = this.game.camera.view.centerX;
    this.deadVerticalRect.centerY = this.game.camera.view.centerY;
  }

  moveHorizontal(speed) {
    this.camera.sprite.body.velocity.x = speed;
  }

  moveVertical(speed) {
    this.camera.sprite.body.velocity.y = speed;
  }

  handle() {
    // move horizontally
    this.cursors.left.onDown.add( () => {
      this.moveHorizontal(-300);
    });
    this.cursors.right.onDown.add( () => {
      this.moveHorizontal(300);
    });

    // move vertically
    this.cursors.up.onDown.add( () => {
      this.moveVertical(-300);
    });
    this.cursors.down.onDown.add( () => {
      this.moveVertical(300);
    });

    // stop moving horizontally when the arrow keys are lifted
    let xLambda = () => { this.moveHorizontal(0); };
    this.cursors.left.onUp.add(xLambda);
    this.cursors.right.onUp.add(xLambda);

    // stop moving vertically when the arrow keys are lifted
    let yLambda = () => { this.moveVertical(0); };
    this.cursors.up.onUp.add(yLambda);
    this.cursors.down.onUp.add(yLambda);

    // mouse movement
    this.game.input.addMoveCallback( (pointer) => {
      let outsideHorizontalRect = !Phaser.Rectangle.containsPoint(this.deadHorizontalRect, pointer);
      if(outsideHorizontalRect) {
        this.moveHorizontal(300 * (pointer.x > this.deadHorizontalRect.centerX ? 1 : -1));
      } else {
        this.moveHorizontal(0);
      }

      let outsideVerticalRect = !Phaser.Rectangle.containsPoint(this.deadVerticalRect, pointer);
      if(outsideVerticalRect) {
        this.moveVertical(300 * (pointer.y > this.deadVerticalRect.centerY ? 1 : -1));
      } else {
        this.moveVertical(0);
      }
    });
  }
}