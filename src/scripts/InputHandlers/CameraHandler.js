const CAMERA_MOVEMENT_SPEED = 300;
export default class CameraHandler {
  constructor({entityManager, map, cursors, cameraProperties, edgePixels}) {
    this.entityManager = entityManager;
    this.map = map;
    this.cursors = cursors;

    // create a camera unit
    this.entityManager.createCamera(cameraProperties);
    this.camera = this.entityManager.getEntity('camera');
    game.camera.follow(this.camera.sprite);

    this.createHorizontalMouseZone(edgePixels);
    this.createVerticalMouseZone(edgePixels);
  }

  // the zone that triggers horizontal movement
  createHorizontalMouseZone(edgePixels) {
    this.deadHorizontalRect = new Phaser.Rectangle(0, 0, game.width - (edgePixels * 2), game.height);
    this.deadHorizontalRect.centerX = game.camera.view.centerX;
    this.deadHorizontalRect.centerY = game.camera.view.centerY;
  }

  // the zone that triggers vertical movement
  createVerticalMouseZone(edgePixels) {
    this.deadVerticalRect = new Phaser.Rectangle(0, 0, game.width, game.height - (edgePixels * 2));
    this.deadVerticalRect.centerX = game.camera.view.centerX;
    this.deadVerticalRect.centerY = game.camera.view.centerY;
  }

  moveHorizontal(speed) {
    this.camera.sprite.body.velocity.x = speed;
  }

  moveVertical(speed) {
    this.camera.sprite.body.velocity.y = speed;
  }

  handle() {
    this.registerCameraKeys();
    this.registerMouseMovementCallback();
  }

  registerCameraKeys() {
    this.registerHorizontalKeys();
    this.registerVerticalKeys();
  }

  registerHorizontalKeys() {
    // move horizontally
    this.cursors.left.onDown.add( () => {
      this.moveHorizontal(-CAMERA_MOVEMENT_SPEED);
    });
    this.cursors.right.onDown.add( () => {
      this.moveHorizontal(CAMERA_MOVEMENT_SPEED);
    });

    // stop moving horizontally when the arrow keys are lifted
    let xLambda = () => { this.moveHorizontal(0); };
    this.cursors.left.onUp.add(xLambda);
    this.cursors.right.onUp.add(xLambda);
  }

  registerVerticalKeys() {
    // move vertically
    this.cursors.up.onDown.add( () => {
      this.moveVertical(-CAMERA_MOVEMENT_SPEED);
    });
    this.cursors.down.onDown.add( () => {
      this.moveVertical(CAMERA_MOVEMENT_SPEED);
    });

    // stop moving vertically when the arrow keys are lifted
    let yLambda = () => { this.moveVertical(0); };
    this.cursors.up.onUp.add(yLambda);
    this.cursors.down.onUp.add(yLambda);
  }

  registerMouseMovementCallback() {
    game.input.addMoveCallback( (pointer) => {
      this.registerHorizontalMovement(pointer);
      this.registerVerticalMovement(pointer);
    });
  }

  // when the mouse is outside the horizontal dead zone, the camera should move
  registerHorizontalMovement(pointer) {
    let outsideHorizontalRect = !Phaser.Rectangle.containsPoint(this.deadHorizontalRect, pointer);
    if(outsideHorizontalRect) {
      this.moveHorizontal(CAMERA_MOVEMENT_SPEED * (pointer.x > this.deadHorizontalRect.centerX ? 1 : -1));
    } else {
      this.moveHorizontal(0);
    }
  }

  // when the mouse is outside the vertical zone, the camera should move
  registerVerticalMovement(pointer) {
    let outsideVerticalRect = !Phaser.Rectangle.containsPoint(this.deadVerticalRect, pointer);
    if(outsideVerticalRect) {
      this.moveVertical(CAMERA_MOVEMENT_SPEED * (pointer.y > this.deadVerticalRect.centerY ? 1 : -1));
    } else {
      this.moveVertical(0);
    }
  }
}