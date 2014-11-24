export default class Entity {

  // x, y are tile coordinates, not pixel coordinates
  constructor({ x, y, speed, spriteKey, maxHealth}) {
    // physics variables
    this.position = { x, y };
    this.direction = { x: 0, y: 0 };

    // visual stuff
    this.sprite = game.add.sprite(x, y, spriteKey);
    this.sprite.anchor.set(0.5);

    // constant acceleration
    this.speed = speed;

    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.sprite.body.collideWorldBounds = true;

    // not physics or visual related variables
    this.maxHealth = maxHealth;
    this.health = this.maxHealth;
    this.dead = false;

    this.AIList = [];
  }

  setDirection({ x, y }) {
    this.direction = { x, y };
  }

  decreaseHealth(value) {
    this.health -= value;
    if(this.health < 0) {
      this.health = 0;
      this.dead = true;
    }
  }

  increaseHealth(value) {
    this.health += value;
    if(this.health > this.maxHealth) {
      this.health = this.maxHealth;
    }
  }

  // TODO decide update lifecycle for AI
  addAI(AI) {
    this.AIList.push(AI);
  }

  preUpdate() {
  }

  update() {
    this.AIList.forEach(function(AI) {
      AI.update();
    });
  }

  postUpdate() {
  }

  render() {
  }
}