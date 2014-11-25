const CAMERA_MOVEMENT_SPEED = 300;

var containsPoint = (rect, point) => Phaser.Rectangle.containsPoint(rect, point);

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
    this.cursors.left.onDown.add(this.moveHorizontal.bind(this, -CAMERA_MOVEMENT_SPEED));
    this.cursors.right.onDown.add(this.moveHorizontal.bind(this, CAMERA_MOVEMENT_SPEED));

    // stop moving horizontally when the arrow keys are lifted
    let xLambda = () => { this.moveHorizontal(); };
    this.cursors.left.onUp.add(xLambda);
    this.cursors.right.onUp.add(xLambda);
  }

  registerVerticalKeys() {
    // move vertically
    this.cursors.up.onDown.add(this.moveVertical.bind(this, -CAMERA_MOVEMENT_SPEED));
    this.cursors.down.onDown.add(this.moveVertical.bind(this, CAMERA_MOVEMENT_SPEED));

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
    if(!containsPoint(this.deadHorizontalRect, pointer)) {
      this.moveHorizontal(CAMERA_MOVEMENT_SPEED * (pointer.x > this.deadHorizontalRect.centerX ? 1 : -1));
    } else {
      this.moveHorizontal(0);
    }
  }

  // when the mouse is outside the vertical zone, the camera should move
  registerVerticalMovement(pointer) {
    if(!containsPoint(this.deadVerticalRect, pointer)) {
      this.moveVertical(CAMERA_MOVEMENT_SPEED * (pointer.y > this.deadVerticalRect.centerY ? 1 : -1));
    } else {
      this.moveVertical(0);
    }
  }
}